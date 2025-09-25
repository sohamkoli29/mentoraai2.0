// postcss.config.js - Fixed configuration for proper CSS processing

export default {
  plugins: {
    // Import plugin to handle @import statements
    'postcss-import': {},
    
    // Tailwind CSS
    tailwindcss: {},
    
    // Autoprefixer for vendor prefixes
    autoprefixer: {},
    
    // CSS Nano for production minification (only in production)
  
  },
}