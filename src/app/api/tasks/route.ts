import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '../../../../models/Task';

// GET all tasks for a user
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
    console.log('Fetching tasks for userId:', userId);

    // If Task.userId is ObjectId in schema, Mongoose will cast string automatically
    const tasks = await Task.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    console.log('Found tasks:', tasks.length);

    return NextResponse.json({ success: true, data: tasks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST create new task
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, title, notes, dueDate, priority } = body;

    if (!userId || !title) {
      return NextResponse.json(
        { success: false, error: 'userId and title are required' },
        { status: 400 }
      );
    }

    const task = await Task.create({
      userId,                                     // string is OK; cast by Mongoose
      title: String(title).trim(),
      notes: notes ? String(notes) : '',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority ?? 'medium',
    });

    console.log('Created task:', task._id?.toString?.() ?? task._id);

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create task' },
      { status: 500 }
    );
  }
}
