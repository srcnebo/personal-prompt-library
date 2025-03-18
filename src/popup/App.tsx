import React, { useState, useEffect, useRef } from 'react'
import { Prompt } from '../types/Prompt'

const App: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null)
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null)
  const [scrollablePrompts, setScrollablePrompts] = useState<Record<string, boolean>>({})

  // Load prompts from storage when component mounts
  useEffect(() => {
    loadPrompts()
  }, [])

  // Load prompts from storage
  const loadPrompts = () => {
    chrome.storage.local.get(['prompts'], (result) => {
      if (result.prompts) {
        setPrompts(result.prompts)
      }
    })
  }

  // Filter prompts based on search query
  const filteredPrompts = prompts.filter(prompt =>
    prompt.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Check for scrollable content after prompts load or filter changes
  useEffect(() => {
    const scrollableState: Record<string, boolean> = {}

    // Use a small delay to ensure the DOM has updated
    const timer = setTimeout(() => {
      const promptElements = document.querySelectorAll('.prompt-text')
      promptElements.forEach((element) => {
        const id = element.closest('.prompt-item')?.getAttribute('data-prompt-id')
        if (id) {
          scrollableState[id] = element.scrollHeight > element.clientHeight
        }
      })
      setScrollablePrompts(scrollableState)
    }, 100)

    return () => clearTimeout(timer)
  }, [prompts, searchQuery, filteredPrompts])

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString()
  }

  // Copy prompt text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('Copied!')

      setTimeout(() => {
        setCopyStatus(null)
      }, 2000)
    } catch (err) {
      setCopyStatus('Failed to copy')
      console.error('Failed to copy: ', err)
    }
  }

  const confirmDelete = (e: React.MouseEvent, promptId: string) => {
    e.stopPropagation() // Prevent copying the prompt
    setPromptToDelete(promptId)
  }

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPromptToDelete(null)
  }

  const deletePrompt = (e: React.MouseEvent, promptId: string) => {
    e.stopPropagation()

    chrome.runtime.sendMessage({ action: 'deletePrompt', promptId }, (response) => {
      if (response.success) {
        setPrompts(prevPrompts => prevPrompts.filter(p => p.id !== promptId))
        setDeleteStatus('Prompt deleted')
      } else {
        setDeleteStatus('Error deleting prompt')
      }

      setPromptToDelete(null)

      setTimeout(() => {
        setDeleteStatus(null)
      }, 2000)
    })
  }

  return (
    <div className='app-container'>
      <h1>AI Prompt Library</h1>

      <div className='search-container'>
        <input
          type='text'
          placeholder='Search prompts...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='search-input'
        />
      </div>

      {copyStatus && (
        <div className='copy-status'>
          {copyStatus}
        </div>
      )}

      {deleteStatus && (
        <div className='delete-status'>
          {deleteStatus}
        </div>
      )}

      <div className='prompts-list'>
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map(prompt => (
            <div
              key={prompt.id}
              data-prompt-id={prompt.id}
              className='prompt-item'
              onClick={() => copyToClipboard(prompt.text)}
            >
              <div
                className={`prompt-text ${scrollablePrompts[prompt.id] ? 'scrollable' : ''}`}
              >
                {prompt.text}
              </div>
              <div className='prompt-meta'>
                <span className='prompt-date'>{formatDate(prompt.timestamp)}</span>
                {prompt.source && (
                  <span className='prompt-source'>
                    Source: {new URL(prompt.source).hostname}
                  </span>
                )}

                {promptToDelete === prompt.id ? (
                  <div className='delete-confirmation'>
                    <span>Delete?</span>
                    <button
                      className='confirm-button'
                      onClick={(e) => deletePrompt(e, prompt.id)}
                      title='Confirm delete'
                    >
                      Yes
                    </button>
                    <button
                      className='cancel-button'
                      onClick={cancelDelete}
                      title='Cancel delete'
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    className='delete-button'
                    onClick={(e) => confirmDelete(e, prompt.id)}
                    title='Delete prompt'
                  >
                    <img src='icons/trash-can-regular.svg' alt='Delete' className='trash-icon' />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className='no-prompts'>
            {prompts.length === 0
              ? 'No prompts saved yet. Select text on any webpage, right-click and choose \'Save to Prompt Library\'.'
              : 'No prompts match your search.'}
          </div>
        )}
      </div>
    </div>
  )
}

export default App