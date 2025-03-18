/// <reference types="chrome"/>

interface Prompt {
  id: string
  text: string
  timestamp: number
  source?: string
}

function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

// Initialize context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveToPromptLibrary',
    title: 'Save to Prompt Library',
    contexts: ['selection'], // Only show when text is selected
  })

  console.log('AI Prompt Library extension installed. Context menu created.')
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveToPromptLibrary' && info.selectionText) {
    const newPrompt: Prompt = {
      id: generateUniqueId(),
      text: info.selectionText,
      timestamp: Date.now(),
      source: tab?.url,
    }

    savePrompt(newPrompt)
  }
})

function savePrompt(newPrompt: Prompt): void {
  // Get existing prompts from storage
  chrome.storage.local.get(['prompts'], (result) => {
    const existingPrompts: Prompt[] = result.prompts || []

    // Add new prompt to the array
    const updatedPrompts = [...existingPrompts, newPrompt]

    // Save updated prompts back to storage
    chrome.storage.local.set({ prompts: updatedPrompts }, () => {
      console.log('Prompt saved successfully:', newPrompt)

      // Show a notification to confirm the prompt was saved
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'promptSaved',
            promptText: newPrompt.text.substring(0, 50) + (newPrompt.text.length > 50 ? '...' : ''),
          })
        }
      })
    })
  })
}

function deletePrompt(promptId: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Get existing prompts from storage
    chrome.storage.local.get(['prompts'], (result) => {
      const existingPrompts: Prompt[] = result.prompts || []

      const updatedPrompts = existingPrompts.filter((prompt) => prompt.id !== promptId)

      const wasDeleted = existingPrompts.length > updatedPrompts.length

      chrome.storage.local.set({ prompts: updatedPrompts }, () => {
        console.log(`Prompt ${wasDeleted ? 'deleted' : 'not found'}:`, promptId)
        resolve(wasDeleted)
      })
    })
  })
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'deletePrompt' && message.promptId) {
    deletePrompt(message.promptId).then((wasDeleted) => {
      sendResponse({ success: wasDeleted })
    })
    return true
  }
})