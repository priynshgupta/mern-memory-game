// This file is a wrapper to redirect Render to the server directory
// It's a simple fix for the deployment issue

console.log('Starting server from root directory wrapper...');

// Import and run the actual server
try {
    require('./server/server.js');
} catch (error) {
    console.error('Failed to load server.js from server directory:', error);
    process.exit(1);
}
