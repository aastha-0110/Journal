import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '../../../../../models/Users';

// POST login
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { username, password } = body;

    console.log('Login attempt for username:', username); // Debug

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user by username
    const user = await User.findOne({ username: username.trim() });

    console.log('User found:', user ? 'Yes' : 'No'); // Debug

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    console.log('User has password:', user.password ? 'Yes' : 'No'); // Debug

    // Check password (plain text comparison - NOT PRODUCTION READY)
    // In production, use bcrypt.compare(password, user.password)
    if (user.password !== password) {
      console.log('Password mismatch'); // Debug
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    console.log('Login successful'); // Debug

    // Return user without password
    const userWithoutPassword = {
      _id: user._id,
      username: user.username,
      email: user.email,
      themePreference: user.themePreference,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    );
  }
}