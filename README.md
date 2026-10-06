# 🚀 Cyber Clicker

A next-generation interactive clicker game built entirely on pure frontend technologies (**HTML5, CSS3, and Vanilla JavaScript**) without any heavy third-party frameworks. The project follows a modular architecture with strict separation of markup, styles, and logic.

## ✨ Core Features
* 🎰 **Advanced Economy**: A progressive upgrade pricing system featuring a price multiplier (`x1.5` – `x1.6`).
* 🎁 **Daily Rewards**: A built-in daily reward system with a real 24-hour countdown timer powered by system timestamps.
* ⚡ **Temporary Boosters**: Purchase a 2x Booster for 10 seconds, complete with a visual pulsing effect and a subsequent cooldown mechanism.
* 👕 **Button Skin Inventory**: A customization shop for the main clicker button (gradients, neon styles) with support for **loading local graphic assets** (`1.jpg`, `2.jpg`).
* 🖼 **Custom Background Uploader**: Full integration with the system file explorer using the `FileReader API`. Players can upload any photo from their PC as a background with a sleek frosted glass effect (`backdrop-filter`).
* 💾 **Persistent Storage**: Full game progress, skin inventory, and active themes are automatically saved to `localStorage` (handling complex objects via JSON serialization).

## 🗂 Project Structure
```text
├── index.html     # Page structure, shops, and UI layout
├── style.css      # Responsive Flexbox layout, custom themes, and animations
└── script.js      # Game engine, UI state manager, and storage handler
```

## 🚀 Quick Start (Offline Launch)
No servers, databases, or compilers are required to run this game.
1. Download `index.html`, `style.css`, and `script.js` into a single folder.
2. (Optional) Place an image named `1.jpg` in the same folder to use as a custom button skin.
3. Double-click `index.html` to launch and play the game instantly in any modern browser.

*All progress is saved locally. No cookies are collected.*
