import { useState } from 'react'

const TYPE_LABELS = {
  short: 'Short answer',
  paragraph: 'Paragraph',
  multiple_choice: 'Multiple choice',
  checkboxes: 'Checkboxes',
  dropdown: 'Dropdown',
  linear_scale: 'Linear scale',
  date: 'Date',
  time: 'Time',
}

const HAS_OPTIONS = ['multiple_choice', 'checkboxes', 'dropdown']

function OptionsEditor({ question, onUpdate }) {
  const addOption = () =>
    onUpdate({ options: [...question.options, `Option ${question.options.length + 1}`] })

  const updateOption = (i, val) => {
    const opts = [...question.options]
    opts[i] = val
    onUpdate({ options: opts })
  }

  const removeOption = (i) =>
    onUpdate({ options: question.options.filter((_, idx) => idx !== i) })

  return (
    <div className="fb-options">
      {question.options.map((opt, i) => (
        <div key={i} className="fb-option-row">
          <span className="fb-option-marker">
            {question.type === 'multiple_choice' && <span className="fb-marker-radio" />}
            {question.type === 'checkboxes' && <span className="fb-marker-check" />}
            {question.type === 'dropdown' && (
              <span className="fb-marker-num">{i + 1}.</span>
            )}
          </span>
          <input
            className="fb-option-input"
            value={opt}
            onChange={e => updateOption(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
          />
          {question.options.length > 1 && (
            <button className="fb-option-del" onClick={() => removeOption(i)} title="Remove option">
              ✕
            </button>
          )}
        </div>
      ))}
      <button className="fb-add-option" onClick={addOption}>+ Add option</button>
    </div>
  )
}

function LinearScaleConfig({ question, onUpdate }) {
  return (
    <div className="fb-scale-config">
      <div className="fb-scale-range-row">
        <div className="fb-scale-range-item">
          <label>Min</label>
          <select
            value={question.scaleMin}
            onChange={e => onUpdate({ scaleMin: Number(e.target.value) })}
          >
            {[0, 1].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <input
            className="fb-scale-label-input"
            value={question.scaleMinLabel}
            onChange={e => onUpdate({ scaleMinLabel: e.target.value })}
            placeholder="Label (optional)"
          />
        </div>
        <span className="fb-scale-to">to</span>
        <div className="fb-scale-range-item">
          <label>Max</label>
          <select
            value={question.scaleMax}
            onChange={e => onUpdate({ scaleMax: Number(e.target.value) })}
          >
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <input
            className="fb-scale-label-input"
            value={question.scaleMaxLabel}
            onChange={e => onUpdate({ scaleMaxLabel: e.target.value })}
            placeholder="Label (optional)"
          />
        </div>
      </div>
      <div className="fb-scale-ticks">
        {Array.from(
          { length: question.scaleMax - question.scaleMin + 1 },
          (_, i) => i + question.scaleMin
        ).map(n => (
          <span key={n} className="fb-scale-tick">{n}</span>
        ))}
      </div>
    </div>
  )
}

function AnswerPreview({ type }) {
  if (type === 'short') {
    return <input disabled className="fb-answer-preview" placeholder="Short answer text" />
  }
  if (type === 'paragraph') {
    return <textarea disabled className="fb-answer-preview fb-answer-textarea" placeholder="Long answer text" rows={3} />
  }
  if (type === 'date') {
    return <input disabled type="date" className="fb-answer-preview" />
  }
  if (type === 'time') {
    return <input disabled type="time" className="fb-answer-preview" />
  }
  return null
}

function QuestionFooter({ question, index, total, onUpdate, onDelete, onDuplicate, onMoveUp, onMoveDown }) {
  return (
    <div className="fb-question-footer">
      <div className="fb-q-actions">
        <button
          className="fb-icon-btn"
          title="Move up"
          onClick={onMoveUp}
          disabled={index === 0}
        >↑</button>
        <button
          className="fb-icon-btn"
          title="Move down"
          onClick={onMoveDown}
          disabled={index === total - 1}
        >↓</button>
        <button className="fb-icon-btn" title="Duplicate" onClick={onDuplicate}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <button className="fb-icon-btn fb-icon-btn-del" title="Delete" onClick={onDelete}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      </div>

      <label className="fb-required-label">
        <span>Required</span>
        <span className="fb-toggle">
          <input
            type="checkbox"
            checked={question.required}
            onChange={e => onUpdate({ required: e.target.checked })}
          />
          <span className="fb-toggle-track">
            <span className="fb-toggle-thumb" />
          </span>
        </span>
      </label>
    </div>
  )
}

export default function QuestionCard({
  question, index, total,
  onUpdate, onDelete, onDuplicate, onMoveUp, onMoveDown,
}) {
  const [focused, setFocused] = useState(false)

  const handleTypeChange = (e) => {
    const newType = e.target.value
    onUpdate({
      type: newType,
      options:
        HAS_OPTIONS.includes(newType) && question.options.length === 0
          ? ['Option 1']
          : question.options,
    })
  }

  return (
    <div
      className={`fb-question-card ${focused ? 'focused' : ''}`}
      onFocus={() => setFocused(true)}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
      }}
    >
      {focused && <div className="fb-question-accent-bar" />}

      <div className="fb-question-top">
        <span className="fb-question-num">Q{index + 1}</span>
        <select className="fb-type-select" value={question.type} onChange={handleTypeChange}>
          {Object.entries(TYPE_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      <input
        className="fb-question-title-input"
        value={question.title}
        onChange={e => onUpdate({ title: e.target.value })}
        placeholder="Question"
      />

      <input
        className="fb-question-desc-input"
        value={question.description}
        onChange={e => onUpdate({ description: e.target.value })}
        placeholder="Description (optional)"
      />

      {HAS_OPTIONS.includes(question.type) && (
        <OptionsEditor question={question} onUpdate={onUpdate} />
      )}

      {question.type === 'linear_scale' && (
        <LinearScaleConfig question={question} onUpdate={onUpdate} />
      )}

      <AnswerPreview type={question.type} />

      <QuestionFooter
        question={question}
        index={index}
        total={total}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      />
    </div>
  )
}
