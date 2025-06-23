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
            // First, try to load the photo manifest if it exists
            const manifest = await this.loadPhotoManifest(themePath);
            if (manifest && manifest.photos.length > 0) {
                return await this.loadPhotosFromManifest(manifest, themePath);
            }
            
            // Fallback: load demo photos for development
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
            const response = await fetch(manifestPath);
            
            if (!response.ok) {
                throw new Error(`Manifest not found: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.log(`No manifest found at ${themePath}photos.json - using fallback`);
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
                
                // Check if image exists
                if (await this.checkImageExists(photoUrl)) {
                    photos.push({
                        src: photoUrl,
                        title: photoData.title || photoData.filename,
                        description: photoData.description || '',
                        date: photoData.date || '',
                        location: photoData.location || '',
                        tags: photoData.tags || []
                    });
                }
            } catch (error) {
                console.warn(`Failed to load photo: ${photoData.filename}`, error);
            }
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
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }
    
    /**
     * Create demo photos for development/testing
     * @param {string} themeId - Theme identifier
     * @returns {Array} Array of demo photo objects
     */
    createDemoPhotos(themeId) {
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
        const loadPromises = photos.map(photo => {
            return new Promise((resolve, reject) => {
                if (this.photoCache.has(photo.src)) {
                    resolve(this.photoCache.get(photo.src));
                    return;
                }
                
                const img = new Image();
                img.onload = () => {
                    this.photoCache.set(photo.src, img);
                    resolve(img);
                };
                img.onerror = reject;
                img.src = photo.src;
            });
        });
        
        try {
            await Promise.all(loadPromises);
            console.log(`✅ Preloaded ${photos.length} images`);
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
        const positions = [];
        
        switch (layout) {
            case 'wall':
                // Standard wall layout
                const spacing = 3;
                const wallWidth = Math.ceil(Math.sqrt(photoCount)) * spacing;
                let x = -wallWidth / 2;
                let y = 2;
                
                for (let i = 0; i < photoCount; i++) {
                    positions.push({
                        x: x + (i % Math.ceil(Math.sqrt(photoCount))) * spacing,
                        y: y,
                        z: -7,
                        rotation: { x: 0, y: 0, z: 0 }
                    });
                    
                    if ((i + 1) % Math.ceil(Math.sqrt(photoCount)) === 0) {
                        y += 2;
                    }
                }
                break;
                
            case 'circle':
                // Circular layout
                const radius = Math.max(4, photoCount * 0.5);
                for (let i = 0; i < photoCount; i++) {
                    const angle = (i / photoCount) * Math.PI * 2;
                    positions.push({
                        x: Math.cos(angle) * radius,
                        y: 2,
                        z: Math.sin(angle) * radius,
                        rotation: { x: 0, y: -angle * 180 / Math.PI, z: 0 }
                    });
                }
                break;
                
            case 'grid':
                // Grid layout
                const cols = Math.ceil(Math.sqrt(photoCount));
                const rows = Math.ceil(photoCount / cols);
                const gridSpacing = 2.5;
                
                for (let i = 0; i < photoCount; i++) {
                    const col = i % cols;
                    const row = Math.floor(i / cols);
                    
                    positions.push({
                        x: (col - cols / 2) * gridSpacing,
                        y: 2 + (rows / 2 - row) * 2,
                        z: -6,
                        rotation: { x: 0, y: 0, z: 0 }
                    });
                }
                break;
        }
        
        return positions;
    }
}

// Export for module usage
export default PhotoLoader; 