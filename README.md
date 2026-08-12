# BossBaby Community - React Project

A beautiful, modern React web application for the BossBaby community platform. This project showcases a wellness community website with a clean design, smooth animations, and responsive layout.

## Features

- 🎨 Modern, responsive design with Tailwind CSS
- ✨ Smooth animations using Framer Motion
- 🎯 Beautiful UI components built with shadcn/ui
- 📱 Mobile-first responsive design
- 🎨 Custom BossBaby brand color palette
- 🔍 Semantic HTML structure with proper accessibility

## Tech Stack

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon library
- **shadcn/ui** - High-quality UI components

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Building for Production

Build the project for production:
```bash
npm run build
```

The built files will be in the `build` directory.

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   └── BossBabyCommunityPage.jsx  # Main page component
├── lib/
│   └── utils.js      # Utility functions
├── App.js            # Main app component
├── index.js          # Entry point
└── index.css         # Global styles with Tailwind
```

## Customization

The project uses a custom BossBaby brand color palette defined in the main component:

- **Power**: Pink (#F3AFC3)
- **Energy**: Orange (#F79A3E)
- **Glow**: Yellow (#F9D44A)
- **Calm**: Green (#8BC374)
- **Cream**: Soft cream background (#F5EBDC)
- **Ink**: Dark gray (#111827)

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (not recommended)

## Browser Support

The application supports all modern browsers and includes fallbacks for older browsers through Tailwind CSS and PostCSS.

## Contributing

This is a React project template. Feel free to modify and extend it according to your needs.

## License

This project is for development purposes. Please ensure you have the appropriate licenses for any third-party assets or libraries used.
