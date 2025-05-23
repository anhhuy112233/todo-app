export const exportToJSON = (data) => {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `todos-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const exportToCSV = (todos) => {
  const headers = ['ID', 'Text', 'Completed', 'Category', 'Priority', 'Due Date', 'Created At']
  
  const csvContent = [
    headers.join(','),
    ...todos.map(todo => [
      todo.id,
      `"${todo.text.replace(/"/g, '""')}"`, // Escape quotes
      todo.completed ? 'Yes' : 'No',
      todo.category,
      todo.priority,
      todo.dueDate || '',
      todo.createdAt
    ].join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `todos-export-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        // Validate data structure
        if (Array.isArray(data) || (data.todos && Array.isArray(data.todos))) {
          const todos = Array.isArray(data) ? data : data.todos
          
          // Validate each todo item
          const validTodos = todos.filter(todo => 
            todo && 
            typeof todo.text === 'string' && 
            typeof todo.completed === 'boolean'
          ).map(todo => ({
            id: todo.id || Date.now() + Math.random(),
            text: todo.text,
            completed: todo.completed,
            category: todo.category || 'personal',
            priority: todo.priority || 'medium',
            dueDate: todo.dueDate || null,
            createdAt: todo.createdAt || new Date().toISOString()
          }))
          
          resolve(validTodos)
        } else {
          reject(new Error('Invalid file format'))
        }
      } catch (error) {
        reject(new Error('Failed to parse JSON file'))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export const importFromCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length < 2) {
          reject(new Error('CSV file must have at least a header and one data row'))
          return
        }
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
        const todos = []
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',')
          
          if (values.length >= 3) {
            const todo = {
              id: Date.now() + Math.random() + i,
              text: values[1]?.replace(/^"|"$/g, '').replace(/""/g, '"') || `Task ${i}`,
              completed: values[2]?.toLowerCase().trim() === 'yes',
              category: values[3]?.trim() || 'personal',
              priority: values[4]?.trim() || 'medium',
              dueDate: values[5]?.trim() || null,
              createdAt: values[6]?.trim() || new Date().toISOString()
            }
            todos.push(todo)
          }
        }
        
        resolve(todos)
      } catch (error) {
        reject(new Error('Failed to parse CSV file'))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
} 