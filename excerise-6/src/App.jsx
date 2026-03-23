import { useState } from 'react'
import FormBuilder from './components/FormBuilder'
import './App.css'

const makeId = () => Date.now() + Math.random()

const createQuestion = (type = 'short') => ({
  id: makeId(),
  type,
  title: '',
  description: '',
  required: false,
  options: ['multiple_choice', 'checkboxes', 'dropdown'].includes(type) ? ['Option 1'] : [],
  scaleMin: 1,
  scaleMax: 5,
  scaleMinLabel: '',
  scaleMaxLabel: '',
})

function App() {
  const [form, setForm] = useState({
    title: 'Untitled Form',
    description: '',
    questions: [],
  })

  const addQuestion = (type = 'short') => {
    setForm(f => ({ ...f, questions: [...f.questions, createQuestion(type)] }))
  }

  const updateQuestion = (id, updates) => {
    setForm(f => ({
      ...f,
      questions: f.questions.map(q => (q.id === id ? { ...q, ...updates } : q)),
    }))
  }

  const deleteQuestion = (id) => {
    setForm(f => ({ ...f, questions: f.questions.filter(q => q.id !== id) }))
  }

  const duplicateQuestion = (id) => {
    setForm(f => {
      const idx = f.questions.findIndex(q => q.id === id)
      const copy = { ...f.questions[idx], id: makeId() }
      const qs = [...f.questions]
      qs.splice(idx + 1, 0, copy)
      return { ...f, questions: qs }
    })
  }

  const moveQuestion = (id, dir) => {
    setForm(f => {
      const idx = f.questions.findIndex(q => q.id === id)
      const next = dir === 'up' ? idx - 1 : idx + 1
      if (next < 0 || next >= f.questions.length) return f
      const qs = [...f.questions]
      ;[qs[idx], qs[next]] = [qs[next], qs[idx]]
      return { ...f, questions: qs }
    })
  }

  return (
    <div className="fb-app">
      <header className="fb-header">
        <div className="fb-header-brand">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <rect width="30" height="30" rx="6" fill="#673ab7" />
            <rect x="7" y="7" width="16" height="3" rx="1.5" fill="white" />
            <rect x="7" y="13" width="16" height="3" rx="1.5" fill="white" />
            <rect x="7" y="19" width="10" height="3" rx="1.5" fill="white" />
          </svg>
          <span>Form Builder</span>
        </div>
      </header>

      <main className="fb-main">
        <FormBuilder
          form={form}
          setForm={setForm}
          addQuestion={addQuestion}
          updateQuestion={updateQuestion}
          deleteQuestion={deleteQuestion}
          duplicateQuestion={duplicateQuestion}
          moveQuestion={moveQuestion}
        />
      </main>
    </div>
  )
}

export default App
