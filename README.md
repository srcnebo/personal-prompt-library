# 📚 AI Prompt Library

<div align="center">

![AI Prompt Library Logo](public/icons/icon128.png)

A browser extension that helps you collect, organize, and reuse text selections as AI prompts.

[![License: GPL](https://img.shields.io/badge/License-GPL-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)

</div>

## ✨ Features

- **📋 Save Text Selections**: Right-click on any selected text and choose "Save to Prompt Library"
- **🔍 Smart Search**: Find your prompts quickly with real-time filtering
- **📋 One-Click Copy**: Click any prompt to instantly copy it to your clipboard
- **🗑️ Easy Deletion**: Remove prompts you no longer need with the delete button
- **🔗 Source Tracking**: Each prompt remembers where you found it

## 📥 Installation

The extension is available for both Chrome and Firefox browsers.

### Option 1: Install from releases

1. Download the latest release from the [Releases page](https://github.com/srcnebo/personal-prompt-library/releases)
2. Unzip the downloaded file

### Option 2: Clone and build

1. Download the repository by clicking "Code" → "Download ZIP"
2. Unzip the file
3. Follow the [Development Setup](#-development-setup) instructions to build the extension

### Loading in your browser

#### Chrome
1. Go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top-right)
3. Click "Load unpacked"
4. Select the `dist` folder

#### Firefox
1. Go to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select any file in the `dist` folder

## 🎮 Usage

![Usage demonstration](docs/usage-example.gif)

1. **Save a prompt**:
   - Select text on any webpage
   - Right-click and choose "Save to Prompt Library"
   - A success notification will appear

2. **Access your prompts**:
   - Click the extension icon in your browser toolbar
   - Your saved prompts will appear in the popup

3. **Search your prompts**:
   - Type in the search box to filter prompts
   - The list updates in real-time as you type

4. **Copy a prompt**:
   - Click on any prompt to copy it to your clipboard
   - A "Copied!" confirmation will appear

5. **Delete a prompt**:
   - In the bottom right corner of the prompt, click the trash icon to permanently remove the prompt
   - A confirmation message will appear

## 🛠️ Development Setup

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Setup

1. Clone the repository:
   ```bash
   git clone git@github.com:srcnebo/personal-prompt-library.git
   cd personal-prompt-library
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

### Development Workflow

Run in watch mode for active development:
```bash
npm run dev
```

After making changes, reload the extension in your browser:
- Chrome: Go to the extensions page and click the refresh icon on the extension
- Firefox: Click "Reload" on the extension's debug page

## 🧩 Technical Architecture

- **TypeScript**: Type-safe JavaScript for better developer experience
- **React**: Modern UI library for building the popup interface
- **Chrome Extension API**: Using Manifest V3 for modern extension development
- **Webpack**: Module bundling and development workflow

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and follow the code style.

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html) for details.

---

<div align="center">
Made with ❤️ by <a href="https://github.com/srcnebo">srcnebo</a>
</div>
