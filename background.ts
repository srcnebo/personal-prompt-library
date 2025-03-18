/// <reference types="chrome"/>

// Interface for storing prompts
interface Prompt {
  id: string
  text: string
  timestamp: number
  source?: string // Optional URL where the prompt was saved from
}

// Function to generate a unique ID for new prompts
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

// Initialize context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToPromptLibrary",
    title: "Save to Prompt Library",
    contexts: ["selection"], // Only show when text is selected
  })

  console.log("AI Prompt Library extension installed. Context menu created.")
})

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToPromptLibrary" && info.selectionText) {
    // Create a new prompt object
    const newPrompt: Prompt = {
      id: generateUniqueId(),
      text: info.selectionText,
      timestamp: Date.now(),
      source: tab?.url
    }

    // Save the prompt to storage
    savePrompt(newPrompt)
  }
})

// Function to save a new prompt
function savePrompt(newPrompt: Prompt): void {
  // Get existing prompts from storage
  chrome.storage.local.get(["prompts"], (result) => {
    const existingPrompts: Prompt[] = result.prompts || []

    // Add new prompt to the array
    const updatedPrompts = [...existingPrompts, newPrompt]

    // Save updated prompts back to storage
    chrome.storage.local.set({ prompts: updatedPrompts }, () => {
      console.log("Prompt saved successfully:", newPrompt)

      // Optional: Show a notification to confirm the prompt was saved
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "promptSaved",
            promptText: newPrompt.text.substring(0, 50) + (newPrompt.text.length > 50 ? '...' : '')
          })
        }
      })
    })
  })
}

// Function to delete a prompt by ID
function deletePrompt(promptId: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Get existing prompts from storage
    chrome.storage.local.get(["prompts"], (result) => {
      const existingPrompts: Prompt[] = result.prompts || []

      // Filter out the prompt with the matching ID
      const updatedPrompts = existingPrompts.filter(prompt => prompt.id !== promptId)

      // Check if a prompt was actually removed
      const wasDeleted = existingPrompts.length > updatedPrompts.length

      // Save updated prompts back to storage
      chrome.storage.local.set({ prompts: updatedPrompts }, () => {
        console.log(`Prompt ${wasDeleted ? 'deleted' : 'not found'}:`, promptId)
        resolve(wasDeleted)
      })
    })
  })
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "deletePrompt" && message.promptId) {
    deletePrompt(message.promptId)
      .then(wasDeleted => {
        sendResponse({ success: wasDeleted })
      })
    return true // Indicates we will send a response asynchronously
  }
})