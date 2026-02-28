// components/AddTaskForm.tsx
'use client'
import { useState } from 'react'
import { Task } from '@/types'

interface AddTaskFormProps {
  onAdd: (task: Task) => void
}

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)
    setError('')

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      onAdd(data.data)
      setForm({ title: '', description: '', priority: 'medium' })
    } else {
      setError(data.error || 'Failed to create task')
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Task</h2>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={form.title}
          onChange={(e) => { setForm({ ...form, title: e.target.value }); setError('') }}
          placeholder="Task title..."
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description (optional)..."
          rows={2}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm resize-none"
        />
        <div className="flex gap-3">
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm"
          >
            {loading ? 'Adding...' : '+ Add Task'}
          </button>
        </div>
      </form>
    </div>
  )
}