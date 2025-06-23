# VR Museum - WebXR Experience

A web-based virtual reality museum where you can explore themed rooms based on your personal photo collections. Works in browsers and VR headsets like Meta Quest 3.

## Features

- **WebXR Support**: Works in web browsers and VR headsets (Quest 3, Quest 2, etc.)
- **Cross-Platform**: Desktop, mobile, and VR compatible
- **Themed Environments**: Immersive 3D rooms with unique atmospheres
- **Easy Photo Management**: Simple JSON configuration for adding photos
- **Controller Support**: VR controller movement and interaction
- **Ambient Audio**: Environment-specific soundscapes
- **Responsive Design**: Adapts to different screen sizes and devices

## Live Demo

Visit: `https://[your-username].github.io/museum`

## Setup for Development

### Prerequisites
- Modern web browser with WebXR support
- Local web server (for testing)
- VR headset (optional, for full VR experience)

### Quick Start
1. Clone this repository
2. Serve the files using a local web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using Live Server (VS Code extension)
   # Just right-click index.html and "Open with Live Server"
   ```
3. Open `http://localhost:8000` in your browser
4. For VR: Put on your headset and click "Enter VR"

### Adding Your Photos
1. Add your photos to the `assets/photos/[theme-name]/` folder
2. Update the corresponding theme configuration in `js/themes/[theme-name].js`
3. The photos will automatically load in the themed environment

### GitHub Pages Deployment
1. Push your code to a GitHub repository
2. Go to Settings > Pages
3. Select "Deploy from a branch" and choose `main`
4. Your museum will be live at `https://[username].github.io/[repository-name]`

## Current Themes
- **Gallery**: Clean, modern museum environment
- **Thailand**: Tropical jungle atmosphere with bamboo frames
- **Template**: Base template for creating new themes

## Project Structure

```
├── index.html              # Main entry point
├── css/
│   ├── style.css          # Main styles
│   └── themes/            # Theme-specific styling
├── js/
│   ├── museum.js          # Core museum functionality
│   ├── movement.js        # VR movement controls
│   ├── photo-loader.js    # Photo loading system
│   └── themes/            # Theme configurations
├── assets/
│   ├── photos/            # Your photo collections
│   ├── audio/             # Ambient sounds
│   ├── models/            # 3D models and textures
│   └── icons/             # UI icons
└── README.md
```

## Technology Stack

- **A-Frame**: WebXR framework for VR experiences
- **HTML5/CSS3**: Structure and styling
- **JavaScript ES6+**: Interactive functionality
- **WebXR API**: VR headset integration
- **GitHub Pages**: Free hosting

## Controls

### Desktop/Mobile
- **Mouse/Touch**: Look around
- **WASD/Arrow Keys**: Move around
- **Click**: Interact with photos
- **F**: Enter/exit fullscreen

### VR Headset
- **Head Movement**: Look around naturally
- **Thumbstick**: Smooth locomotion
- **Trigger**: Select and interact
- **Grip**: Teleport (if enabled)
- **Menu Button**: Open settings

## Browser Compatibility

- **Chrome/Edge**: Full WebXR support
- **Firefox**: WebXR support with flag enabled
- **Safari**: Limited support (mobile Safari has some WebXR)
- **VR Browsers**: Oculus Browser, Firefox Reality

## Adding New Themes

1. Create a new folder in `assets/photos/[new-theme]/`
2. Add your photos to this folder
3. Create a theme configuration file in `js/themes/[new-theme].js`
4. Add the theme to the main themes list in `js/museum.js`
5. Optionally create custom CSS in `css/themes/[new-theme].css`

## Performance Tips

- Optimize images (recommended max 2048x2048px)
- Use JPG for photos, PNG for transparency
- Limit audio file sizes
- Test on target devices for performance

## Contributing

Feel free to fork and submit pull requests! This project is designed to be easily customizable for different photo collections and themes. 