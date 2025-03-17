# AI Prompt Library Browser Extension

A simple browser extension that allows saving selected text as AI prompts for later use.

## Features

- **Save Text Selections**: Right-click on any selected text on a webpage and choose "Save to Prompt Library" to store it.
- **Search and Organize**: Search through your saved prompts with real-time filtering.
- **One-Click Copy**: Click on any saved prompt to instantly copy it to your clipboard.
- **Source Tracking**: Each prompt saves the URL it was sourced from.

## Installation

Extension is available for Chrome and Firefox.

Download the extension by clicking "Code" above and selecting "Download ZIP", unzip the file and load the extension in your browser.

To load the extension in your browser:
   - Chrome: Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", and select the `dist` folder.
   - Firefox: Go to `about:debugging`, click "This Firefox", click "Load Temporary Add-on", and select any file in the `dist` folder.

## Usage

1. Select text on any webpage.
2. Right-click and choose "Save to Prompt Library" from the context menu.
3. Click the extension icon in your browser toolbar to open the prompt library.
4. Use the search box to filter prompts.
5. Click on any prompt to copy it to your clipboard.

## Development Setup

1. Clone this repository:
   ```
   git clone git@github.com:srcnebo/personal-prompt-library.git
   cd personal-prompt-library
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the extension:
   ```
   npm run build
   ```

### Development

4. Run in watch mode for development:
  ```
  npm run dev
  ```

## Technical Details

This extension is built with:
- TypeScript
- React
- Chrome Extension API (Manifest V3)
- Webpack

## License

GPL