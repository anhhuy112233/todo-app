import React, { useState, useRef } from 'react'
import { useTodo } from '../../contexts/TodoContext'
import { Button } from '../ui/Button'
import { exportToJSON, exportToCSV, importFromJSON, importFromCSV } from '../../utils/dataExport'

export function DataManagement() {
  const { state, actions } = useTodo()
  const [isImporting, setIsImporting] = useState(false)
  const [importMessage, setImportMessage] = useState('')
  const fileInputRef = useRef(null)

  const handleExportJSON = () => {
    exportToJSON({
      todos: state.todos,
      exportDate: new Date().toISOString(),
      version: '1.0'
    })
  }

  const handleExportCSV = () => {
    exportToCSV(state.todos)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportMessage('')

    try {
      let importedTodos = []
      
      if (file.name.endsWith('.json')) {
        importedTodos = await importFromJSON(file)
      } else if (file.name.endsWith('.csv')) {
        importedTodos = await importFromCSV(file)
      } else {
        throw new Error('Chỉ hỗ trợ file JSON và CSV')
      }

      if (importedTodos.length === 0) {
        throw new Error('Không tìm thấy dữ liệu hợp lệ trong file')
      }

      // Ask user if they want to replace or merge
      const shouldReplace = window.confirm(
        `Tìm thấy ${importedTodos.length} todo items.\n\nBạn muốn:\n- OK: Thay thế hoàn toàn dữ liệu hiện tại\n- Cancel: Thêm vào dữ liệu hiện tại`
      )

      if (shouldReplace) {
        // Replace all todos
        actions.reorderTodos(importedTodos)
        setImportMessage(`✅ Đã thay thế thành công ${importedTodos.length} todo items`)
      } else {
        // Merge with existing todos
        const mergedTodos = [...state.todos, ...importedTodos]
        actions.reorderTodos(mergedTodos)
        setImportMessage(`✅ Đã thêm thành công ${importedTodos.length} todo items`)
      }
    } catch (error) {
      setImportMessage(`❌ Lỗi: ${error.message}`)
    } finally {
      setIsImporting(false)
      e.target.value = '' // Reset file input
    }
  }

  const handleClearAllData = () => {
    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn xóa TẤT CẢ dữ liệu?\n\nHành động này không thể hoàn tác!'
    )
    
    if (confirmed) {
      const doubleConfirmed = window.confirm(
        'Xác nhận lần cuối: Xóa toàn bộ dữ liệu?'
      )
      
      if (doubleConfirmed) {
        actions.reorderTodos([])
        setImportMessage('🗑️ Đã xóa toàn bộ dữ liệu')
      }
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        💾 Quản lý dữ liệu
      </h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Xuất dữ liệu</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleExportJSON}
              disabled={state.todos.length === 0}
            >
              📥 Xuất JSON
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportCSV}
              disabled={state.todos.length === 0}
            >
              📊 Xuất CSV
            </Button>
          </div>
          {state.todos.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Không có dữ liệu để xuất
            </p>
          )}
        </div>

        <div>
          <h3 className="font-medium mb-2">Nhập dữ liệu</h3>
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportClick}
              disabled={isImporting}
            >
              {isImporting ? '⏳ Đang nhập...' : '📤 Nhập từ file'}
            </Button>
            
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearAllData}
              disabled={state.todos.length === 0}
            >
              🗑️ Xóa tất cả
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <p className="text-xs text-gray-500 mt-1">
            Hỗ trợ file JSON và CSV
          </p>
          
          {importMessage && (
            <div className={`
              mt-2 p-2 rounded text-sm
              ${importMessage.includes('❌') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
              }
            `}>
              {importMessage}
            </div>
          )}
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            📋 Hiện có {state.todos.length} todo items • 
            Hoàn thành: {state.todos.filter(t => t.completed).length} • 
            Còn lại: {state.todos.filter(t => !t.completed).length}
          </p>
        </div>
      </div>
    </div>
  )
} 