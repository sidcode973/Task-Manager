// app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Task from '@/models/Task'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { ApiResponse } from '@/types'

// PATCH update task
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request)
    const payload = token ? verifyToken(token) : null
    if (!payload) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Unauthorized' }, { status: 401 }
      )
    }

    await connectDB()
    const updates = await request.json()

    const task = await Task.findOneAndUpdate(
      { _id: params.id, userId: payload.userId },
      { ...updates },
      { new: true, runValidators: true }
    )

    if (!task) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Task not found' }, { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<typeof task>>({ success: true, data: task })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Server error' }, { status: 500 }
    )
  }
}

// DELETE task
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromRequest(request)
    const payload = token ? verifyToken(token) : null
    if (!payload) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Unauthorized' }, { status: 401 }
      )
    }

    await connectDB()
    const task = await Task.findOneAndDelete({ _id: params.id, userId: payload.userId })

    if (!task) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Task not found' }, { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<null>>({ success: true, message: 'Task deleted' })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Server error' }, { status: 500 }
    )
  }
}