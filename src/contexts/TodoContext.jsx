import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { CATEGORIES, PRIORITIES, FILTERS } from '../constants'
import { createDateTimeString } from '../utils/timeUtils'

const TodoContext = createContext()

const initialState = {
  todos: [],
  filter: FILTERS.ALL,
  selectedCategory: '',
  searchQuery: '',
  darkMode: false,
  notifications: []
}

function todoReducer(state, action) {
  switch (action.type) {
    case 'LOAD_TODOS':
      return { ...state, todos: action.payload }
    
    case 'ADD_TODO':
      const newTodo = {
        id: Date.now(),
        text: action.payload.text,
        completed: false,
        category: action.payload.category || CATEGORIES.PERSONAL,
        priority: action.payload.priority || PRIORITIES.MEDIUM,
        dueDate: action.payload.dueDate || null,
        dueTime: action.payload.dueTime || null,
        dueDateTime: action.payload.dueDate ? 
          createDateTimeString(action.payload.dueDate, action.payload.dueTime) : null,
        reminderMinutes: action.payload.reminderMinutes || 0,
        lastReminderShown: null,
        createdAt: new Date().toISOString()
      }
      return { ...state, todos: [...state.todos, newTodo] }
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      }
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      }
    
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload.id) {
            const updates = action.payload.updates
            const updatedTodo = { ...todo, ...updates }
            
            // Update dueDateTime if dueDate or dueTime changed
            if (updates.dueDate !== undefined || updates.dueTime !== undefined) {
              const newDueDate = updates.dueDate !== undefined ? updates.dueDate : todo.dueDate
              const newDueTime = updates.dueTime !== undefined ? updates.dueTime : todo.dueTime
              updatedTodo.dueDateTime = newDueDate ? 
                createDateTimeString(newDueDate, newDueTime) : null
            }
            
            return updatedTodo
          }
          return todo
        })
      }
    
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    
    case 'SET_CATEGORY_FILTER':
      return { ...state, selectedCategory: action.payload }
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode }
    
    case 'REORDER_TODOS':
      return { ...state, todos: action.payload }
    
    case 'UPDATE_REMINDER_SHOWN':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.todoId
            ? { ...todo, lastReminderShown: action.payload.timestamp }
            : todo
        )
      }
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      }
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload)
      }
    
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] }
    
    default:
      return state
  }
}

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState, (initial) => {
    const saved = localStorage.getItem('todoAppState')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Migrate old todos to new format
      const migratedTodos = parsed.todos?.map(todo => ({
        ...todo,
        dueDate: todo.dueDate || null,
        dueTime: todo.dueTime || null,
        dueDateTime: todo.dueDateTime || (todo.dueDate ? createDateTimeString(todo.dueDate, todo.dueTime) : null),
        reminderMinutes: todo.reminderMinutes || 0,
        lastReminderShown: todo.lastReminderShown || null
      })) || []
      
      return { 
        ...initial, 
        ...parsed, 
        todos: migratedTodos,
        notifications: [] // Reset notifications on load
      }
    }
    return initial
  })

  useEffect(() => {
    const { notifications, ...stateToSave } = state
    localStorage.setItem('todoAppState', JSON.stringify(stateToSave))
  }, [state])

  const actions = {
    addTodo: (todoData) => dispatch({ type: 'ADD_TODO', payload: todoData }),
    toggleTodo: (id) => dispatch({ type: 'TOGGLE_TODO', payload: id }),
    deleteTodo: (id) => dispatch({ type: 'DELETE_TODO', payload: id }),
    updateTodo: (id, updates) => dispatch({ type: 'UPDATE_TODO', payload: { id, updates } }),
    setFilter: (filter) => dispatch({ type: 'SET_FILTER', payload: filter }),
    setCategoryFilter: (category) => dispatch({ type: 'SET_CATEGORY_FILTER', payload: category }),
    setSearchQuery: (query) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
    toggleDarkMode: () => dispatch({ type: 'TOGGLE_DARK_MODE' }),
    reorderTodos: (todos) => dispatch({ type: 'REORDER_TODOS', payload: todos }),
    updateReminderShown: (todoId, timestamp) => dispatch({ 
      type: 'UPDATE_REMINDER_SHOWN', 
      payload: { todoId, timestamp } 
    }),
    addNotification: (notification) => dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { ...notification, id: Date.now() } 
    }),
    removeNotification: (id) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    clearNotifications: () => dispatch({ type: 'CLEAR_NOTIFICATIONS' })
  }

  return (
    <TodoContext.Provider value={{ state, actions }}>
      {children}
    </TodoContext.Provider>
  )
}

export function useTodo() {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider')
  }
  return context
} 