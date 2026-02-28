// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { signToken } from '@/lib/auth'
import { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      )
    }

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = signToken(user._id.toString())

    const response = NextResponse.json<ApiResponse<{ name: string; email: string }>>(
      { success: true, data: { name: user.name, email: user.email } },
      { status: 200 }
    )

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}