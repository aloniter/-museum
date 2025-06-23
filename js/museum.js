/**
 * VR Museum - Main Controller
 * Manages the overall VR museum experience, theme switching, and user interactions
 */

import PhotoLoader from './photo-loader.js';

class VRMuseum {
    constructor() {
        this.themes = [];
        this.currentThemeIndex = 0;
        this.isLoading = false;
        this.isVRMode = false;
        
        // Managers
        this.photoLoader = new PhotoLoader();
        
        // DOM elements
        this.scene = null;
        this.camera = null;
        this.environmentContainer = null;
        this.photoContainer = null;
        this.loadingScreen = null;
        this.progressBar = null;
        this.currentThemeDisplay = null;
        
        // Audio
        this.ambientAudio = null;
        this.clickSound = null;
        
        this.init();
    }
    
    async init() {
        console.log('🏛️ Initializing VR Museum...');
        
        // Wait for A-Frame to be ready
        if (typeof AFRAME === 'undefined') {
            console.log('⏳ Waiting for A-Frame to load...');
            await this.waitForAFrame();
        }
        
        // Initialize DOM references
        this.initializeDOMReferences();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load available themes
        await this.loadThemes();
        
        // Initialize the first theme
        if (this.themes.length > 0) {
            await this.loadTheme(0);
        } else {
            console.warn('No themes available to load');
            this.showError('No themes configured. Please add some themes to get started!');
        }
        
        // Hide loading screen
        this.hideLoadingScreen();
        
        console.log('✅ VR Museum initialized successfully');
    }
    
    waitForAFrame() {
        return new Promise((resolve) => {
            const checkAFrame = () => {
                if (typeof AFRAME !== 'undefined') {
                    resolve();
                } else {
                    setTimeout(checkAFrame, 100);
                }
            };
            checkAFrame();
        });
    }
    
    initializeDOMReferences() {
        // A-Frame scene elements
        this.scene = document.querySelector('#museum-scene');
        this.camera = document.querySelector('#player-camera');
        this.environmentContainer = document.querySelector('#environment-container');
        this.photoContainer = document.querySelector('#photo-container');
        
        // UI elements
        this.loadingScreen = document.querySelector('#loading-screen');
        this.progressBar = document.querySelector('#progress-bar');
        this.currentThemeDisplay = document.querySelector('#current-theme');
        this.uiOverlay = document.querySelector('#ui-overlay');
        
        // Audio elements
        this.ambientAudio = document.querySelector('#ambient-audio');
        this.clickSound = document.querySelector('#click-sound');
        
        // Validate critical elements
        if (!this.scene || !this.environmentContainer || !this.photoContainer) {
            console.error('Critical DOM elements not found!');
            this.showError('Failed to initialize VR Museum. Please refresh the page.');
        }
    }
    
    setupEventListeners() {
        // Theme navigation buttons
        document.querySelector('#prev-theme')?.addEventListener('click', () => {
            this.previousTheme();
        });
        
        document.querySelector('#next-theme')?.addEventListener('click', () => {
            this.nextTheme();
        });
        
        // VR mode toggle
        document.querySelector('#enter-vr')?.addEventListener('click', () => {
            this.toggleVRMode();
        });
        
        // Fullscreen toggle
        document.querySelector('#fullscreen')?.addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // VR Navigation Buttons
        document.querySelector('#prev-room-btn')?.addEventListener('click', () => {
            console.log('🎮 VR Previous room clicked');
            this.previousTheme();
        });
        
        document.querySelector('#next-room-btn')?.addEventListener('click', () => {
            console.log('🎮 VR Next room clicked');
            this.nextTheme();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardInput(event);
        });
        
        // VR mode events
        this.scene?.addEventListener('enter-vr', () => {
            this.onEnterVR();
        });
        
        this.scene?.addEventListener('exit-vr', () => {
            this.onExitVR();
        });
        
        // Scene loaded event
        this.scene?.addEventListener('loaded', () => {
            console.log('A-Frame scene loaded');
        });
        
        // Window events
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Prevent context menu in VR
        document.addEventListener('contextmenu', (e) => {
            if (this.isVRMode) {
                e.preventDefault();
            }
        });
    }
    
    async loadThemes() {
        console.log('📁 Loading available themes...');
        
        try {
            // Load theme configurations
            const availableThemes = [
                {
                    id: 'gallery',
                    name: 'Modern Gallery',
                    description: 'Clean, contemporary museum space',
                    environment: 'gallery',
                    ambientSound: 'assets/audio/ambient/gallery.mp3',
                    photoFolder: 'assets/photos/gallery/',
                    layout: 'wall'
                },
                {
                    id: 'thailand',
                    name: 'Thailand Journey',
                    description: 'Tropical paradise with bamboo and nature sounds',
                    environment: 'thailand',
                    ambientSound: 'assets/audio/ambient/thailand.mp3',
                    photoFolder: 'assets/photos/thailand/',
                    layout: 'circle'
                }
            ];
            
            this.themes = availableThemes;
            console.log(`✅ Loaded ${this.themes.length} themes`);
            
        } catch (error) {
            console.error('Failed to load themes:', error);
            this.showError('Failed to load themes. Please check your configuration.');
        }
    }
    
    async loadTheme(themeIndex) {
        if (this.isLoading) return;
        
        const theme = this.themes[themeIndex];
        if (!theme) {
            console.error('Theme not found:', themeIndex);
            return;
        }
        
        console.log(`🎨 Loading theme: ${theme.name}`);
        
        this.isLoading = true;
        this.showLoadingScreen(`Loading ${theme.name}...`);
        
        try {
            // Update current theme index
            this.currentThemeIndex = themeIndex;
            
            // Update UI
            this.updateThemeDisplay(theme.name);
            
            // Clear existing content
            this.clearEnvironment();
            this.clearPhotos();
            
            // Load environment
            await this.loadEnvironment(theme);
            this.updateProgress(25);
            
            // Load photos using enhanced method
            const photos = await this.loadPhotos(theme);
            this.updateProgress(50);
            
            // Preload images (skip for Thailand to speed up loading)
            if (theme.id !== 'thailand') {
                await this.photoLoader.preloadImages(photos);
            } else {
                console.log('⚡ Skipping preload for Thailand photos for faster loading');
            }
            this.updateProgress(75);
            
            // Create photo displays
            await this.createPhotoDisplays(photos, theme);
            this.updateProgress(90);
            
            // Load audio
            await this.loadAudio(theme);
            this.updateProgress(100);
            
            console.log(`✅ Theme loaded successfully: ${theme.name}`);
            
        } catch (error) {
            console.error('Failed to load theme:', error);
            this.showError(`Failed to load ${theme.name}. Please try again.`);
        } finally {
            this.isLoading = false;
            setTimeout(() => this.hideLoadingScreen(), 500);
        }
    }
    
    async loadEnvironment(theme) {
        console.log(`🌍 Loading environment: ${theme.environment}`);
        
        // Clear existing environment
        while (this.environmentContainer.firstChild) {
            this.environmentContainer.removeChild(this.environmentContainer.firstChild);
        }
        
        // Create environment based on theme
        switch (theme.environment) {
            case 'gallery':
                this.createGalleryEnvironment();
                break;
            case 'thailand':
                this.createThailandEnvironment();
                break;
            default:
                this.createDefaultEnvironment();
        }
        
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    createGalleryEnvironment() {
        // Modern gallery with white walls and spotlights
        const walls = document.createElement('a-entity');
        walls.innerHTML = `
            <!-- Gallery Walls -->
            <a-box position="0 2.5 -8" width="16" height="5" depth="0.2" 
                   color="#f8f8f8" material="roughness: 0.1" shadow="receive: true"></a-box>
            <a-box position="-8 2.5 0" width="0.2" height="5" depth="16" 
                   color="#f8f8f8" material="roughness: 0.1" shadow="receive: true"></a-box>
            <a-box position="8 2.5 0" width="0.2" height="5" depth="16" 
                   color="#f8f8f8" material="roughness: 0.1" shadow="receive: true"></a-box>
            
            <!-- Ceiling -->
            <a-box position="0 5 0" width="16" height="0.2" depth="16" 
                   color="#ffffff" material="roughness: 0.1" shadow="receive: true"></a-box>
            
            <!-- Spotlights -->
            <a-light type="spot" position="-4 4.5 -4" rotation="-45 0 0" 
                     color="#ffffff" intensity="0.8" angle="30" shadow="cast: true"></a-light>
            <a-light type="spot" position="4 4.5 -4" rotation="-45 0 0" 
                     color="#ffffff" intensity="0.8" angle="30" shadow="cast: true"></a-light>
            <a-light type="spot" position="0 4.5 0" rotation="-45 0 0" 
                     color="#ffffff" intensity="0.8" angle="30" shadow="cast: true"></a-light>
                     
            <!-- Display pedestals -->
            <a-cylinder position="-3 0.5 2" radius="0.8" height="1" 
                        color="#e0e0e0" material="roughness: 0.2" shadow="receive: true"></a-cylinder>
            <a-cylinder position="3 0.5 2" radius="0.8" height="1" 
                        color="#e0e0e0" material="roughness: 0.2" shadow="receive: true"></a-cylinder>
        `;
        
        this.environmentContainer.appendChild(walls);
        
        // Update scene background
        const sky = document.querySelector('#sky');
        if (sky) {
            sky.setAttribute('color', '#f0f0f0');
        }
    }
    
    createThailandEnvironment() {
        // Tropical environment with bamboo structures
        const environment = document.createElement('a-entity');
        environment.innerHTML = `
            <!-- Bamboo Pavilion Structure -->
            <a-cylinder position="-6 2.5 -6" radius="0.1" height="5" 
                        color="#8FBC8F" material="roughness: 0.8"></a-cylinder>
            <a-cylinder position="6 2.5 -6" radius="0.1" height="5" 
                        color="#8FBC8F" material="roughness: 0.8"></a-cylinder>
            <a-cylinder position="-6 2.5 6" radius="0.1" height="5" 
                        color="#8FBC8F" material="roughness: 0.8"></a-cylinder>
            <a-cylinder position="6 2.5 6" radius="0.1" height="5" 
                        color="#8FBC8F" material="roughness: 0.8"></a-cylinder>
            
            <!-- Bamboo Roof -->
            <a-box position="0 5.2 0" width="14" height="0.3" depth="14" 
                   color="#DEB887" material="roughness: 0.9" shadow="receive: true"></a-box>
            
            <!-- Tropical Plants -->
            <a-cone position="-8 1 -2" radius-bottom="0.5" radius-top="0.1" height="2" 
                    color="#228B22" material="roughness: 0.8"></a-cone>
            <a-cone position="8 1 2" radius-bottom="0.5" radius-top="0.1" height="2" 
                    color="#228B22" material="roughness: 0.8"></a-cone>
            <a-cone position="-3 1.5 8" radius-bottom="0.8" radius-top="0.1" height="3" 
                    color="#32CD32" material="roughness: 0.8"></a-cone>
            <a-cone position="7 1.2 7" radius-bottom="0.6" radius-top="0.1" height="2.5" 
                    color="#228B22" material="roughness: 0.8"></a-cone>
            
            <!-- Stone path -->
            <a-box position="0 0.05 0" width="2" height="0.1" depth="12" 
                   color="#708090" material="roughness: 0.7" shadow="receive: true"></a-box>
            
            <!-- Warm lighting with colored gels -->
            <a-light type="point" position="0 4 0" color="#FFD700" intensity="0.6" shadow="cast: true"></a-light>
            <a-light type="point" position="-4 3 -4" color="#FFA500" intensity="0.4"></a-light>
            <a-light type="point" position="4 3 4" color="#FFA500" intensity="0.4"></a-light>
            
            <!-- Water feature -->
            <a-circle position="5 0.1 -3" radius="1.5" rotation="-90 0 0" 
                      color="#4682B4" material="opacity: 0.7; transparent: true"></a-circle>
        `;
        
        this.environmentContainer.appendChild(environment);
        
        // Update scene background to tropical sky
        const sky = document.querySelector('#sky');
        if (sky) {
            sky.setAttribute('color', '#87CEEB');
        }
    }
    
    createDefaultEnvironment() {
        // Simple default environment
        const environment = document.createElement('a-entity');
        environment.innerHTML = `
            <a-box position="0 2.5 -5" width="10" height="5" depth="0.2" 
                   color="#cccccc" material="roughness: 0.5" shadow="receive: true"></a-box>
            <a-light type="point" position="0 4 0" color="#ffffff" intensity="0.8" shadow="cast: true"></a-light>
        `;
        
        this.environmentContainer.appendChild(environment);
    }
    
    async createPhotoDisplays(photos, theme) {
        console.log(`📸 Creating photo displays for ${photos.length} photos`);
        
        // Generate positions based on theme layout
        const positions = this.photoLoader.generatePhotoPositions(photos.length, theme.layout);
        
        // Create photo frames
        photos.forEach((photo, index) => {
            if (index < positions.length) {
                this.createPhotoFrame(photo, positions[index], theme);
            }
        });
        
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    createPhotoFrame(photo, position, theme) {
        console.log(`🖼️ Creating frame for photo: ${photo.src}`, { photo, position, theme });

        // Main container
        const frameEntity = document.createElement('a-entity');
        frameEntity.setAttribute('class', 'interactive photo-frame');
        frameEntity.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
        if (position.rotation) {
            // FIX: Use correct rotation axes (x, y, z)
            frameEntity.setAttribute('rotation', `${position.rotation.x} ${position.rotation.y} ${position.rotation.z}`);
        }

        // Frame background
        const frameBG = document.createElement('a-box');
        const frameColor = theme.id === 'thailand' ? '#8B4513' : '#2c2c2c';
        const frameWidth = 2.2;
        const frameHeight = 1.7;
        frameBG.setAttribute('width', frameWidth);
        frameBG.setAttribute('height', frameHeight);
        frameBG.setAttribute('depth', 0.1);
        frameBG.setAttribute('color', frameColor);
        frameBG.setAttribute('material', 'roughness: 0.8; metalness: 0.1');
        frameBG.setAttribute('shadow', 'cast: true');
        frameEntity.appendChild(frameBG);

        // The image itself
        const imagePlane = document.createElement('a-plane');
        imagePlane.setAttribute('width', frameWidth - 0.2);
        imagePlane.setAttribute('height', frameHeight - 0.2);
        imagePlane.setAttribute('position', '0 0 0.06');
        
        // CRITICAL FIX: Set the material src attribute correctly as an object.
        // This avoids template string issues and lets A-Frame handle the path safely.
        imagePlane.setAttribute('material', {
            shader: 'flat',
            src: photo.src,
            transparent: true,
            color: '#fff'
        });

        // Add event listeners for debugging
        imagePlane.addEventListener('materialtextureloaded', () => {
            console.log(`✅ Texture loaded successfully for ${photo.src}`);
        });
        imagePlane.addEventListener('materialerror', (err) => {
            console.error(`❌ Texture FAILED to load for ${photo.src}`, err);
        });
        frameEntity.appendChild(imagePlane);
        
        // Title text
        const textEntity = document.createElement('a-text');
        textEntity.setAttribute('value', photo.title || '');
        textEntity.setAttribute('position', `0 -${frameHeight / 2 + 0.2} 0.06`);
        textEntity.setAttribute('align', 'center');
        textEntity.setAttribute('color', '#ffffff');
        textEntity.setAttribute('width', 6);
        textEntity.setAttribute('font', 'dejavu');
        frameEntity.appendChild(textEntity);
        
        // Click handler
        frameEntity.addEventListener('click', () => this.onPhotoClick(photo));

        this.photoContainer.appendChild(frameEntity);
        console.log(`➡️ Frame for ${photo.src} added to the scene.`);
    }
    
    async loadAudio(theme) {
        console.log(`🔊 Loading audio for theme: ${theme.name}`);
        
        // Stop current audio
        if (this.ambientAudio) {
            this.ambientAudio.pause();
            this.ambientAudio.currentTime = 0;
        }
        
        // Load new ambient audio
        if (theme.ambientSound) {
            try {
                this.ambientAudio.src = theme.ambientSound;
                this.ambientAudio.volume = 0.3;
                
                // Play audio (with user gesture check)
                const playPromise = this.ambientAudio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log('Audio autoplay prevented:', error);
                        // Audio will play when user interacts
                    });
                }
            } catch (error) {
                console.warn('Failed to load ambient audio:', error);
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    clearEnvironment() {
        if (this.environmentContainer) {
            while (this.environmentContainer.firstChild) {
                this.environmentContainer.removeChild(this.environmentContainer.firstChild);
            }
        }
    }
    
    clearPhotos() {
        if (this.photoContainer) {
            while (this.photoContainer.firstChild) {
                this.photoContainer.removeChild(this.photoContainer.firstChild);
            }
        }
    }
    
    nextTheme() {
        if (this.isLoading || this.themes.length <= 1) return;
        
        const nextIndex = (this.currentThemeIndex + 1) % this.themes.length;
        this.loadTheme(nextIndex);
    }
    
    previousTheme() {
        if (this.isLoading || this.themes.length <= 1) return;
        
        const prevIndex = this.currentThemeIndex === 0 
            ? this.themes.length - 1 
            : this.currentThemeIndex - 1;
        this.loadTheme(prevIndex);
    }
    
    toggleVRMode() {
        if (this.scene) {
            if (this.isVRMode) {
                this.scene.exitVR();
            } else {
                this.scene.enterVR();
            }
        }
    }
    
    toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }
    
    onEnterVR() {
        this.isVRMode = true;
        this.uiOverlay?.classList.add('vr-mode');
        console.log('👓 Entered VR mode');
        
        // Enable ambient audio if it was blocked
        if (this.ambientAudio && this.ambientAudio.paused) {
            this.ambientAudio.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    onExitVR() {
        this.isVRMode = false;
        this.uiOverlay?.classList.remove('vr-mode');
        console.log('🖥️ Exited VR mode');
    }
    
    onPhotoClick(photo) {
        console.log('📸 Photo clicked:', photo.title);
        
        // Play click sound
        if (this.clickSound) {
            this.clickSound.currentTime = 0;
            this.clickSound.play().catch(e => console.log('Click sound failed:', e));
        }
        
        // Show photo info
        this.showPhotoInfo(photo);
    }
    
    showPhotoInfo(photo) {
        // Create or update photo info panel
        let infoPanel = document.querySelector('.photo-info-panel');
        if (!infoPanel) {
            infoPanel = document.createElement('div');
            infoPanel.className = 'photo-info-panel';
            document.body.appendChild(infoPanel);
        }
        
        infoPanel.innerHTML = `
            <h3>${photo.title}</h3>
            <p><strong>Location:</strong> ${photo.location || 'Unknown'}</p>
            <p><strong>Description:</strong> ${photo.description || 'No description available'}</p>
            ${photo.date ? `<p><strong>Date:</strong> ${photo.date}</p>` : ''}
        `;
        
        infoPanel.classList.add('visible');
        
        // Hide after 5 seconds
        setTimeout(() => {
            infoPanel.classList.remove('visible');
        }, 5000);
    }
    
    handleKeyboardInput(event) {
        switch (event.key.toLowerCase()) {
            case 'f':
                event.preventDefault();
                this.toggleFullscreen();
                break;
            case 'arrowleft':
                event.preventDefault();
                this.previousTheme();
                break;
            case 'arrowright':
                event.preventDefault();
                this.nextTheme();
                break;
            case 'v':
                event.preventDefault();
                this.toggleVRMode();
                break;
            case 'escape':
                if (this.isVRMode) {
                    this.scene.exitVR();
                }
                break;
        }
    }
    
    handleResize() {
        // Handle window resize events
        if (this.scene && this.scene.resize) {
            this.scene.resize();
        }
    }
    
    updateThemeDisplay(themeName) {
        if (this.currentThemeDisplay) {
            this.currentThemeDisplay.textContent = themeName;
        }
        
        // Update VR room display
        const vrRoomDisplay = document.querySelector('#vr-room-display');
        if (vrRoomDisplay) {
            vrRoomDisplay.setAttribute('value', themeName);
        }
    }
    
    updateProgress(percentage) {
        if (this.progressBar) {
            this.progressBar.style.width = `${percentage}%`;
        }
    }
    
    showLoadingScreen(message = 'Loading...') {
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');
            const loadingText = this.loadingScreen.querySelector('h2');
            if (loadingText) {
                loadingText.textContent = message;
            }
            this.updateProgress(0);
        }
    }
    
    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
        }
    }
    
    showError(message) {
        console.error('VR Museum Error:', message);
        
        // Create error modal instead of alert
        const errorModal = document.createElement('div');
        errorModal.className = 'error-modal';
        errorModal.innerHTML = `
            <div class="error-content">
                <h2>Error</h2>
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        document.body.appendChild(errorModal);
    }
    
    async loadPhotos(theme) {
        console.log(`📸 Loading photos for theme: ${theme.name}`);
        
        if (theme.id === 'thailand') {
            console.log('🇹🇭 FORCE-LOADING THAILAND PHOTOS (uppercase .JPG)');
            const photoPaths = [
                'assets/photos/thailand/thailand1.JPG',
                'assets/photos/thailand/thailand2.JPG',
                'assets/photos/thailand/thailand3.JPG',
                'assets/photos/thailand/thailand4.JPG',
                'assets/photos/thailand/thailand5.JPG',
                'assets/photos/thailand/thailand6.JPG',
                'assets/photos/thailand/thailand7.JPG',
                'assets/photos/thailand/thailand8.JPG'
            ];
            
            const actualPhotos = photoPaths.map((path, i) => ({
                src: path,
                title: `Thailand Memory ${i + 1}`,
                description: 'A beautiful memory from Thailand.',
                location: 'Thailand',
                date: '2024-06-23'
            }));

            console.log(`✅ Constructed ${actualPhotos.length} photo objects with .JPG extension.`, actualPhotos);
            return actualPhotos;
        }
        
        // Use PhotoLoader for other themes only
        const photos = await this.photoLoader.loadPhotosForTheme(theme.photoFolder, theme.id);
        console.log(`PhotoLoader returned ${photos.length} photos for ${theme.id}`);
        return photos;
    }
}

// Initialize the VR Museum when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.vrMuseum = new VRMuseum();
});

// Export for module usage
export default VRMuseum; 