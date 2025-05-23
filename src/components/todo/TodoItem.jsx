import React from 'react'
import { useTodo } from '../../contexts/TodoContext'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { 
  CATEGORY_LABELS, 
  CATEGORY_COLORS, 
  PRIORITY_LABELS, 
  PRIORITY_COLORS,
  PRIORITIES,
  TIME_FORMATS 
} from '../../constants'
import { 
  formatDateTime, 
  getTimeStatus, 
  getTimeStatusColor, 
  getTimeStatusIcon,
  getRelativeTime
} from '../../utils/timeUtils'

export function TodoItem({ todo }) {
  const { actions } = useTodo()

  const handleToggle = () => {
    actions.toggleTodo(todo.id)
  }

  const handleDelete = () => {
    actions.deleteTodo(todo.id)
  }

  const timeStatus = getTimeStatus(todo.dueDateTime, todo.completed)
  const statusColor = getTimeStatusColor(timeStatus)
  const statusIcon = getTimeStatusIcon(timeStatus)

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case PRIORITIES.HIGH:
        return '🔴'
      case PRIORITIES.MEDIUM:
        return '🟡'
      case PRIORITIES.LOW:
        return '🟢'
      default:
        return ''
    }
  }

  return (
    <div className={`
      bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200
      todo-item fade-in
      ${todo.completed ? 'opacity-60' : ''}
      ${timeStatus === 'overdue' ? 'border-red-300 bg-red-50' : 
        timeStatus === 'urgent' ? 'border-orange-300 bg-orange-50' :
        timeStatus === 'due-soon' ? 'border-yellow-300 bg-yellow-50' :
        'border-gray-200'}
    `}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          
          <div className="flex-1 space-y-2">
            <p className={`
              text-sm font-medium leading-relaxed
              ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}
            `}>
              {todo.text}
            </p>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={CATEGORY_COLORS[todo.category]}>
                {CATEGORY_LABELS[todo.category]}
              </Badge>
              
              <span className={`text-xs font-medium ${PRIORITY_COLORS[todo.priority]}`}>
                {getPriorityIcon(todo.priority)} {PRIORITY_LABELS[todo.priority]}
              </span>
              
              {todo.dueDateTime && (
                <div className="flex flex-col gap-1">
                  <span className={`
                    text-xs px-2 py-1 rounded border font-medium
                    ${statusColor}
                  `}>
                    {statusIcon} {formatDateTime(todo.dueDateTime, TIME_FORMATS.FULL)}
                  </span>
                  
                  {timeStatus !== 'completed' && timeStatus !== 'no-deadline' && (
                    <span className="text-xs text-gray-500 italic">
                      {getRelativeTime(new Date(todo.dueDateTime))}
                    </span>
                  )}
                </div>
              )}
              
              {todo.reminderMinutes > 0 && !todo.completed && (
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  🔔 Nhắc {todo.reminderMinutes >= 1440 ? 
                    `${Math.floor(todo.reminderMinutes / 1440)} ngày` : 
                    todo.reminderMinutes >= 60 ? 
                      `${Math.floor(todo.reminderMinutes / 60)} giờ` : 
                      `${todo.reminderMinutes} phút`} trước
                </span>
              )}
            </div>
            
            {/* Time status indicators */}
            {timeStatus === 'overdue' && !todo.completed && (
              <div className="text-xs text-red-600 font-medium">
                🚨 Đã quá hạn!
              </div>
            )}
            
            {timeStatus === 'urgent' && !todo.completed && (
              <div className="text-xs text-orange-600 font-medium animate-pulse">
                ⚠️ Sắp đến hạn trong 15 phút!
              </div>
            )}
            
            {timeStatus === 'due-soon' && !todo.completed && (
              <div className="text-xs text-yellow-600 font-medium">
                ⏰ Sắp đến hạn trong 1 giờ
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            className="flex-shrink-0"
          >
            🗑️
          </Button>
          
          {/* Quick actions for time */}
          {todo.dueDateTime && !todo.completed && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newTime = new Date(todo.dueDateTime)
                newTime.setHours(newTime.getHours() + 1)
                actions.updateTodo(todo.id, {
                  dueDateTime: newTime.toISOString()
                })
              }}
              className="text-xs px-2 py-1"
              title="Gia hạn 1 giờ"
            >
              +1h
            </Button>
          )}
        </div>
      </div>
      
      {/* Progress indicator for time */}
      {todo.dueDateTime && !todo.completed && timeStatus !== 'overdue' && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Thời gian còn lại</span>
            <span>{getRelativeTime(new Date(todo.dueDateTime))}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${
                timeStatus === 'urgent' ? 'bg-red-500' :
                timeStatus === 'due-soon' ? 'bg-yellow-500' :
                timeStatus === 'due-today' ? 'bg-blue-500' :
                'bg-green-500'
              }`}
              style={{ 
                width: `${Math.max(0, Math.min(100, 
                  100 - ((new Date().getTime() - new Date(todo.createdAt).getTime()) / 
                        (new Date(todo.dueDateTime).getTime() - new Date(todo.createdAt).getTime())) * 100
                ))}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
} 