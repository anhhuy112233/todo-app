import { useMemo } from 'react'
import { FILTERS, PRIORITIES } from '../constants'

export function useFilteredTodos(todos, filter, selectedCategory, searchQuery) {
  return useMemo(() => {
    let filteredTodos = [...todos]

    // Filter by completion status
    if (filter === FILTERS.ACTIVE) {
      filteredTodos = filteredTodos.filter(todo => !todo.completed)
    } else if (filter === FILTERS.COMPLETED) {
      filteredTodos = filteredTodos.filter(todo => todo.completed)
    }

    // Filter by category
    if (selectedCategory) {
      filteredTodos = filteredTodos.filter(todo => todo.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filteredTodos = filteredTodos.filter(todo =>
        todo.text.toLowerCase().includes(query)
      )
    }

    // Sort todos with enhanced time-based sorting
    filteredTodos.sort((a, b) => {
      // First sort by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }

      // For incomplete todos, prioritize by urgency
      if (!a.completed && !b.completed) {
        const now = new Date()
        
        // Check overdue status
        const aOverdue = a.dueDateTime && new Date(a.dueDateTime) < now
        const bOverdue = b.dueDateTime && new Date(b.dueDateTime) < now
        
        if (aOverdue !== bOverdue) {
          return aOverdue ? -1 : 1 // Overdue tasks first
        }
        
        // Check urgent (within 15 minutes)
        const aUrgent = a.dueDateTime && (new Date(a.dueDateTime) - now) <= 15 * 60 * 1000 && (new Date(a.dueDateTime) - now) > 0
        const bUrgent = b.dueDateTime && (new Date(b.dueDateTime) - now) <= 15 * 60 * 1000 && (new Date(b.dueDateTime) - now) > 0
        
        if (aUrgent !== bUrgent) {
          return aUrgent ? -1 : 1 // Urgent tasks first
        }
        
        // Check due soon (within 1 hour)
        const aDueSoon = a.dueDateTime && (new Date(a.dueDateTime) - now) <= 60 * 60 * 1000 && (new Date(a.dueDateTime) - now) > 0
        const bDueSoon = b.dueDateTime && (new Date(b.dueDateTime) - now) <= 60 * 60 * 1000 && (new Date(b.dueDateTime) - now) > 0
        
        if (aDueSoon !== bDueSoon) {
          return aDueSoon ? -1 : 1 // Due soon tasks first
        }
      }

      // Then sort by priority (high to low)
      const priorityOrder = {
        [PRIORITIES.HIGH]: 3,
        [PRIORITIES.MEDIUM]: 2,
        [PRIORITIES.LOW]: 1
      }
      
      const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
      if (priorityDiff !== 0) return priorityDiff

      // Then sort by due date/time (nearest first)
      if (a.dueDateTime && b.dueDateTime) {
        return new Date(a.dueDateTime) - new Date(b.dueDateTime)
      }
      if (a.dueDateTime && !b.dueDateTime) return -1
      if (!a.dueDateTime && b.dueDateTime) return 1

      // Finally sort by created date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    return filteredTodos
  }, [todos, filter, selectedCategory, searchQuery])
} 