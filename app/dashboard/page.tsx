// app/dashboard/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import TaskCard from '@/components/TaskCard'
import AddTaskForm from '@/components/AddTaskForm'
import { Task } from '@/types'

export default function Dashboard() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | Task['status']>('all')

  useEffect(() => {
    // ✅ Define AND call async function INSIDE the effect
    // This is the exact pattern React docs recommend for data fetching
    async function fetchTasks() {
      const res = await fetch('/api/tasks')
      if (res.status === 401) { router.push('/login'); return }
      const data = await res.json()
      if (data.success) setTasks(data.data)
      setLoading(false)
    }

    fetchTasks()
  }, [router]) // ← only router as dependency, clean and simple

  const handleAdd = (task: Task) => setTasks(prev => [task, ...prev])

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    setTasks(prev => prev.filter(t => t._id !== id))
  }

  const handleStatusChange = async (id: string, status: Task['status']) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    if (data.success) {
      setTasks(prev => prev.map(t => t._id === id ? { ...t, status } : t))
    }
  }

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)
  const counts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {(['all', 'todo', 'in-progress', 'done'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-xl p-4 text-center transition-all ${
                filter === s
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white border border-gray-100 text-gray-600 hover:border-indigo-300'
              }`}
            >
              <div className="text-2xl font-bold">{counts[s]}</div>
              <div className="text-xs capitalize mt-1">{s === 'all' ? 'Total' : s}</div>
            </button>
          ))}
        </div>

        <AddTaskForm onAdd={handleAdd} />

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No tasks found. Add one above! 👆
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}