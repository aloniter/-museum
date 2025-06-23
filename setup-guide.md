# 🏛️ VR Museum Setup Guide

Complete guide to set up and deploy your VR Museum to GitHub Pages.

## Quick Start (5 minutes)

### 1. Create GitHub Repository

```bash
# Create a new repository on GitHub, then:
git init
git add .
git commit -m "Initial VR Museum setup"
git branch -M main
git remote add origin https://github.com/yourusername/museum.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **"Deploy from a branch"**
4. Choose **"main"** branch
5. Click **Save**

Your museum will be live at: `https://yourusername.github.io/museum`

### 3. Test Locally (Optional)

```bash
# Install Node.js if you haven't already
npm install
npm start

# Or use Python
python -m http.server 8000

# Open http://localhost:8000
```

## 📸 Adding Your Photos

### Method 1: Replace Demo Photos (Easiest)

1. Add your photos to:
   - `assets/photos/gallery/` (for gallery theme)
   - `assets/photos/thailand/` (for Thailand theme)

2. Update the photo manifests:
   - Edit `assets/photos/gallery/photos.json`
   - Edit `assets/photos/thailand/photos.json`

Example photo manifest:
```json
{
  "theme": "thailand",
  "title": "My Thailand Adventure",
  "photos": [
    {
      "filename": "temple.jpg",
      "title": "Beautiful Temple",
      "description": "Ancient temple in Bangkok",
      "location": "Bangkok, Thailand",
      "date": "2024-03-15"
    }
  ]
}
```

### Method 2: Create New Theme

1. Create new folders:
   ```
   assets/photos/paris/
   assets/photos/paris/photos.json
   ```

2. Add theme to `js/museum.js`:
   ```javascript
   {
     id: 'paris',
     name: 'Paris Memories',
     environment: 'gallery', // or create custom
     photoFolder: 'assets/photos/paris/',
     layout: 'wall'
   }
   ```

## 🎨 Customizing Environments

### Gallery Environment
- Clean, modern museum with white walls
- Professional lighting
- Perfect for art and architecture photos

### Thailand Environment  
- Tropical bamboo pavilion
- Warm, golden lighting
- Immersive nature sounds
- Great for travel photos

### Creating Custom Environments

Edit the environment creation functions in `js/museum.js`:

```javascript
createCustomEnvironment() {
    const environment = document.createElement('a-entity');
    environment.innerHTML = `
        <!-- Your custom 3D environment -->
        <a-box position="0 2 -5" color="#your-color"></a-box>
        <a-light type="point" position="0 4 0"></a-light>
    `;
    this.environmentContainer.appendChild(environment);
}
```

## 🔧 Terminal Commands for Deployment

Here are the commands you'll need:

### Initial Setup
```bash
# Clone your repo (if working on different machine)
git clone https://github.com/yourusername/museum.git
cd museum

# Install development dependencies (optional)
npm install
```

### Making Changes and Deploying
```bash
# After making changes to your photos or code:

# 1. Add all changes
git add .

# 2. Commit with a descriptive message
git commit -m "Add new Thailand photos and update gallery"

# 3. Push to GitHub (auto-deploys via GitHub Actions)
git push origin main

# Your site will update automatically in 2-3 minutes
```

### Quick Commands Reference
```bash
# Check status
git status

# See what changed
git diff

# View commit history
git log --oneline

# Test locally
npm start              # or python -m http.server 8000

# Force deploy (if needed)
npm run deploy
```

## 📱 Device Compatibility

### Desktop/Laptop
- **Chrome/Edge**: Full WebXR support ✅
- **Firefox**: Enable WebXR in settings ⚠️
- **Safari**: Limited support ⚠️

### VR Headsets
- **Meta Quest 2/3**: Perfect support via Oculus Browser ✅
- **Other headsets**: Most modern headsets supported ✅

### Mobile
- **Android Chrome**: Good support with gyroscope ✅
- **iOS Safari**: Basic support, no WebXR ⚠️

## 🎯 Performance Optimization

### Image Optimization
```bash
# Recommended image settings:
# - Format: JPG (smaller) or PNG (if transparency needed)
# - Max size: 2048x2048 pixels
# - Quality: 80-90% compression
# - Total per theme: Under 50MB
```

### Audio Files
```bash
# Add ambient audio files to:
assets/audio/ambient/gallery.mp3
assets/audio/ambient/thailand.mp3

# Recommended:
# - MP3 format
# - 128-192 kbps
# - Loop-friendly (no abrupt start/end)
# - 30 seconds to 2 minutes length
```

## 🔍 Troubleshooting

### Site Not Loading
1. Check GitHub Pages is enabled
2. Wait 5-10 minutes after pushing changes
3. Check browser console for errors (F12)

### Photos Not Showing
1. Verify photo paths in `photos.json`
2. Check image file names match exactly
3. Ensure images are under 5MB each

### VR Mode Not Working
1. Use Chrome or Edge browser
2. Connect VR headset before opening site
3. Click "Enter VR" button, not browser VR icon

### Performance Issues
1. Reduce image sizes
2. Limit photos per theme (max 20)
3. Test on target device

## 🚀 Advanced Features

### Adding Sound Effects
```javascript
// In assets/audio/ folder:
click.mp3           // Button click sound
whoosh.mp3          // Transition sound
ambient-rain.mp3    // Custom ambient track
```

### Custom Photo Layouts
```javascript
// In theme configuration:
layout: 'circle'    // Photos in a circle
layout: 'wall'      // Standard wall layout  
layout: 'grid'      // Grid pattern
```

### Analytics (Optional)
Add Google Analytics to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## 📞 Support

If you run into issues:

1. **Check the browser console** (F12 → Console tab)
2. **Test in different browsers** (Chrome recommended)
3. **Verify file paths** are correct and case-sensitive
4. **Check image formats** (JPG/PNG only)

## 🎉 You're Ready!

Your VR Museum should now be:
- ✅ Live on GitHub Pages
- ✅ Displaying your photos
- ✅ Working in VR headsets
- ✅ Accessible to friends and family

Share your museum URL and enjoy exploring your memories in VR! 🥽✨ 