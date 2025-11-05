import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '../../../../models/Users';

// GET all users (for admin/debugging - can remove in production)
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).select('username email createdAt');
    
    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST create new user (Signup)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { username, password, email } = body;

    // Validation
    if (!username || username.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Create user (storing password as plain text for simplicity - NOT PRODUCTION READY)
    // In production, use bcrypt to hash passwords
    const user = await User.create({
      username: username.trim(),
      password: password, // TODO: Hash this with bcrypt in production
      email: email?.trim() || undefined,
    });

    // Return user without password
    const userWithoutPassword = {
      _id: user._id,
      username: user.username,
      email: user.email,
      themePreference: user.themePreference,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json(
      {
        success: true,
        data: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}