// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { signToken } from '@/lib/auth'
import { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({ name, email, password: hashedPassword })
    const token = signToken(user._id.toString())

    const response = NextResponse.json<ApiResponse<{ name: string; email: string }>>(
      { success: true, data: { name: user.name, email: user.email } },
      { status: 201 }
    )

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}