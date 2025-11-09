// Mobile Integration for WebRetro
// This script integrates mobile controls with existing WebRetro functionality

(function() {
    'use strict';
    
    // Wait for both WebRetro and mobile controls to be ready
    function initializeMobileIntegration() {
        if (typeof window.mobileControls === 'undefined') {
            setTimeout(initializeMobileIntegration, 100);
            return;
        }
        
        const mobileControls = window.mobileControls;
        
        // Enhanced mobile detection
        function isMobileDevice() {
            const userAgent = navigator.userAgent;
            const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
            const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const smallScreen = window.innerWidth <= 768 || window.innerHeight <= 600;
            
            return mobileRegex.test(userAgent) || (touchCapable && smallScreen);
        }
        
        // Canvas resize handler for mobile
        function adjustCanvasForMobile() {
            const canvas = document.getElementById('canvas');
            const controls = document.getElementById('mobile-controls');
            
            if (!canvas || !controls) return;
            
            if (mobileControls.isActive) {
                document.body.classList.add('mobile-controls-active');
                const controlsHeight = controls.offsetHeight;
                canvas.style.height = `calc(100vh - var(--menuheight) - ${controlsHeight}px)`;
            } else {
                document.body.classList.remove('mobile-controls-active');
                canvas.style.height = `calc(100vh - var(--menuheight))`;
            }
        }
        
        // Fullscreen handler
        function toggleFullscreenMode() {
            if (document.fullscreenElement) {
                document.body.classList.add('mobile-fullscreen');
                mobileControls.adjustLayoutForOrientation();
            } else {
                document.body.classList.remove('mobile-fullscreen');
            }
        }
        
        // Performance optimization for mobile
        function optimizePerformanceForMobile() {
            if (!isMobileDevice()) return;
            
            // Reduce animation frame rate on very low-end devices
            const isLowEnd = navigator.hardwareConcurrency < 4;
            if (isLowEnd) {
                // Add performance hints to the document
                document.documentElement.style.setProperty('--animation-duration', '0s');
            }
            
            // Optimize canvas rendering
            const canvas = document.getElementById('canvas');
            if (canvas) {
                canvas.style.imageRendering = 'pixelated';
                canvas.style.imageRendering = 'crisp-edges';
            }
        }
        
        // Auto-hide controls after inactivity
        let inactivityTimer;
        function setupAutoHideControls() {
            if (!isMobileDevice()) return;
            
            function resetInactivityTimer() {
                clearTimeout(inactivityTimer);
                document.body.classList.remove('controls-hidden');
                
                inactivityTimer = setTimeout(() => {
                    if (mobileControls.isActive && !document.querySelector('.modal:not([style*="display: none"])')) {
                        document.body.classList.add('controls-hidden');
                    }
                }, 10000); // Hide after 10 seconds of inactivity
            }
            
            // Reset timer on any interaction
            document.addEventListener('touchstart', resetInactivityTimer);
            document.addEventListener('touchmove', resetInactivityTimer);
            document.addEventListener('click', resetInactivityTimer);
            
            resetInactivityTimer();
        }
        
        // Enhanced orientation handling
        function handleOrientationChange() {
            setTimeout(() => {
                adjustCanvasForMobile();
                mobileControls.adjustLayoutForOrientation();
                
                // Force a repaint to fix orientation issues
                const canvas = document.getElementById('canvas');
                if (canvas) {
                    canvas.style.display = 'none';
                    canvas.offsetHeight; // Trigger reflow
                    canvas.style.display = 'block';
                }
            }, 200);
        }
        
        // Improve save/load functionality for mobile
        function enhanceSaveLoadForMobile() {
            const saveButtons = document.querySelectorAll('#savegame, #savestate');
            const loadButtons = document.querySelectorAll('#loadstate');
            
            saveButtons.forEach(button => {
                const originalClick = button.onclick;
                button.onclick = function(e) {
                    // Add visual feedback for mobile
                    button.style.backgroundColor = '#4CAF50';
                    setTimeout(() => {
                        button.style.backgroundColor = '';
                    }, 300);
                    
                    if (originalClick) {
                        originalClick.call(this, e);
                    }
                };
            });
            
            loadButtons.forEach(button => {
                const originalClick = button.onclick;
                button.onclick = function(e) {
                    // Add visual feedback for mobile
                    button.style.backgroundColor = '#2196F3';
                    setTimeout(() => {
                        button.style.backgroundColor = '';
                    }, 300);
                    
                    if (originalClick) {
                        originalClick.call(this, e);
                    }
                };
            });
        }
        
        // Add gesture support for common actions
        function setupGestureControls() {
            if (!isMobileDevice()) return;
            
            let touchStartY = 0;
            let touchStartTime = 0;
            
            document.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    touchStartY = e.touches[0].clientY;
                    touchStartTime = Date.now();
                }
            }, { passive: true });
            
            document.addEventListener('touchend', (e) => {
                if (e.changedTouches.length === 1) {
                    const touchEndY = e.changedTouches[0].clientY;
                    const touchEndTime = Date.now();
                    const deltaY = touchStartY - touchEndY;
                    const deltaTime = touchEndTime - touchStartTime;
                    
                    // Swipe up to show menu
                    if (deltaY > 50 && deltaTime < 300 && touchStartY > window.innerHeight - 100) {
                        const menuToggle = document.getElementById('mobile-menu-toggle');
                        if (menuToggle) {
                            menuToggle.click();
                        }
                    }
                    
                    // Swipe down to hide menu
                    if (deltaY < -50 && deltaTime < 300 && touchStartY < 100) {
                        const menuHider = document.getElementById('menuhider');
                        if (menuHider && menuHider.checked) {
                            menuHider.checked = false;
                        }
                    }
                }
            }, { passive: true });
        }
        
        // Add haptic feedback for important actions
        function addHapticFeedback() {
            if (!navigator.vibrate) return;
            
            // Add haptic feedback to save/load actions
            document.addEventListener('click', (e) => {
                const target = e.target;
                if (target.matches('#savestate, #loadstate, #savegame, #resetbutton')) {
                    navigator.vibrate(100);
                }
            });
            
            // Add subtle feedback for menu interactions
            document.addEventListener('click', (e) => {
                const target = e.target;
                if (target.closest('#menu')) {
                    navigator.vibrate(30);
                }
            });
        }
        
        // Initialize mobile-specific features
        function initializeMobileFeatures() {
            if (isMobileDevice()) {
                optimizePerformanceForMobile();
                setupAutoHideControls();
                enhanceSaveLoadForMobile();
                setupGestureControls();
                addHapticFeedback();
                
                // Add mobile class to body
                document.body.classList.add('mobile-device');
                
                // Adjust initial layout
                adjustCanvasForMobile();
            }
        }
        
        // Event listeners
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', adjustCanvasForMobile);
        document.addEventListener('fullscreenchange', toggleFullscreenMode);
        
        // Override mobile controls toggle to integrate with canvas
        const originalToggleControls = mobileControls.toggleControls;
        mobileControls.toggleControls = function() {
            originalToggleControls.call(this);
            adjustCanvasForMobile();
        };
        
        // Initialize everything
        initializeMobileFeatures();
        
        // Expose utility functions globally
        window.webretroMobile = {
            isMobileDevice,
            adjustCanvasForMobile,
            toggleFullscreenMode
        };
        
        console.log('Mobile integration initialized successfully');
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMobileIntegration);
    } else {
        initializeMobileIntegration();
    }
})();