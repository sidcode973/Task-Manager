// components/TaskCard.tsx
import { Task } from '@/types'

const priorityColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

const statusColors = {
  'todo': 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  'done': 'bg-green-100 text-green-700',
}

interface TaskCardProps {
  task: Task
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Task['status']) => void
}

export default function TaskCard({ task, onDelete, onStatusChange }: TaskCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className={`font-semibold text-gray-800 flex-1 ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h3>
        <button
          onClick={() => onDelete(task._id)}
          className="text-gray-300 hover:text-red-500 ml-3 text-lg leading-none transition-colors"
        >
          ×
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-500 text-sm mb-4">{task.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Priority Badge */}
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>

        {/* Status Badge */}
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[task.status]}`}>
          {task.status}
        </span>

        {/* Status Changer */}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value as Task['status'])}
          className="ml-auto text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  )
}