import { TIME_FORMATS } from '../constants'

export const formatDateTime = (dateTimeString, format = TIME_FORMATS.FULL) => {
  if (!dateTimeString) return null
  
  const date = new Date(dateTimeString)
  if (isNaN(date.getTime())) return null

  switch (format) {
    case TIME_FORMATS.DATE_ONLY:
      return date.toLocaleDateString('vi-VN')
    
    case TIME_FORMATS.TIME_ONLY:
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    
    case TIME_FORMATS.FULL:
      return date.toLocaleDateString('vi-VN') + ' ' + 
             date.toLocaleTimeString('vi-VN', { 
               hour: '2-digit', 
               minute: '2-digit',
               hour12: false 
             })
    
    case TIME_FORMATS.RELATIVE:
      return getRelativeTime(date)
    
    default:
      return date.toLocaleDateString('vi-VN')
  }
}

export const getRelativeTime = (date) => {
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffMins = Math.round(diffMs / (1000 * 60))
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (Math.abs(diffMins) < 1) {
    return 'Ngay bây giờ'
  } else if (Math.abs(diffMins) < 60) {
    return diffMins > 0 ? `${diffMins} phút nữa` : `${Math.abs(diffMins)} phút trước`
  } else if (Math.abs(diffHours) < 24) {
    return diffHours > 0 ? `${diffHours} giờ nữa` : `${Math.abs(diffHours)} giờ trước`
  } else if (Math.abs(diffDays) < 7) {
    return diffDays > 0 ? `${diffDays} ngày nữa` : `${Math.abs(diffDays)} ngày trước`
  } else {
    return formatDateTime(date, TIME_FORMATS.FULL)
  }
}

export const isOverdue = (dueDateTime, completed = false) => {
  if (!dueDateTime || completed) return false
  return new Date(dueDateTime) < new Date()
}

export const isDueSoon = (dueDateTime, minutesThreshold = 60) => {
  if (!dueDateTime) return false
  const now = new Date()
  const due = new Date(dueDateTime)
  const diffMs = due.getTime() - now.getTime()
  const diffMins = diffMs / (1000 * 60)
  
  return diffMins > 0 && diffMins <= minutesThreshold
}

export const getTimeStatus = (dueDateTime, completed = false) => {
  if (!dueDateTime) return 'no-deadline'
  if (completed) return 'completed'
  
  const now = new Date()
  const due = new Date(dueDateTime)
  const diffMs = due.getTime() - now.getTime()
  const diffMins = diffMs / (1000 * 60)
  
  if (diffMins < 0) return 'overdue'
  if (diffMins <= 15) return 'urgent'
  if (diffMins <= 60) return 'due-soon'
  if (diffMins <= 1440) return 'due-today'
  
  return 'future'
}

export const getTimeStatusColor = (status) => {
  const colors = {
    'overdue': 'bg-red-100 text-red-800 border-red-200',
    'urgent': 'bg-orange-100 text-orange-800 border-orange-200',
    'due-soon': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'due-today': 'bg-blue-100 text-blue-800 border-blue-200',
    'future': 'bg-gray-100 text-gray-600 border-gray-200',
    'completed': 'bg-green-100 text-green-800 border-green-200',
    'no-deadline': 'bg-gray-50 text-gray-500 border-gray-100'
  }
  
  return colors[status] || colors['no-deadline']
}

export const getTimeStatusIcon = (status) => {
  const icons = {
    'overdue': '🚨',
    'urgent': '⚠️',
    'due-soon': '⏰',
    'due-today': '📅',
    'future': '🕐',
    'completed': '✅',
    'no-deadline': '📝'
  }
  
  return icons[status] || icons['no-deadline']
}

export const shouldShowReminder = (dueDateTime, reminderMinutes, lastReminderShown) => {
  if (!dueDateTime || !reminderMinutes) return false
  
  const now = new Date()
  const due = new Date(dueDateTime)
  const reminderTime = new Date(due.getTime() - (reminderMinutes * 60 * 1000))
  
  // Should show if we've passed the reminder time but haven't shown it yet
  return now >= reminderTime && 
         now < due && 
         (!lastReminderShown || new Date(lastReminderShown) < reminderTime)
}

export const getTodayTasks = (todos) => {
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
  
  return todos.filter(todo => {
    if (!todo.dueDateTime) return false
    const dueDate = new Date(todo.dueDateTime)
    return dueDate >= todayStart && dueDate <= todayEnd
  })
}

export const getUpcomingTasks = (todos, daysAhead = 7) => {
  const now = new Date()
  const future = new Date(now.getTime() + (daysAhead * 24 * 60 * 60 * 1000))
  
  return todos.filter(todo => {
    if (!todo.dueDateTime) return false
    const dueDate = new Date(todo.dueDateTime)
    return dueDate > now && dueDate <= future
  }).sort((a, b) => new Date(a.dueDateTime) - new Date(b.dueDateTime))
}

export const createDateTimeString = (date, time) => {
  if (!date) return null
  
  if (time) {
    return `${date}T${time}:00`
  } else {
    // If no time specified, set to end of day
    return `${date}T23:59:00`
  }
} 