import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '../../../../../models/Task';

// GET single task (optional, mirrors your entries route style)
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const body = await request.json();

    const task = await Task.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ success: false, error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete task' }, { status: 500 });
  }
}
