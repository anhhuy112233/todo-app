import React from 'react'
import { TodoProvider, useTodo } from './contexts/TodoContext'
import { AddTodoForm } from './components/todo/AddTodoForm'
import { TodoFilters } from './components/todo/TodoFilters'
import { TodoItem } from './components/todo/TodoItem'
import { TodoStats } from './components/todo/TodoStats'
import { DataManagement } from './components/todo/DataManagement'
import { DarkModeToggle } from './components/ui/DarkModeToggle'
import { NotificationCenter } from './components/ui/NotificationCenter'
import { useFilteredTodos } from './hooks/useFilteredTodos'

function TodoApp() {
  const { state } = useTodo()
  const filteredTodos = useFilteredTodos(
    state.todos,
    state.filter,
    state.selectedCategory,
    state.searchQuery
  )

  return (
    <div className={`min-h-screen transition-colors ${
      state.darkMode 
        ? 'bg-gray-900' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      {/* Notification Center */}
      <NotificationCenter />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className={`text-center mb-8 p-6 rounded-lg ${
          state.darkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white shadow-lg border border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h1 className={`text-3xl font-bold ${
              state.darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              ⏰ Todo App Pro
            </h1>
            <DarkModeToggle />
          </div>
          <p className={`${
            state.darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Quản lý công việc với thời gian thông minh & nhắc nhở tự động
          </p>
        </div>

        {/* Stats Dashboard */}
        <TodoStats />

        {/* Add Todo Form */}
        <AddTodoForm />

        {/* Filters */}
        <TodoFilters />

        {/* Todo List */}
        <div className="mb-8">
          {filteredTodos.length === 0 ? (
            <div className={`text-center py-12 rounded-lg ${
              state.darkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              {state.todos.length === 0 ? (
                <div>
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className={`text-lg font-medium mb-2 ${
                    state.darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Chưa có task nào
                  </h3>
                  <p className={`${
                    state.darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Hãy thêm task đầu tiên với thời gian cụ thể!
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className={`text-lg font-medium mb-2 ${
                    state.darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Không tìm thấy task nào
                  </h3>
                  <p className={`${
                    state.darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`text-sm mb-3 flex justify-between items-center ${
                state.darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <span>Hiển thị {filteredTodos.length} / {state.todos.length} tasks</span>
                <span className="text-xs">
                  Sắp xếp: Ưu tiên → Thời gian → Tạo mới
                </span>
              </div>
              {filteredTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </div>

        {/* Data Management */}
        <DataManagement />

        {/* Footer */}
        <div className={`text-center mt-8 py-4 text-sm ${
          state.darkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <div className="flex justify-center items-center gap-4 mb-2">
            <span>⏰ Todo App Pro v2.1</span>
            <span>•</span>
            <span>Made with ❤️ by AI Assistant</span>
          </div>
          <div className="text-xs">
            Tính năng: Categories • Priority • Date & Time • Search • Dark Mode • Statistics • Export/Import • Smart Reminders
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <TodoProvider>
      <TodoApp />
    </TodoProvider>
  )
}