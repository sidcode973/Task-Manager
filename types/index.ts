// types/index.ts

export interface User {
  _id: string
  name: string
  email: string
  createdAt: Date
}

export interface Task {
  _id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type TaskStatus = Task['status']
export type TaskPriority = Task['priority']