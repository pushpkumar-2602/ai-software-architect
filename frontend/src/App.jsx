import { useState, useEffect } from 'react'
import DiagramViewer from './DiagramViewer'
import './App.css'

function App() {
  const [view, setView] = useState('create') // 'create' | 'history'
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [expectedUsers, setExpectedUsers] = useState('MEDIUM')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [diagrams, setDiagrams] = useState({})
  const [diagramLoading, setDiagramLoading] = useState(null)
  const [stepIndex, setStepIndex] = useState(0)

  const [historyList, setHistoryList] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState(null)

  const agentSteps = [
    'Requirement Analyst is reading your idea...',
    'System Architect is designing the pattern...',
    'Database Architect is modeling your schema...',
    'DevOps Planner is estimating the timeline...',
  ]

  const diagramTypes = [
    { key: 'system-architecture', label: 'System Architecture' },
    { key: 'er-diagram', label: 'ER Diagram' },
    { key: 'use-case', label: 'Use Case Diagram' },
    { key: 'sequence-main-flow', label: 'Sequence Diagram' },
    { key: 'class-diagram', label: 'Class Diagram' },
    { key: 'activity-diagram', label: 'Activity Diagram' },
    { key: 'state-diagram', label: 'State Diagram' },
    { key: 'component-diagram', label: 'Component Diagram' },
    { key: 'deployment-diagram', label: 'Deployment Diagram' },
    { key: 'dfd-context', label: 'Data Flow Diagram' },
    { key: 'microservices-communication', label: 'Microservices Comm.' },
    { key: 'network-architecture', label: 'Network Architecture' },
    { key: 'security-architecture', label: 'Security Architecture' },
    { key: 'cicd-pipeline', label: 'CI/CD Pipeline' },
    { key: 'sdlc-workflow', label: 'SDLC Workflow' },
    { key: 'user-journey', label: 'User Journey' },
    { key: 'api-interaction', label: 'API Interaction' },
    { key: 'infrastructure-diagram', label: 'Infrastructure' },
  ]

  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % agentSteps.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [loading])

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setDiagrams({})

    try {
      const createResponse = await fetch('http://localhost:8080/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, description, expectedUsers }),
      })

      if (!createResponse.ok) {
        throw new Error(`Could not create project (status ${createResponse.status})`)
      }

      const project = await createResponse.json()

      const generateResponse = await fetch(
        `http://localhost:8080/projects/${project.id}/generate`,
        { method: 'POST' }
      )

      if (!generateResponse.ok) {
        throw new Error(
          `Generation failed (status ${generateResponse.status}). The AI service may be rate-limited — wait a minute and try again.`
        )
      }

      const architectureResult = await generateResponse.json()
      setResult(architectureResult)
    } catch (err) {
      setError('Something went wrong: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateDiagram = async (type) => {
    if (!result?.project?.id) return
    setDiagramLoading(type)
    try {
      const res = await fetch(
        `http://localhost:8080/projects/${result.project.id}/diagrams/${type}`,
        { method: 'POST' }
      )

      if (!res.ok) {
        throw new Error(`Diagram generation failed (status ${res.status})`)
      }

      const data = await res.json()
      setDiagrams((prev) => ({ ...prev, [type]: data.mermaidCode }))
    } catch (err) {
      alert(err.message)
    } finally {
      setDiagramLoading(null)
    }
  }

  const openHistory = async () => {
    setView('history')
    setHistoryLoading(true)
    setHistoryError(null)
    try {
      const res = await fetch('http://localhost:8080/projects')
      if (!res.ok) throw new Error(`Could not load projects (status ${res.status})`)
      const data = await res.json()
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setHistoryList(data)
    } catch (err) {
      setHistoryError(err.message)
    } finally {
      setHistoryLoading(false)
    }
  }
  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation() // don't trigger loadProjectFromHistory when clicking delete
    if (!confirm('Delete this project and all its generated content? This cannot be undone.')) {
      return
    }
    try {
      const res = await fetch(`http://localhost:8080/projects/${projectId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error(`Delete failed (status ${res.status})`)
      setHistoryList((prev) => prev.filter((p) => p.id !== projectId))
    } catch (err) {
      alert(err.message)
    }
  }

  const loadProjectFromHistory = async (projectId) => {
    setLoading(true)
    setError(null)
    setDiagrams({})

    try {
      const [resultRes, diagramsRes] = await Promise.all([
        fetch(`http://localhost:8080/projects/${projectId}/result`),
        fetch(`http://localhost:8080/projects/${projectId}/diagrams`),
      ])

      if (!resultRes.ok) throw new Error('Could not load this project\'s result')

      const savedResult = await resultRes.json()

      if (!savedResult) {
        setError('This project was created but architecture was never generated for it.')
        setResult(null)
        setView('create')
        return
      }

      const savedDiagrams = diagramsRes.ok ? await diagramsRes.json() : []
      const diagramMap = {}
      savedDiagrams.forEach((d) => {
        diagramMap[d.diagramType] = d.mermaidCode
      })

      setResult(savedResult)
      setDiagrams(diagramMap)
      setView('create')
    } catch (err) {
      setError('Something went wrong loading this project: ' + err.message)
      setView('create')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <div className="nav-row">
        <h1>AI Software Architect</h1>
        <div className="nav-buttons">
          <button
            className={`nav-btn ${view === 'create' ? 'nav-btn-active' : ''}`}
            onClick={() => setView('create')}
          >
            New Project
          </button>
          <button
            className={`nav-btn ${view === 'history' ? 'nav-btn-active' : ''}`}
            onClick={openHistory}
          >
            History
          </button>
        </div>
      </div>
      <p>Describe your project idea and get an AI-generated architecture.</p>

      {view === 'history' && (
        <div className="history-list">
          {historyLoading && <p className="agent-text">Loading past projects...</p>}
          {historyError && <p style={{ color: '#f87171' }}>{historyError}</p>}
          {!historyLoading && historyList.length === 0 && (
            <p className="agent-text">No projects yet — create one to see it here.</p>
          )}
          {historyList.map((p) => (
            <div
              key={p.id}
              className="history-item"
              onClick={() => loadProjectFromHistory(p.id)}
            >
              <div className="history-item-header">
                <span className="history-item-name">{p.projectName || '(untitled)'}</span>
                <div className="history-item-header-right">
                  <span className="history-item-scale">{p.expectedUsers}</span>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDeleteProject(e, p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="history-item-desc">{p.description}</p>
              <span className="history-item-date">
                {new Date(p.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {view === 'create' && (
        <div className="form">
          <input
            type="text"
            placeholder="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <textarea
            placeholder="Describe your project idea..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
          />

          <select value={expectedUsers} onChange={(e) => setExpectedUsers(e.target.value)}>
            <option value="SMALL">Small (~100 users)</option>
            <option value="MEDIUM">Medium (~10,000 users)</option>
            <option value="LARGE">Large (~1,000,000 users)</option>
            <option value="ENTERPRISE">Enterprise (10M+ users)</option>
          </select>

          <button onClick={handleGenerate} disabled={loading}>
            {loading ? 'Working...' : 'Generate Architecture'}
          </button>

          {loading && (
            <div className="agent-loader">
              <div className="agent-dots">
                <span className="dot dot1"></span>
                <span className="dot dot2"></span>
                <span className="dot dot3"></span>
                <span className="dot dot4"></span>
              </div>
              <p className="agent-text">{agentSteps[stepIndex]}</p>
            </div>
          )}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && view === 'create' && (
        <div className="results">
          <h2>Requirements</h2>
          <pre>{result.requirements}</pre>

          <h2>Architecture</h2>
          <pre>{result.architecture}</pre>

          <h2>Database Design</h2>
          <pre>{result.database}</pre>

          <h2>DevOps Plan</h2>
          <pre>{result.devops}</pre>
        </div>
      )}

      {result && view === 'create' && (
        <div className="diagram-section">
          <h2>Engineering Diagrams</h2>
          <div className="diagram-buttons">
            {diagramTypes.map((d) => (
              <button
                key={d.key}
                className="diagram-btn"
                onClick={() => handleGenerateDiagram(d.key)}
                disabled={diagramLoading === d.key}
              >
                {diagramLoading === d.key ? '...' : d.label}
              </button>
            ))}
          </div>
      

          {diagramTypes.map((d) =>
            diagrams[d.key] ? (
              <div key={d.key} className="diagram-block">
                <h3>{d.label}</h3>
                <DiagramViewer code={diagrams[d.key]} label={d.label} />
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}

export default App