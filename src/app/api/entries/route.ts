import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Entry from '../../../../models/Entry';
// GET single entry
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const entry = await Entry.findById(id);

    if (!entry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error('Error fetching entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch entry' },
      { status: 500 }
    );
  }
}

// PATCH update entry
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const body = await request.json();

    const entry = await Entry.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!entry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error('Error updating entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update entry' },
      { status: 500 }
    );
  }
}

// DELETE entry
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const entry = await Entry.findByIdAndDelete(id);

    if (!entry) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
}