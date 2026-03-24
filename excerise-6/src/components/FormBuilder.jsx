import QuestionCard from './QuestionCard'

const QUESTION_TYPES = [
  { value: 'short', label: 'Short answer', icon: '—' },
  { value: 'multiple_choice', label: 'Multiple choice', icon: '◉' },
  { value: 'checkboxes', label: 'Checkboxes', icon: '☑' },
  { value: 'dropdown', label: 'Dropdown', icon: '▾' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'time', label: 'Time', icon: '🕐' },
]

export default function FormBuilder({
  form, setForm, addQuestion,
  updateQuestion, deleteQuestion, duplicateQuestion, moveQuestion,
}) {
  return (
    <div className="fb-builder">
      {/* Form header card */}
      <div className="fb-form-header-card">
        <div className="fb-form-header-bar" />
        <div className="fb-form-header-body">
          <input
            className="fb-form-title-input"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Form title"
          />
          <input
            className="fb-form-desc-input"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Form description (optional)"
          />
        </div>
      </div>

      {/* Questions */}
      {form.questions.length === 0 && (
        <div className="fb-empty-state">
          <div className="fb-empty-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="#d1c4e9" strokeWidth="2" />
              <rect x="14" y="16" width="20" height="3" rx="1.5" fill="#9c7cd6" />
              <rect x="14" y="22" width="20" height="3" rx="1.5" fill="#9c7cd6" />
              <rect x="14" y="28" width="13" height="3" rx="1.5" fill="#9c7cd6" />
            </svg>
          </div>
          <p>No questions yet. Add your first question below.</p>
        </div>
      )}

      {form.questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          question={q}
          index={i}
          total={form.questions.length}
          onUpdate={updates => updateQuestion(q.id, updates)}
          onDelete={() => deleteQuestion(q.id)}
          onDuplicate={() => duplicateQuestion(q.id)}
          onMoveUp={() => moveQuestion(q.id, 'up')}
          onMoveDown={() => moveQuestion(q.id, 'down')}
        />
      ))}

      {/* Add question panel */}
      <div className="fb-add-panel">
        <p className="fb-add-label">Add a question</p>
        <div className="fb-add-types">
          {QUESTION_TYPES.map(t => (
            <button
              key={t.value}
              className="fb-add-type-btn"
              onClick={() => addQuestion(t.value)}
              title={t.label}
            >
              <span className="fb-add-type-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
