/**
 * Photo Loader - Utility for loading and managing photo collections
 */

class PhotoLoader {
    constructor() {
        this.photoCache = new Map();
        this.metadataCache = new Map();
    }
    
    /**
     * Load photos for a specific theme
     * @param {string} themePath - Path to the theme folder
     * @param {string} themeId - Theme identifier
     * @returns {Promise<Array>} Array of photo objects
     */
    async loadPhotosForTheme(themePath, themeId) {
        console.log(`📁 Loading photos from: ${themePath}`);
        
        try {
            // First, try to load the photo manifest
            const manifest = await this.loadPhotoManifest(themePath);
            if (manifest && manifest.photos && manifest.photos.length > 0) {
                console.log(`Found manifest with ${manifest.photos.length} photos`);
                const photos = await this.loadPhotosFromManifest(manifest, themePath);
                if (photos.length > 0) {
                    console.log(`✅ Successfully loaded ${photos.length} photos from manifest`);
                    return photos;
                }
            }
            
            // Fallback: try to load photos by scanning common names
            console.log('Trying fallback photo loading...');
            const fallbackPhotos = await this.loadPhotosWithFallback(themePath, themeId);
            if (fallbackPhotos.length > 0) {
                return fallbackPhotos;
            }
            
            // Last resort: demo photos
            console.log('Using demo photos as last resort');
            return this.createDemoPhotos(themeId);
            
        } catch (error) {
            console.warn(`Failed to load photos for theme ${themeId}:`, error);
            return this.createDemoPhotos(themeId);
        }
    }
    
    /**
     * Load photo manifest file (photos.json)
     * @param {string} themePath - Path to theme folder
     * @returns {Promise<Object>} Photo manifest object
     */
    async loadPhotoManifest(themePath) {
        try {
            const manifestPath = `${themePath}photos.json`;
            console.log(`Trying to load manifest from: ${manifestPath}`);
            const response = await fetch(manifestPath);
            
            if (!response.ok) {
                throw new Error(`Manifest not found: ${response.status}`);
            }
            
            const manifest = await response.json();
            console.log('✅ Manifest loaded successfully:', manifest);
            return manifest;
        } catch (error) {
            console.log(`No manifest found at ${themePath}photos.json - error:`, error);
            return null;
        }
    }
    
    /**
     * Load photos from manifest file
     * @param {Object} manifest - Photo manifest
     * @param {string} basePath - Base path for photos
     * @returns {Promise<Array>} Array of photo objects
     */
    async loadPhotosFromManifest(manifest, basePath) {
        const photos = [];
        
        for (const photoData of manifest.photos) {
            try {
                const photoUrl = `${basePath}${photoData.filename}`;
                console.log(`Checking photo: ${photoUrl}`);
                
                // Check if image exists
                const exists = await this.checkImageExists(photoUrl);
                console.log(`Photo ${photoData.filename} exists: ${exists}`);
                
                if (exists) {
                    photos.push({
                        src: photoUrl,
                        title: photoData.title || photoData.filename,
                        description: photoData.description || '',
                        date: photoData.date || '',
                        location: photoData.location || '',
                        tags: photoData.tags || []
                    });
                } else {
                    console.warn(`Photo not found: ${photoUrl}`);
                }
            } catch (error) {
                console.warn(`Failed to load photo: ${photoData.filename}`, error);
            }
        }
        
        console.log(`Loaded ${photos.length} photos from manifest`);
        return photos;
    }
    
    /**
     * Fallback method to load photos by common naming patterns
     * @param {string} themePath - Path to theme folder
     * @param {string} themeId - Theme identifier
     * @returns {Promise<Array>} Array of photo objects
     */
    async loadPhotosWithFallback(themePath, themeId) {
        const photos = [];
        const commonExtensions = ['JPG', 'jpg', 'PNG', 'png', 'JPEG', 'jpeg'];
        const commonNames = [];
        
        // Generate common photo names for Thailand
        if (themeId === 'thailand') {
            for (let i = 1; i <= 20; i++) {
                commonNames.push(`thailand${i}`);
                commonNames.push(`Thailand${i}`);
            }
        }
        
        // Try each combination
        for (const name of commonNames) {
            for (const ext of commonExtensions) {
                const filename = `${name}.${ext}`;
                const photoUrl = `${themePath}${filename}`;
                
                try {
                    if (await this.checkImageExists(photoUrl)) {
                        photos.push({
                            src: photoUrl,
                            title: `${themeId.charAt(0).toUpperCase() + themeId.slice(1)} Photo ${photos.length + 1}`,
                            description: `Beautiful memory from ${themeId}`,
                            location: themeId.charAt(0).toUpperCase() + themeId.slice(1),
                            date: new Date().toISOString().split('T')[0]
                        });
                        console.log(`✅ Found photo: ${filename}`);
                        
                        // Limit to 12 photos max
                        if (photos.length >= 12) break;
                    }
                } catch (error) {
                    // Silent fail for this method
                }
            }
            if (photos.length >= 12) break;
        }
        
        return photos;
    }
    
    /**
     * Check if an image URL exists
     * @param {string} url - Image URL
     * @returns {Promise<boolean>} Whether the image exists
     */
    checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                console.log(`✅ Image loaded: ${url}`);
                resolve(true);
            };
            img.onerror = () => {
                console.log(`❌ Image failed: ${url}`);
                resolve(false);
            };
            img.src = url;
            
            // Timeout after 10 seconds
            setTimeout(() => {
                console.log(`⏰ Image timeout: ${url}`);
                resolve(false);
            }, 10000);
        });
    }
    
    /**
     * Create demo photos for development/testing
     * @param {string} themeId - Theme identifier
     * @returns {Array} Array of demo photo objects
     */
    createDemoPhotos(themeId) {
        console.log(`Creating demo photos for theme: ${themeId}`);
        
        const demoPhotos = {
            gallery: [
                {
                    src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
                    title: 'Modern Architecture',
                    description: 'Contemporary building design',
                    location: 'Urban Center'
                },
                {
                    src: 'https://images.unsplash.com/photo-1567696911980-2eed69a46d8f?w=800&h=600&fit=crop',
                    title: 'Gallery Interior',
                    description: 'Minimalist exhibition space',
                    location: 'Art Museum'
                },
                {
                    src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
                    title: 'Abstract Art',
                    description: 'Contemporary artwork display',
                    location: 'Modern Gallery'
                },
                {
                    src: 'https://images.unsplash.com/photo-1577720580979-7c503ca1b874?w=800&h=600&fit=crop',
                    title: 'Sculpture Exhibition',
                    description: 'Three-dimensional artworks',
                    location: 'Sculpture Hall'
                }
            ],
            thailand: [
                {
                    src: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop',
                    title: 'Thai Temple',
                    description: 'Traditional Buddhist architecture',
                    location: 'Bangkok, Thailand'
                },
                {
                    src: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop',
                    title: 'Tropical Beach',
                    description: 'Crystal clear waters and white sand',
                    location: 'Phuket, Thailand'
                },
                {
                    src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
                    title: 'Thai Market',
                    description: 'Colorful floating market',
                    location: 'Damnoen Saduak'
                },
                {
                    src: 'https://images.unsplash.com/photo-1571344514942-3e36e1e8b626?w=800&h=600&fit=crop',
                    title: 'Jungle Landscape',
                    description: 'Lush tropical rainforest',
                    location: 'Khao Sok National Park'
                }
            ]
        };
        
        return demoPhotos[themeId] || demoPhotos.gallery;
    }
    
    /**
     * Preload images for better performance
     * @param {Array} photos - Array of photo objects
     * @returns {Promise<Array>} Promise that resolves when all images are loaded
     */
    async preloadImages(photos) {
        console.log(`Preloading ${photos.length} images...`);
        
        const loadPromises = photos.map((photo, index) => {
            return new Promise((resolve, reject) => {
                if (this.photoCache.has(photo.src)) {
                    resolve(this.photoCache.get(photo.src));
                    return;
                }
                
                const img = new Image();
                img.onload = () => {
                    console.log(`✅ Preloaded image ${index + 1}: ${photo.title}`);
                    this.photoCache.set(photo.src, img);
                    resolve(img);
                };
                img.onerror = (error) => {
                    console.warn(`❌ Failed to preload image ${index + 1}: ${photo.title}`, error);
                    reject(error);
                };
                img.src = photo.src;
            });
        });
        
        try {
            await Promise.allSettled(loadPromises);
            console.log(`✅ Preloading completed for ${photos.length} images`);
        } catch (error) {
            console.warn('Some images failed to preload:', error);
        }
        
        return photos;
    }
    
    /**
     * Get cached image or create new one
     * @param {string} src - Image source URL
     * @returns {HTMLImageElement} Image element
     */
    getCachedImage(src) {
        if (this.photoCache.has(src)) {
            return this.photoCache.get(src);
        }
        
        const img = new Image();
        img.src = src;
        this.photoCache.set(src, img);
        return img;
    }
    
    /**
     * Clear photo cache
     */
    clearCache() {
        this.photoCache.clear();
        this.metadataCache.clear();
        console.log('📸 Photo cache cleared');
    }
    
    /**
     * Get photo dimensions
     * @param {string} src - Image source URL
     * @returns {Promise<Object>} Object with width and height
     */
    async getImageDimensions(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    aspectRatio: img.naturalWidth / img.naturalHeight
                });
            };
            img.onerror = reject;
            img.src = src;
        });
    }
    
    /**
     * Generate photo positions for gallery layout
     * @param {number} photoCount - Number of photos to position
     * @param {string} layout - Layout type ('wall', 'circle', 'grid')
     * @returns {Array} Array of position objects
     */
    generatePhotoPositions(photoCount, layout = 'wall') {
        console.log(`Generating ${layout} layout for ${photoCount} photos`);
        const positions = [];
        
        switch (layout) {
            case 'wall':
                // Standard wall layout
                const spacing = 3;
                const cols = Math.min(4, photoCount);
                const rows = Math.ceil(photoCount / cols);
                
                for (let i = 0; i < photoCount; i++) {
                    const col = i % cols;
                    const row = Math.floor(i / cols);
                    
                    positions.push({
                        x: (col - cols / 2) * spacing + spacing / 2,
                        y: 2 + (rows / 2 - row) * 2,
                        z: -7,
                        rotation: { x: 0, y: 0, z: 0 }
                    });
                }
                break;
                
            case 'circle':
                // Circular layout
                const radius = Math.max(5, photoCount * 0.8);
                for (let i = 0; i < photoCount; i++) {
                    const angle = (i / photoCount) * Math.PI * 2;
                    positions.push({
                        x: Math.cos(angle) * radius,
                        y: 2,
                        z: Math.sin(angle) * radius,
                        rotation: { x: 0, y: -angle * 180 / Math.PI + 180, z: 0 }
                    });
                }
                break;
                
            case 'grid':
                // Grid layout
                const gridCols = Math.ceil(Math.sqrt(photoCount));
                const gridRows = Math.ceil(photoCount / gridCols);
                const gridSpacing = 2.5;
                
                for (let i = 0; i < photoCount; i++) {
                    const col = i % gridCols;
                    const row = Math.floor(i / gridCols);
                    
                    positions.push({
                        x: (col - gridCols / 2) * gridSpacing,
                        y: 2 + (gridRows / 2 - row) * 2,
                        z: -6,
                        rotation: { x: 0, y: 0, z: 0 }
                    });
                }
                break;
        }
        
        console.log(`Generated ${positions.length} positions for ${layout} layout`);
        return positions;
    }
}

// Export for module usage
export default PhotoLoader; 