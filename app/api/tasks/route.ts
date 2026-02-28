// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Task from '@/models/Task'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { ApiResponse } from '@/types'

// GET all tasks for logged-in user
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Unauthorized' }, { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid token' }, { status: 401 }
      )
    }

    await connectDB()
    const tasks = await Task.find({ userId: payload.userId }).sort({ createdAt: -1 })

    return NextResponse.json<ApiResponse<typeof tasks>>(
      { success: true, data: tasks }
    )
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Server error' }, { status: 500 }
    )
  }
}

// POST create new task
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Unauthorized' }, { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid token' }, { status: 401 }
      )
    }

    await connectDB()
    const { title, description, priority } = await request.json()

    if (!title?.trim()) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Title is required' }, { status: 400 }
      )
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || '',
      priority: priority || 'medium',
      userId: payload.userId,
    })

    return NextResponse.json<ApiResponse<typeof task>>(
      { success: true, data: task }, { status: 201 }
    )
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Server error' }, { status: 500 }
    )
  }
}