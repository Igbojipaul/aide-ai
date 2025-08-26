import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';


export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing WEBHOOK_SECRET' }, { status: 500 });
  }

  // Get headers and body
  const headers = req.headers;
  const svix_id = headers.get('svix-id');
  const svix_timestamp = headers.get('svix-timestamp');
  const svix_signature = headers.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 });
  }

  // Verify webhook
  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  type SvixEvent = {
    type: string;
    data: {
      id?: string;
      email_addresses?: { email_address: string }[];
      first_name?: string;
      last_name?: string;
      image_url?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };

  let evt: SvixEvent;
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as SvixEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }

  // Handle user.created event
  if (evt.type === 'user.created') {
    try {
      await dbConnect();
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      const user = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address,
        firstName: first_name,
        lastName: last_name,
        photo: image_url,
      };

      // Upsert user
      await User.updateOne({ clerkId: id }, { $set: user }, { upsert: true });

      return NextResponse.json({ message: 'User created in MongoDB' }, { status: 201 });
    } catch (error) {
      console.error('Error saving user to MongoDB:', error);
      return NextResponse.json({ error: 'Failed to save user to MongoDB' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}