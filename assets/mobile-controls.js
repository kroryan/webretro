// Mobile Touch Controls JavaScript
// Enhanced mobile support for WebRetro

class MobileControls {
    constructor() {
        this.isActive = false;
        this.pressedButtons = new Set();
        this.joystickActive = false;
        this.joystickCenter = {x: 0, y: 0};
        this.joystickPosition = {x: 0, y: 0};
        this.touchStartTime = 0;
        
        // Control mapping
        this.buttonMap = {
            'dpad-up': 'ArrowUp',
            'dpad-down': 'ArrowDown',
            'dpad-left': 'ArrowLeft',
            'dpad-right': 'ArrowRight',
            'btn-a': 'h',
            'btn-b': 'g',
            'btn-x': 'y',
            'btn-y': 't',
            'btn-l': 'e',
            'btn-r': 'p',
            'btn-l2': 'r',
            'btn-r2': 'o',
            'btn-start': 'Enter',
            'btn-select': ' '
        };
        
        this.init();
    }
    
    init() {
        this.createMobileUI();
        this.setupEventListeners();
        this.detectMobileDevice();
    }
    
    detectMobileDevice() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isMobile || isTouchDevice) {
            this.showMobileControls();
            this.optimizeForMobile();
        }
    }
    
    createMobileUI() {
        // Create mobile controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'mobile-controls';
        controlsContainer.id = 'mobile-controls';
        
        controlsContainer.innerHTML = `
            <!-- D-Pad Section -->
            <div class="control-section">
                <div class="dpad">
                    <button class="dpad-button dpad-up" data-button="dpad-up">▲</button>
                    <button class="dpad-button dpad-down" data-button="dpad-down">▼</button>
                    <button class="dpad-button dpad-left" data-button="dpad-left">◀</button>
                    <button class="dpad-button dpad-right" data-button="dpad-right">▶</button>
                </div>
            </div>
            
            <!-- Center Controls -->
            <div class="control-section center-controls">
                <div class="shoulder-buttons">
                    <button class="shoulder-button" data-button="btn-l">L</button>
                    <button class="shoulder-button" data-button="btn-r">R</button>
                </div>
                <div class="shoulder-buttons">
                    <button class="shoulder-button" data-button="btn-l2">L2</button>
                    <button class="shoulder-button" data-button="btn-r2">R2</button>
                </div>
                <div class="start-select">
                    <button class="start-select-button" data-button="btn-select">SEL</button>
                    <button class="start-select-button" data-button="btn-start">START</button>
                </div>
            </div>
            
            <!-- Action Buttons Section -->
            <div class="control-section">
                <div class="action-buttons">
                    <button class="action-button btn-y" data-button="btn-y">Y</button>
                    <button class="action-button btn-x" data-button="btn-x">X</button>
                    <button class="action-button btn-b" data-button="btn-b">B</button>
                    <button class="action-button btn-a" data-button="btn-a">A</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(controlsContainer);
        
        // Create mobile menu toggle
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.id = 'mobile-menu-toggle';
        menuToggle.innerHTML = '☰';
        menuToggle.title = 'Toggle Menu';
        document.body.appendChild(menuToggle);
        
        // Create controls toggle
        const controlsToggle = document.createElement('button');
        controlsToggle.className = 'controls-toggle';
        controlsToggle.id = 'controls-toggle';
        controlsToggle.innerHTML = 'CTRL';
        controlsToggle.title = 'Toggle Controls';
        document.body.appendChild(controlsToggle);
        
        // Create virtual joystick for analog control
        const joystick = document.createElement('div');
        joystick.className = 'virtual-joystick';
        joystick.id = 'virtual-joystick';
        joystick.innerHTML = '<div class="knob"></div>';
        document.body.appendChild(joystick);
    }
    
    setupEventListeners() {
        // Touch controls for buttons
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false });
        
        // Mouse events for testing on desktop
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // Menu toggle
        const menuToggle = document.getElementById('mobile-menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', this.toggleMenu.bind(this));
        }
        
        // Controls toggle
        const controlsToggle = document.getElementById('controls-toggle');
        if (controlsToggle) {
            controlsToggle.addEventListener('click', this.toggleControls.bind(this));
        }
        
        // Orientation change
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.mobile-controls')) {
                e.preventDefault();
            }
        });
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        
        for (const touch of e.touches) {
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            const button = element?.closest('[data-button]');
            
            if (button) {
                const buttonId = button.getAttribute('data-button');
                this.pressButton(buttonId);
                this.addHapticFeedback(touch.clientX, touch.clientY);
            } else if (element?.closest('#canvas')) {
                // Handle canvas touch for analog control
                this.startJoystick(touch.clientX, touch.clientY);
            }
        }
        
        this.touchStartTime = Date.now();
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        
        // Release all pressed buttons
        for (const buttonId of this.pressedButtons) {
            this.releaseButton(buttonId);
        }
        
        this.endJoystick();
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        
        if (this.joystickActive && e.touches.length > 0) {
            const touch = e.touches[0];
            this.updateJoystick(touch.clientX, touch.clientY);
        }
    }
    
    handleMouseDown(e) {
        const button = e.target.closest('[data-button]');
        if (button) {
            e.preventDefault();
            const buttonId = button.getAttribute('data-button');
            this.pressButton(buttonId);
            this.addHapticFeedback(e.clientX, e.clientY);
        }
    }
    
    handleMouseUp(e) {
        const button = e.target.closest('[data-button]');
        if (button) {
            e.preventDefault();
            const buttonId = button.getAttribute('data-button');
            this.releaseButton(buttonId);
        }
    }
    
    handleMouseMove(e) {
        if (this.joystickActive) {
            this.updateJoystick(e.clientX, e.clientY);
        }
    }
    
    pressButton(buttonId) {
        if (this.pressedButtons.has(buttonId)) return;
        
        this.pressedButtons.add(buttonId);
        const key = this.buttonMap[buttonId];
        
        if (key) {
            this.simulateKeyPress(key, true);
        }
        
        // Visual feedback
        const element = document.querySelector(`[data-button="${buttonId}"]`);
        if (element) {
            element.classList.add('active');
        }
    }
    
    releaseButton(buttonId) {
        if (!this.pressedButtons.has(buttonId)) return;
        
        this.pressedButtons.delete(buttonId);
        const key = this.buttonMap[buttonId];
        
        if (key) {
            this.simulateKeyPress(key, false);
        }
        
        // Remove visual feedback
        const element = document.querySelector(`[data-button="${buttonId}"]`);
        if (element) {
            element.classList.remove('active');
        }
    }
    
    simulateKeyPress(key, isPressed) {
        try {
            const event = new KeyboardEvent(isPressed ? 'keydown' : 'keyup', {
                key: key,
                code: this.getKeyCode(key),
                keyCode: this.getKeyCodeNumber(key),
                which: this.getKeyCodeNumber(key),
                bubbles: true,
                cancelable: true
            });
            
            document.dispatchEvent(event);
            
            // Also try dispatching to canvas if it exists
            const canvas = document.getElementById('canvas');
            if (canvas) {
                canvas.dispatchEvent(event);
            }
        } catch (error) {
            console.warn('Error simulating key press:', error);
        }
    }
    
    getKeyCode(key) {
        const codes = {
            'ArrowUp': 'ArrowUp',
            'ArrowDown': 'ArrowDown',
            'ArrowLeft': 'ArrowLeft',
            'ArrowRight': 'ArrowRight',
            'Enter': 'Enter',
            ' ': 'Space',
            'h': 'KeyH',
            'g': 'KeyG',
            'y': 'KeyY',
            't': 'KeyT',
            'e': 'KeyE',
            'p': 'KeyP',
            'r': 'KeyR',
            'o': 'KeyO'
        };
        return codes[key] || key;
    }
    
    getKeyCodeNumber(key) {
        const codes = {
            'ArrowUp': 38,
            'ArrowDown': 40,
            'ArrowLeft': 37,
            'ArrowRight': 39,
            'Enter': 13,
            ' ': 32,
            'h': 72,
            'g': 71,
            'y': 89,
            't': 84,
            'e': 69,
            'p': 80,
            'r': 82,
            'o': 79
        };
        return codes[key] || key.charCodeAt(0);
    }
    
    startJoystick(x, y) {
        const joystick = document.getElementById('virtual-joystick');
        if (!joystick) return;
        
        this.joystickActive = true;
        this.joystickCenter = { x, y };
        
        joystick.style.left = (x - 40) + 'px';
        joystick.style.top = (y - 40) + 'px';
        joystick.classList.add('active');
    }
    
    updateJoystick(x, y) {
        if (!this.joystickActive) return;
        
        const joystick = document.getElementById('virtual-joystick');
        const knob = joystick?.querySelector('.knob');
        if (!knob) return;
        
        const dx = x - this.joystickCenter.x;
        const dy = y - this.joystickCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 25;
        
        let knobX, knobY;
        if (distance <= maxDistance) {
            knobX = dx;
            knobY = dy;
        } else {
            const angle = Math.atan2(dy, dx);
            knobX = Math.cos(angle) * maxDistance;
            knobY = Math.sin(angle) * maxDistance;
        }
        
        knob.style.transform = `translate(${knobX - 15}px, ${knobY - 15}px)`;
        
        // Convert to analog input (if supported by RetroArch)
        this.joystickPosition = {
            x: knobX / maxDistance,
            y: knobY / maxDistance
        };
        
        // Simulate analog stick movement
        this.simulateAnalogInput(this.joystickPosition.x, this.joystickPosition.y);
    }
    
    endJoystick() {
        this.joystickActive = false;
        this.joystickPosition = { x: 0, y: 0 };
        
        const joystick = document.getElementById('virtual-joystick');
        const knob = joystick?.querySelector('.knob');
        
        if (joystick) {
            joystick.classList.remove('active');
        }
        
        if (knob) {
            knob.style.transform = 'translate(-50%, -50%)';
        }
        
        // Reset analog input
        this.simulateAnalogInput(0, 0);
    }
    
    simulateAnalogInput(x, y) {
        // This would need to interface with RetroArch's input system
        // For now, we'll simulate digital input based on analog position
        const threshold = 0.3;
        
        // Release all directional keys first
        if (!this.pressedButtons.has('dpad-left') && x < -threshold) {
            this.simulateKeyPress('ArrowLeft', true);
        } else if (x >= -threshold) {
            this.simulateKeyPress('ArrowLeft', false);
        }
        
        if (!this.pressedButtons.has('dpad-right') && x > threshold) {
            this.simulateKeyPress('ArrowRight', true);
        } else if (x <= threshold) {
            this.simulateKeyPress('ArrowRight', false);
        }
        
        if (!this.pressedButtons.has('dpad-up') && y < -threshold) {
            this.simulateKeyPress('ArrowUp', true);
        } else if (y >= -threshold) {
            this.simulateKeyPress('ArrowUp', false);
        }
        
        if (!this.pressedButtons.has('dpad-down') && y > threshold) {
            this.simulateKeyPress('ArrowDown', true);
        } else if (y <= threshold) {
            this.simulateKeyPress('ArrowDown', false);
        }
    }
    
    addHapticFeedback(x, y) {
        // Visual haptic feedback
        const feedback = document.createElement('div');
        feedback.className = 'haptic-feedback';
        feedback.style.left = x + 'px';
        feedback.style.top = y + 'px';
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 200);
        
        // Vibration feedback (if supported)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    toggleMenu() {
        const menuHider = document.getElementById('menuhider');
        if (menuHider) {
            menuHider.checked = !menuHider.checked;
        }
    }
    
    toggleControls() {
        const controls = document.getElementById('mobile-controls');
        if (controls) {
            this.isActive = !this.isActive;
            controls.classList.toggle('active', this.isActive);
        }
    }
    
    showMobileControls() {
        const controls = document.getElementById('mobile-controls');
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const controlsToggle = document.getElementById('controls-toggle');
        
        if (controls) {
            this.isActive = true;
            controls.classList.add('active');
        }
        
        if (menuToggle) {
            menuToggle.style.display = 'flex';
        }
        
        if (controlsToggle) {
            controlsToggle.style.display = 'flex';
        }
    }
    
    hideMobileControls() {
        const controls = document.getElementById('mobile-controls');
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const controlsToggle = document.getElementById('controls-toggle');
        
        if (controls) {
            this.isActive = false;
            controls.classList.remove('active');
        }
        
        if (menuToggle) {
            menuToggle.style.display = 'none';
        }
        
        if (controlsToggle) {
            controlsToggle.style.display = 'none';
        }
    }
    
    optimizeForMobile() {
        // Prevent zoom on double tap
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        });
        
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Prevent scrolling
        document.body.addEventListener('touchstart', (e) => {
            if (e.target.closest('.mobile-controls') || e.target.closest('#canvas')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.body.addEventListener('touchmove', (e) => {
            if (e.target.closest('.mobile-controls') || e.target.closest('#canvas')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Lock orientation to landscape for better gaming experience
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {
                console.log('Orientation lock not supported or denied');
            });
        }
    }
    
    handleOrientationChange() {
        setTimeout(() => {
            this.adjustLayoutForOrientation();
        }, 100);
    }
    
    handleResize() {
        this.adjustLayoutForOrientation();
    }
    
    adjustLayoutForOrientation() {
        const controls = document.getElementById('mobile-controls');
        if (!controls) return;
        
        const isLandscape = window.innerWidth > window.innerHeight;
        const isShortScreen = window.innerHeight < 500;
        
        if (isLandscape && isShortScreen) {
            controls.classList.add('fullscreen');
        } else {
            controls.classList.remove('fullscreen');
        }
        
        // Adjust canvas size
        const canvas = document.getElementById('canvas');
        if (canvas && this.isActive) {
            const controlsHeight = controls.offsetHeight;
            canvas.style.height = `calc(100vh - var(--menuheight) - ${controlsHeight}px)`;
        }
    }
}

// Initialize mobile controls when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobileControls = new MobileControls();
    });
} else {
    window.mobileControls = new MobileControls();
}

// Export for external use
window.MobileControls = MobileControls;