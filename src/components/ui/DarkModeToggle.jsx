import React from 'react'
import { useTodo } from '../../contexts/TodoContext'
import { Button } from './Button'

export function DarkModeToggle() {
  const { state, actions } = useTodo()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={actions.toggleDarkMode}
      className="flex items-center gap-2"
    >
      {state.darkMode ? '☀️' : '🌙'}
      {state.darkMode ? 'Light Mode' : 'Dark Mode'}
    </Button>
  )
} 