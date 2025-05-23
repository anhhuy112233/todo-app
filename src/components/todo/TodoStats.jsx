import React from 'react'
import { useTodo } from '../../contexts/TodoContext'
import { CATEGORY_LABELS, TIME_FORMATS } from '../../constants'
import { 
  getTodayTasks, 
  getUpcomingTasks, 
  getTimeStatus, 
  formatDateTime
} from '../../utils/timeUtils'

export function TodoStats() {
  const { state } = useTodo()
  const { todos } = state

  const completedTodos = todos.filter(todo => todo.completed)
  const activeTodos = todos.filter(todo => !todo.completed)
  
  // Time-based statistics
  const overdueTodos = todos.filter(todo => {
    if (!todo.dueDateTime || todo.completed) return false
    return getTimeStatus(todo.dueDateTime, todo.completed) === 'overdue'
  })
  
  const urgentTodos = todos.filter(todo => {
    if (!todo.dueDateTime || todo.completed) return false
    return getTimeStatus(todo.dueDateTime, todo.completed) === 'urgent'
  })
  
  const dueSoonTodos = todos.filter(todo => {
    if (!todo.dueDateTime || todo.completed) return false
    const status = getTimeStatus(todo.dueDateTime, todo.completed)
    return status === 'due-soon' || status === 'urgent'
  })

  const completionRate = todos.length > 0 ? (completedTodos.length / todos.length) * 100 : 0

  const todayTasks = getTodayTasks(todos)
  const upcomingTasks = getUpcomingTasks(todos.filter(t => !t.completed), 7).slice(0, 5)

  const getCategoryStats = () => {
    const stats = {}
    todos.forEach(todo => {
      if (!stats[todo.category]) {
        stats[todo.category] = { total: 0, completed: 0 }
      }
      stats[todo.category].total++
      if (todo.completed) {
        stats[todo.category].completed++
      }
    })
    return stats
  }

  const categoryStats = getCategoryStats()

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        📊 Thống kê & Lịch trình
      </h2>
      
      {/* Main stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600">{todos.length}</div>
          <div className="text-xs text-blue-800">Tổng task</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">{completedTodos.length}</div>
          <div className="text-xs text-green-800">Hoàn thành</div>
        </div>
        
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-xl font-bold text-yellow-600">{activeTodos.length}</div>
          <div className="text-xs text-yellow-800">Đang làm</div>
        </div>
        
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-xl font-bold text-red-600">{overdueTodos.length}</div>
          <div className="text-xs text-red-800">Quá hạn</div>
        </div>
        
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-xl font-bold text-orange-600">{dueSoonTodos.length}</div>
          <div className="text-xs text-orange-800">Gấp</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Tỷ lệ hoàn thành</span>
          <span className="text-sm text-gray-600">{completionRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's tasks */}
        {todayTasks.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
              📅 Hôm nay ({todayTasks.length} task)
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {todayTasks.map(todo => (
                <div key={todo.id} className="text-sm text-blue-700 flex items-center gap-2">
                  <span className={todo.completed ? 'line-through opacity-60' : ''}>
                    {todo.text}
                  </span>
                  <span className="text-xs text-blue-500">
                    {formatDateTime(todo.dueDateTime, TIME_FORMATS.TIME_ONLY)}
                  </span>
                  {todo.completed && <span className="text-green-600">✓</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming tasks */}
        {upcomingTasks.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <h3 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
              🔮 Sắp tới ({upcomingTasks.length} task)
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {upcomingTasks.map(todo => (
                <div key={todo.id} className="text-sm">
                  <div className="text-purple-700 font-medium">{todo.text}</div>
                  <div className="text-xs text-purple-500">
                    {formatDateTime(todo.dueDateTime, TIME_FORMATS.FULL)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Urgent alerts */}
      {urgentTodos.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-medium text-red-800 mb-2 flex items-center gap-2">
            🚨 Cần xử lý ngay ({urgentTodos.length} task)
          </h3>
          <div className="space-y-1">
            {urgentTodos.map(todo => (
              <div key={todo.id} className="text-sm text-red-700 font-medium">
                {todo.text} - {formatDateTime(todo.dueDateTime, TIME_FORMATS.FULL)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category stats */}
      {Object.keys(categoryStats).length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="font-medium mb-3">Thống kê theo danh mục</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(categoryStats).map(([category, stats]) => {
              const rate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
              return (
                <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{CATEGORY_LABELS[category]}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">
                      {stats.completed}/{stats.total}
                    </span>
                    <div className="w-12 bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${rate}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-8">
                      {rate.toFixed(0)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
} 