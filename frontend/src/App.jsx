import { useState } from 'react'
import './App.css'

function App() {
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [expectedUsers, setExpectedUsers] = useState('MEDIUM')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Step 1: create the project
      const createResponse = await fetch('http://localhost:8080/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, description, expectedUsers }),
      })
      const project = await createResponse.json()

      // Step 2: run all 4 AI agents on that project
      const generateResponse = await fetch(
        `http://localhost:8080/projects/${project.id}/generate`,
        { method: 'POST' }
      )
      const architectureResult = await generateResponse.json()

      setResult(architectureResult)
    } catch (err) {
      setError('Something went wrong: ' + err.message)
    } finally {
      setLoading(false)
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
          {loading ? 'Generating... (this takes ~20 seconds)' : 'Generate Architecture'}
        </button>
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
    </div>
  )
}

export default App