import React, { useState, useEffect } from 'react'
import { Prompt } from '../types/Prompt'

const App: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [copyStatus, setCopyStatus] = useState<string | null>(null)

  // Load prompts from storage when component mounts
  useEffect(() => {
    chrome.storage.local.get(['prompts'], (result) => {
      if (result.prompts) {
        setPrompts(result.prompts)
      }
    })
  }, [])

  // Filter prompts based on search query
  const filteredPrompts = prompts.filter(prompt =>
    prompt.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Format timestamp to readable date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString()
  }

  // Copy prompt text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('Copied!')

      // Clear the status after 2 seconds
      setTimeout(() => {
        setCopyStatus(null)
      }, 2000)
    } catch (err) {
      setCopyStatus('Failed to copy')
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="app-container">
      <h1>AI Prompt Library</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search prompts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {copyStatus && (
        <div className="copy-status">
          {copyStatus}
        </div>
      )}

      <div className="prompts-list">
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map(prompt => (
            <div
              key={prompt.id}
              className="prompt-item"
              onClick={() => copyToClipboard(prompt.text)}
            >
              <div className="prompt-text">{prompt.text}</div>
              <div className="prompt-meta">
                <span className="prompt-date">{formatDate(prompt.timestamp)}</span>
                {prompt.source && (
                  <span className="prompt-source">
                    Source: {new URL(prompt.source).hostname}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-prompts">
            {prompts.length === 0
              ? "No prompts saved yet. Select text on any webpage, right-click and choose 'Save to Prompt Library'."
              : "No prompts match your search."}
          </div>
        )}
      </div>
    </div>
  )
}

export default App