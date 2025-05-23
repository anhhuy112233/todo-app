import React from 'react'
import { useTodo } from '../../contexts/TodoContext'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { 
  FILTERS, 
  FILTER_LABELS, 
  CATEGORY_LABELS,
  CATEGORIES 
} from '../../constants'

export function TodoFilters() {
  const { state, actions } = useTodo()

  const filterOptions = Object.entries(FILTER_LABELS).map(([value, label]) => ({
    value,
    label
  }))

  const categoryOptions = [
    { value: '', label: 'Tất cả danh mục' },
    ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
      value,
      label
    }))
  ]

  const clearFilters = () => {
    actions.setFilter(FILTERS.ALL)
    actions.setCategoryFilter('')
    actions.setSearchQuery('')
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm tasks..."
              value={state.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <Select
            value={state.filter}
            onChange={actions.setFilter}
            options={filterOptions}
            className="w-full sm:w-auto"
          />
          
          <Select
            value={state.selectedCategory}
            onChange={actions.setCategoryFilter}
            options={categoryOptions}
            className="w-full sm:w-auto"
          />
          
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full sm:w-auto"
          >
            Xóa bộ lọc
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span>Bộ lọc đang áp dụng:</span>
          <span className="font-medium">
            {FILTER_LABELS[state.filter]}
          </span>
          {state.selectedCategory && (
            <>
              <span>•</span>
              <span className="font-medium">
                {CATEGORY_LABELS[state.selectedCategory]}
              </span>
            </>
          )}
          {state.searchQuery && (
            <>
              <span>•</span>
              <span className="font-medium">
                "{state.searchQuery}"
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 