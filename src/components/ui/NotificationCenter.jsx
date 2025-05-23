import React, { useEffect } from 'react'
import { useTodo } from '../../contexts/TodoContext'
import { Button } from './Button'
import { TIME_FORMATS } from '../../constants'
import { shouldShowReminder, formatDateTime } from '../../utils/timeUtils'

export function NotificationCenter() {
  const { state, actions } = useTodo()

  // Check for reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date().toISOString()
      
      state.todos.forEach(todo => {
        if (todo.completed || !todo.dueDateTime || !todo.reminderMinutes) return
        
        if (shouldShowReminder(todo.dueDateTime, todo.reminderMinutes, todo.lastReminderShown)) {
          actions.addNotification({
            type: 'reminder',
            title: '🔔 Nhắc nhở task',
            message: `"${todo.text}" sẽ đến hạn lúc ${formatDateTime(todo.dueDateTime, TIME_FORMATS.FULL)}`,
            todoId: todo.id,
            timestamp: now
          })
          
          actions.updateReminderShown(todo.id, now)
        }
      })
    }

    // Check immediately and then every minute
    checkReminders()
    const interval = setInterval(checkReminders, 60000)

    return () => clearInterval(interval)
  }, [state.todos, actions])

  // Auto-remove notifications after 10 seconds
  useEffect(() => {
    state.notifications.forEach(notification => {
      if (!notification.autoRemoved) {
        const timer = setTimeout(() => {
          actions.removeNotification(notification.id)
        }, 10000)

        // Mark as having auto-removal set to prevent multiple timers
        notification.autoRemoved = true

        return () => clearTimeout(timer)
      }
    })
  }, [state.notifications, actions])

  if (state.notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {state.notifications.map(notification => (
        <div
          key={notification.id}
          className={`
            p-4 rounded-lg shadow-lg border-l-4 bg-white
            animate-bounce-in
            ${notification.type === 'reminder' ? 'border-l-blue-500' : 
              notification.type === 'warning' ? 'border-l-yellow-500' :
              notification.type === 'error' ? 'border-l-red-500' :
              'border-l-green-500'}
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => actions.removeNotification(notification.id)}
              className="ml-3 text-xs px-2 py-1"
            >
              ✕
            </Button>
          </div>
          
          {notification.todoId && (
            <div className="mt-2 flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  // Mark todo as completed
                  actions.toggleTodo(notification.todoId)
                  actions.removeNotification(notification.id)
                }}
                className="text-xs"
              >
                ✓ Hoàn thành
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Extend by 1 hour
                  const todo = state.todos.find(t => t.id === notification.todoId)
                  if (todo && todo.dueDateTime) {
                    const newTime = new Date(todo.dueDateTime)
                    newTime.setHours(newTime.getHours() + 1)
                    actions.updateTodo(notification.todoId, {
                      dueDateTime: newTime.toISOString()
                    })
                  }
                  actions.removeNotification(notification.id)
                }}
                className="text-xs"
              >
                ⏰ +1h
              </Button>
            </div>
          )}
        </div>
      ))}
      
      {state.notifications.length > 1 && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={actions.clearNotifications}
            className="text-xs"
          >
            Xóa tất cả thông báo
          </Button>
        </div>
      )}
    </div>
  )
} 