import { useState, useEffect } from 'react'
import DiagramViewer from './DiagramViewer'
import './App.css'

function App() {
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [expectedUsers, setExpectedUsers] = useState('MEDIUM')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [diagrams, setDiagrams] = useState({})
  const [diagramLoading, setDiagramLoading] = useState(null)
  const [stepIndex, setStepIndex] = useState(0)

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

  useEffect(() => {
    if (!result?.project?.id) return

    fetch(`http://localhost:8080/projects/${result.project.id}/diagrams`)
      .then((res) => res.json())
      .then((existingDiagrams) => {
        const diagramMap = {}
        existingDiagrams.forEach((d) => {
          diagramMap[d.diagramType] = d.mermaidCode
        })
        setDiagrams(diagramMap)
      })
      .catch((err) => console.error('Could not load existing diagrams:', err))
  }, [result])

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

  return (
    <div className="App">
      <h1>AI Software Architect</h1>
      <p>Describe your project idea and get an AI-generated architecture.</p>

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

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
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

      {result && (
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
                <DiagramViewer code={diagrams[d.key]} />
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}

export default App