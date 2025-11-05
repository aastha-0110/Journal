import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Entry from '../../../../models/Entry';

// GET all entries for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    console.log('Fetching entries for userId:', userId); // Debug
    
    const entries = await Entry.find({ userId })
      .sort({ date: -1 })
      .lean();

    console.log('Found entries:', entries.length); // Debug

    return NextResponse.json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

// POST create new entry
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, title, content, mood, date, tags } = body;

    if (!userId || !title || !content || !mood) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const entry = await Entry.create({
      userId,
      title,
      content,
      mood,
      date: date || new Date(),
      tags: tags || [],
    });

    return NextResponse.json(
      {
        success: true,
        data: entry,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create entry' },
      { status: 500 }
    );
  }
}