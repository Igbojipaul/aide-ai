import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
    console.log('MongoDB URI preview:', process.env.MONGODB_URI?.substring(0, 20) + '...');
    
    await dbConnect();
    
    // Test the connection
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    console.log('📊 MongoDB connection state:', states[dbState as keyof typeof states]);
    
    // Try a simple operation
    const collections = await mongoose.connection.db?.listCollections().toArray();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      connectionState: states[dbState as keyof typeof states],
      collections: collections?.map(col => col.name) || []
    });
    
  } catch (error: any) {
    console.error('❌ Database connection test failed:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      errorType: error.constructor.name,
      mongodbUri: process.env.MONGODB_URI ? 'Present' : 'Missing'
    }, { status: 500 });
  }
}