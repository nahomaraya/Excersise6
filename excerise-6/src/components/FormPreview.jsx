import { useState } from 'react'

export default function FormPreview({ form, onSubmit }) {
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const setAnswer = (id, value) => {
    setAnswers(a => ({ ...a, [id]: value }))
    setErrors(e => ({ ...e, [id]: null }))
  }

  const toggleCheckbox = (id, option, checked) => {
    setAnswers(a => {
      const current = a[id] || []
      return {
        ...a,
        [id]: checked ? [...current, option] : current.filter(o => o !== option),
      }
    })
    setErrors(e => ({ ...e, [id]: null }))
  }

  const validate = () => {
    const errs = {}
    form.questions.forEach(q => {
      if (!q.required) return
      const val = answers[q.id]
      if (!val || (Array.isArray(val) && val.length === 0) || val === '') {
        errs[q.id] = 'This is a required question.'
      }
    })
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstErr = document.querySelector('.fb-pq.has-error')
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    onSubmit(answers)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="fb-preview-wrap">
        <div className="fb-thankyou-card">
          <div className="fb-thankyou-icon">✓</div>
          <h2>Your response has been recorded.</h2>
          <p>Thank you for completing this form!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fb-preview-wrap">
      <div className="fb-preview-header-card">
        <div className="fb-preview-top-bar" />
        <div className="fb-preview-header-body">
          <h1 className="fb-preview-form-title">{form.title || 'Untitled Form'}</h1>
          {form.description && (
            <p className="fb-preview-form-desc">{form.description}</p>
          )}
        </div>
      </div>

      {form.questions.length === 0 ? (
        <div className="fb-preview-empty">
          <p>This form has no questions. Switch to the editor to add some.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {form.questions.map((q, i) => (
            <div
              key={q.id}
              className={`fb-pq ${errors[q.id] ? 'has-error' : ''}`}
            >
              <div className="fb-pq-label">
                {q.title || `Question ${i + 1}`}
                {q.required && <span className="fb-required-star"> *</span>}
              </div>
              {q.description && (
                <p className="fb-pq-desc">{q.description}</p>
              )}

              {q.type === 'short' && (
                <input
                  className="fb-pq-input"
                  value={answers[q.id] || ''}
                  onChange={e => setAnswer(q.id, e.target.value)}
                  placeholder="Your answer"
                />
              )}

              {q.type === 'paragraph' && (
                <textarea
                  className="fb-pq-input fb-pq-textarea"
                  value={answers[q.id] || ''}
                  onChange={e => setAnswer(q.id, e.target.value)}
                  placeholder="Your answer"
                  rows={4}
                />
              )}

              {q.type === 'multiple_choice' && (
                <div className="fb-pq-radio-group">
                  {q.options.map((opt, j) => (
                    <label key={j} className="fb-pq-radio-label">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => setAnswer(q.id, opt)}
                      />
                      <span className="fb-custom-radio" />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'checkboxes' && (
                <div className="fb-pq-check-group">
                  {q.options.map((opt, j) => (
                    <label key={j} className="fb-pq-check-label">
                      <input
                        type="checkbox"
                        checked={(answers[q.id] || []).includes(opt)}
                        onChange={e => toggleCheckbox(q.id, opt, e.target.checked)}
                      />
                      <span className="fb-custom-check" />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'dropdown' && (
                <select
                  className="fb-pq-input fb-pq-select"
                  value={answers[q.id] || ''}
                  onChange={e => setAnswer(q.id, e.target.value)}
                >
                  <option value="">Choose an option</option>
                  {q.options.map((opt, j) => (
                    <option key={j} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {q.type === 'linear_scale' && (
                <div className="fb-pq-scale">
                  {q.scaleMinLabel && (
                    <span className="fb-scale-end">{q.scaleMinLabel}</span>
                  )}
                  <div className="fb-scale-options">
                    {Array.from(
                      { length: q.scaleMax - q.scaleMin + 1 },
                      (_, k) => k + q.scaleMin
                    ).map(n => (
                      <label key={n} className="fb-scale-opt">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={n}
                          checked={answers[q.id] === n}
                          onChange={() => setAnswer(q.id, n)}
                        />
                        <span className="fb-scale-num">{n}</span>
                      </label>
                    ))}
                  </div>
                  {q.scaleMaxLabel && (
                    <span className="fb-scale-end">{q.scaleMaxLabel}</span>
                  )}
                </div>
              )}

              {q.type === 'date' && (
                <input
                  type="date"
                  className="fb-pq-input fb-pq-date"
                  value={answers[q.id] || ''}
                  onChange={e => setAnswer(q.id, e.target.value)}
                />
              )}

              {q.type === 'time' && (
                <input
                  type="time"
                  className="fb-pq-input"
                  value={answers[q.id] || ''}
                  onChange={e => setAnswer(q.id, e.target.value)}
                />
              )}

              {errors[q.id] && (
                <p className="fb-pq-error">
                  <span>⚠</span> {errors[q.id]}
                </p>
              )}
            </div>
          ))}

          <div className="fb-submit-row">
            <button type="submit" className="fb-submit-btn">Submit</button>
            <button
              type="button"
              className="fb-clear-btn"
              onClick={() => { setAnswers({}); setErrors({}) }}
            >
              Clear form
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
