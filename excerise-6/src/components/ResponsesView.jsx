import { useState } from 'react'

export default function ResponsesView({ form, responses }) {
  const [tab, setTab] = useState('summary')
  const [selected, setSelected] = useState(0)

  if (responses.length === 0) {
    return (
      <div className="fb-responses-wrap">
        <div className="fb-responses-empty">
          <div className="fb-responses-empty-icon">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="26" stroke="#d1c4e9" strokeWidth="2" />
              <path d="M20 28h16M28 20v16" stroke="#9c7cd6" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2>No responses yet</h2>
          <p>Use the Preview tab to fill out and submit the form.</p>
        </div>
      </div>
    )
  }

  const curResponse = responses[Math.min(selected, responses.length - 1)]

  return (
    <div className="fb-responses-wrap">
      <div className="fb-responses-header">
        <div className="fb-responses-count">
          <strong>{responses.length}</strong>{' '}
          {responses.length === 1 ? 'response' : 'responses'}
        </div>
        <div className="fb-res-tabs">
          <button
            className={tab === 'summary' ? 'active' : ''}
            onClick={() => setTab('summary')}
          >
            Summary
          </button>
          <button
            className={tab === 'individual' ? 'active' : ''}
            onClick={() => setTab('individual')}
          >
            Individual
          </button>
        </div>
      </div>

      {tab === 'summary' && (
        <div className="fb-summary">
          {form.questions.map(q => {
            const answered = responses.filter(r => {
              const v = r.answers[q.id]
              return v !== undefined && v !== null && v !== '' &&
                !(Array.isArray(v) && v.length === 0)
            })

            return (
              <div key={q.id} className="fb-summary-card">
                <h3 className="fb-sc-title">{q.title || 'Untitled question'}</h3>
                <p className="fb-sc-meta">
                  {TYPE_LABEL[q.type]} · {answered.length} answer{answered.length !== 1 ? 's' : ''}
                </p>

                {isTextType(q.type) && (
                  <ul className="fb-sc-text-list">
                    {answered.map((r, i) => (
                      <li key={i}>{String(r.answers[q.id])}</li>
                    ))}
                  </ul>
                )}

                {isChoiceType(q.type) && (
                  <div className="fb-sc-bars">
                    {getChoiceCounts(responses, q).map(({ label, count, pct }) => (
                      <div key={label} className="fb-bar-row">
                        <span className="fb-bar-label">{label}</span>
                        <div className="fb-bar-track">
                          <div className="fb-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="fb-bar-count">{count}</span>
                      </div>
                    ))}
                  </div>
                )}

                {q.type === 'checkboxes' && (
                  <div className="fb-sc-bars">
                    {getCheckboxCounts(responses, q).map(({ label, count, pct }) => (
                      <div key={label} className="fb-bar-row">
                        <span className="fb-bar-label">{label}</span>
                        <div className="fb-bar-track">
                          <div className="fb-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="fb-bar-count">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'individual' && (
        <div className="fb-individual">
          <div className="fb-individual-nav">
            <button
              disabled={selected <= 0}
              onClick={() => setSelected(s => s - 1)}
            >
              ← Prev
            </button>
            <span className="fb-individual-pos">
              {selected + 1} / {responses.length}
            </span>
            <button
              disabled={selected >= responses.length - 1}
              onClick={() => setSelected(s => s + 1)}
            >
              Next →
            </button>
          </div>

          <div className="fb-individual-card">
            <p className="fb-individual-time">
              Submitted: {new Date(curResponse.submittedAt).toLocaleString()}
            </p>
            {form.questions.map(q => {
              const ans = curResponse.answers[q.id]
              return (
                <div key={q.id} className="fb-individual-row">
                  <p className="fb-individual-q">
                    {q.title || 'Untitled question'}
                    {q.required && <span className="fb-required-star"> *</span>}
                  </p>
                  <p className="fb-individual-a">
                    {ans === undefined || ans === null || ans === '' ? (
                      <em className="fb-no-answer">No answer</em>
                    ) : Array.isArray(ans) ? (
                      ans.length === 0 ? <em className="fb-no-answer">No answer</em> : ans.join(', ')
                    ) : (
                      String(ans)
                    )}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const TYPE_LABEL = {
  short: 'Short answer',
  paragraph: 'Paragraph',
  multiple_choice: 'Multiple choice',
  checkboxes: 'Checkboxes',
  dropdown: 'Dropdown',
  linear_scale: 'Linear scale',
  date: 'Date',
  time: 'Time',
}

const isTextType = t => ['short', 'paragraph', 'date', 'time'].includes(t)
const isChoiceType = t => ['multiple_choice', 'dropdown', 'linear_scale'].includes(t)

function getChoiceCounts(responses, q) {
  const options =
    q.type === 'linear_scale'
      ? Array.from({ length: q.scaleMax - q.scaleMin + 1 }, (_, i) =>
          String(i + q.scaleMin)
        )
      : q.options

  const counts = Object.fromEntries(options.map(o => [String(o), 0]))
  responses.forEach(r => {
    const val = r.answers[q.id]
    if (val !== undefined && val !== null) {
      const key = String(val)
      if (key in counts) counts[key]++
    }
  })

  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
  return options.map(o => ({
    label: String(o),
    count: counts[String(o)],
    pct: Math.round((counts[String(o)] / total) * 100),
  }))
}

function getCheckboxCounts(responses, q) {
  const counts = Object.fromEntries(q.options.map(o => [o, 0]))
  responses.forEach(r => {
    const vals = r.answers[q.id] || []
    vals.forEach(v => { if (v in counts) counts[v]++ })
  })
  const total = responses.length || 1
  return q.options.map(o => ({
    label: o,
    count: counts[o],
    pct: Math.round((counts[o] / total) * 100),
  }))
}
