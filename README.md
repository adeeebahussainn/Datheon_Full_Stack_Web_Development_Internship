# TaskFlow — Dynamic Task Manager & Productivity Tracker

A pastel, responsive task manager built with plain HTML, CSS and JavaScript. No frameworks, no backend; tasks persist in your browser via LocalStorage.

## Features
- Add, edit, delete tasks (unique IDs, title validation, delete confirmation)
- Complete / reactivate with checkbox animation and strikethrough
- Categories (Work, Personal, Study), priorities (Low, Medium, High), due dates
- Live stats: total, completed, active, overdue, plus an animated progress bar
- Filters (All, Active, Completed, Work, Personal, Study), instant search, and sorting (manual, newest, oldest, due date, priority), all working together
- Drag-and-drop reordering (in "Manual order" sort)
- Clear completed, toast notifications, empty states
- Responsive layout, keyboard focus styles, reduced-motion support

## Run in VS Code
1. Open the `TaskFlow` folder in VS Code (File → Open Folder).
2. Install the **Live Server** extension (optional but recommended).
3. Right-click `index.html` → **Open with Live Server**. Or just double-click `index.html` to open it in a browser.

## Structure
```
TaskFlow/
├── index.html   # markup
├── style.css    # pastel design system, animations, responsive rules
├── script.js    # state, CRUD, filters, LocalStorage, drag-and-drop
└── README.md
```

## Notes
- Data is stored under the LocalStorage key `taskflow.tasks.v1`; clear it in DevTools to reset.
- Google Fonts load online; the app falls back to system fonts offline.
