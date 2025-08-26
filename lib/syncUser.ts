import { auth, currentUser } from "@clerk/nextjs/server";
import dbConnect from "./mongodb";
import { User } from "@/models/User";

export async function ensureUserSynced() {
  const { userId } = await auth();

  // Not signed in
  if (!userId) return null;

  await dbConnect();

  // Check if user exists in MongoDB
  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    // Fetch full Clerk user data
    const clerkUser = await currentUser();

    user = await User.create({
      clerkId: userId,
      email: clerkUser?.emailAddresses[0].emailAddress,
      name: clerkUser?.fullName || "Anonymous",
      imageUrl: clerkUser?.imageUrl,
    });

    console.log("✅ New user added to DB:", user.email);
  }

  return user;
}
