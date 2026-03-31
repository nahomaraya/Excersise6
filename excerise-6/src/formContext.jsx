import { createContext, useContext, useState } from 'react'

const FormContext = createContext(null)

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

export function FormProvider({ children }) {
  const [form, setForm] = useState({
    title: 'Untitled Form',
    description: '',
    questions: [],
  })
  const [responses, setResponses] = useState([])

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

  const onSubmit = (answers) => {
    setResponses(r => [...r, { answers, timestamp: new Date().toISOString() }])
  }

  return (
    <FormContext.Provider value={{
      form, setForm,
      addQuestion, updateQuestion, deleteQuestion, duplicateQuestion, moveQuestion,
      responses, onSubmit,
    }}>
      {children}
    </FormContext.Provider>
  )
}

export function useForm() {
  return useContext(FormContext)
}
