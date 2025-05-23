export const CATEGORIES = {
  PERSONAL: 'personal',
  WORK: 'work',
  SHOPPING: 'shopping',
  HEALTH: 'health',
  STUDY: 'study'
}

export const CATEGORY_LABELS = {
  [CATEGORIES.PERSONAL]: 'Cá nhân',
  [CATEGORIES.WORK]: 'Công việc',
  [CATEGORIES.SHOPPING]: 'Mua sắm',
  [CATEGORIES.HEALTH]: 'Sức khỏe',
  [CATEGORIES.STUDY]: 'Học tập'
}

export const CATEGORY_COLORS = {
  [CATEGORIES.PERSONAL]: 'bg-blue-100 text-blue-800',
  [CATEGORIES.WORK]: 'bg-green-100 text-green-800',
  [CATEGORIES.SHOPPING]: 'bg-purple-100 text-purple-800',
  [CATEGORIES.HEALTH]: 'bg-red-100 text-red-800',
  [CATEGORIES.STUDY]: 'bg-yellow-100 text-yellow-800'
}

export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
}

export const PRIORITY_LABELS = {
  [PRIORITIES.LOW]: 'Thấp',
  [PRIORITIES.MEDIUM]: 'Trung bình',
  [PRIORITIES.HIGH]: 'Cao'
}

export const PRIORITY_COLORS = {
  [PRIORITIES.LOW]: 'text-green-600',
  [PRIORITIES.MEDIUM]: 'text-yellow-600',
  [PRIORITIES.HIGH]: 'text-red-600'
}

export const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed'
}

export const FILTER_LABELS = {
  [FILTERS.ALL]: 'Tất cả',
  [FILTERS.ACTIVE]: 'Chưa hoàn thành',
  [FILTERS.COMPLETED]: 'Đã hoàn thành'
}

// Time-related constants
export const TIME_FORMATS = {
  FULL: 'full', // DD/MM/YYYY HH:mm
  DATE_ONLY: 'date', // DD/MM/YYYY
  TIME_ONLY: 'time', // HH:mm
  RELATIVE: 'relative' // "2 giờ nữa", "1 ngày trước"
}

export const REMINDER_OPTIONS = [
  { value: 0, label: 'Không nhắc nhở' },
  { value: 5, label: '5 phút trước' },
  { value: 15, label: '15 phút trước' },
  { value: 30, label: '30 phút trước' },
  { value: 60, label: '1 giờ trước' },
  { value: 1440, label: '1 ngày trước' }
]

export const QUICK_TIME_OPTIONS = [
  { label: 'Hôm nay 9:00', value: () => {
    const today = new Date()
    today.setHours(9, 0, 0, 0)
    return today.toISOString().slice(0, 16)
  }},
  { label: 'Hôm nay 17:00', value: () => {
    const today = new Date()
    today.setHours(17, 0, 0, 0)
    return today.toISOString().slice(0, 16)
  }},
  { label: 'Mai 9:00', value: () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)
    return tomorrow.toISOString().slice(0, 16)
  }},
  { label: 'Cuối tuần', value: () => {
    const weekend = new Date()
    const daysToSaturday = 6 - weekend.getDay()
    weekend.setDate(weekend.getDate() + daysToSaturday)
    weekend.setHours(10, 0, 0, 0)
    return weekend.toISOString().slice(0, 16)
  }}
] 