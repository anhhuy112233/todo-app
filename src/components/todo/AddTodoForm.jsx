import React, { useState } from 'react'
import { useTodo } from '../../contexts/TodoContext'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { 
  CATEGORIES, 
  CATEGORY_LABELS, 
  PRIORITIES, 
  PRIORITY_LABELS,
  REMINDER_OPTIONS,
  QUICK_TIME_OPTIONS
} from '../../constants'

export function AddTodoForm() {
  const { actions } = useTodo()
  const [formData, setFormData] = useState({
    text: '',
    category: CATEGORIES.PERSONAL,
    priority: PRIORITIES.MEDIUM,
    dueDate: '',
    dueTime: '',
    reminderMinutes: 0
  })
  const [showAdvanced, setShowAdvanced] = useState(false)

  const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label
  }))

  const priorityOptions = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
    value,
    label
  }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.text.trim() === '') return

    actions.addTodo({
      text: formData.text,
      category: formData.category,
      priority: formData.priority,
      dueDate: formData.dueDate || null,
      dueTime: formData.dueTime || null,
      reminderMinutes: parseInt(formData.reminderMinutes) || 0
    })

    setFormData({
      text: '',
      category: CATEGORIES.PERSONAL,
      priority: PRIORITIES.MEDIUM,
      dueDate: '',
      dueTime: '',
      reminderMinutes: 0
    })
    setShowAdvanced(false)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleQuickTime = (quickTimeValue) => {
    const datetime = quickTimeValue()
    const [date, time] = datetime.split('T')
    setFormData(prev => ({
      ...prev,
      dueDate: date,
      dueTime: time
    }))
  }

  const clearDateTime = () => {
    setFormData(prev => ({
      ...prev,
      dueDate: '',
      dueTime: '',
      reminderMinutes: 0
    }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        ➕ Thêm task mới
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.text}
            onChange={(e) => handleChange('text', e.target.value)}
            placeholder="Nhập task mới..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" disabled={!formData.text.trim()}>
            Thêm
          </Button>
        </div>

        {/* Basic options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select
            value={formData.category}
            onChange={(value) => handleChange('category', value)}
            options={categoryOptions}
            className="w-full"
          />
          
          <Select
            value={formData.priority}
            onChange={(value) => handleChange('priority', value)}
            options={priorityOptions}
            className="w-full"
          />
        </div>

        {/* Quick time buttons */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {QUICK_TIME_OPTIONS.map((option, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickTime(option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs"
            >
              {showAdvanced ? '🔼 Ẩn' : '🔽 Tùy chỉnh'}
            </Button>
          </div>
        </div>

        {/* Advanced date/time options */}
        {showAdvanced && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-sm text-gray-700">Tùy chỉnh thời gian</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Ngày hạn
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Giờ hạn
                </label>
                <input
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => handleChange('dueTime', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Nhắc nhở
                </label>
                <Select
                  value={formData.reminderMinutes}
                  onChange={(value) => handleChange('reminderMinutes', value)}
                  options={REMINDER_OPTIONS}
                  className="w-full text-sm"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {formData.dueDate && (
                  <span>
                    📅 {new Date(formData.dueDate + (formData.dueTime ? `T${formData.dueTime}` : '')).toLocaleDateString('vi-VN')}
                    {formData.dueTime && ` lúc ${formData.dueTime}`}
                  </span>
                )}
              </div>
              
              {(formData.dueDate || formData.dueTime) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearDateTime}
                  className="text-xs"
                >
                  ❌ Xóa thời gian
                </Button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  )
} 