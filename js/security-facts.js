/**
 * ==========================================================================
 * PREMIUM SECURITY FACTS WIDGET - Self-Rendering JavaScript Architecture
 * Author: Senior Frontend Engineer
 * Features: Modular, Accessible, Auto-mounting, No-jQuery
 * ==========================================================================
 */

class SecurityFactsWidget {
    constructor() {
        // State
        this.facts = [];
        this.currentIndex = 0;
        this.isAnimating = false;

        // Dynamic Category Theming Configuration
        this.categoryConfig = {
            "Fire Safety":         { color: "#dc3545", icon: "bi-fire" },
            "Emergency":           { color: "#fd7e14", icon: "bi-exclamation-triangle-fill" },
            "CCTV":                { color: "#0d6efd", icon: "bi-camera-video-fill" },
            "Leadership":          { color: "#6f42c1", icon: "bi-award-fill" },
            "Security Guard":      { color: "#198754", icon: "bi-shield-shaded" },
            "Society Security":    { color: "#20c997", icon: "bi-buildings-fill" },
            "Industrial Security": { color: "#6c757d", icon: "bi-gear-fill" },
            "Motivation":          { color: "#0A2342", icon: "bi-lightning-fill" },
            "Default":             { color: "#0A2342", icon: "bi-shield-check" }
        };

        // Initialize Application
        this.initDOM();
    }

    /**
     * Build the HTML structure dynamically and mount it to the page
     */
    initDOM() {
        // Find the user-defined mount point
        this.container = document.getElementById('securityFactsWidget');
        
        if (!this.container) {
            console.error('Security Facts Widget Error: Mount point <div id="securityFactsWidget"></div> not found.');
            return;
        }

        // Apply core widget class
        this.container.classList.add('sf-premium-widget');

        // Inject the complete HTML structure
        this.container.innerHTML = `
            <i class="bi sf-watermark" id="sf-watermark-icon" aria-hidden="true"></i>
            
            <div class="sf-header">
                <span id="fact-category" class="sf-category-badge"></span>
                <span id="fact-counter" class="sf-counter"></span>
            </div>
            
            <div id="fact-content-area" class="sf-content-area" aria-live="polite">
                <p id="fact-en" class="sf-fact-en"></p>
                <p id="fact-hi" class="sf-fact-hi"></p>
            </div>
            
            <div class="sf-footer">
                <button id="sf-btn-prev" class="sf-btn" aria-label="Previous Fact">
                    <i class="bi bi-chevron-left"></i> Previous
                </button>
                <button id="sf-btn-random" class="sf-btn" aria-label="Random Fact">
                    <i class="bi bi-shuffle"></i> Surprise Me
                </button>
                <button id="sf-btn-next" class="sf-btn sf-btn-primary" aria-label="Next Fact">
                    Next <i class="bi bi-chevron-right"></i>
                </button>
                <button id="sf-btn-copy" class="sf-btn sf-btn-copy" aria-label="Copy Fact">
                    <i class="bi bi-clipboard"></i> Copy
                </button>
                <button id="sf-btn-whatsapp" class="sf-btn sf-btn-whatsapp" aria-label="Share on WhatsApp">
                    <i class="bi bi-whatsapp"></i> Share
                </button>
            </div>
        `;

        // Cache newly created DOM elements for performance
        this.watermark   = document.getElementById('sf-watermark-icon');
        this.contentArea = document.getElementById('fact-content-area');
        this.elCategory  = document.getElementById('fact-category');
        this.elEn        = document.getElementById('fact-en');
        this.elHi        = document.getElementById('fact-hi');
        this.elCounter   = document.getElementById('fact-counter');
        
        this.btnPrev = document.getElementById('sf-btn-prev');
        this.btnNext = document.getElementById('sf-btn-next');

        // Bind Events
        this.btnPrev.addEventListener('click', () => this.navigate(-1));
        this.btnNext.addEventListener('click', () => this.navigate(1));
        document.getElementById('sf-btn-random').addEventListener('click', () => this.showRandom());
        document.getElementById('sf-btn-copy').addEventListener('click', () => this.copyFact());
        document.getElementById('sf-btn-whatsapp').addEventListener('click', () => this.shareWhatsApp());

        // Setup custom Toast Notification Element
        this.createToastElement();

        // Fetch data after DOM is ready
        this.fetchFacts();
    }

    /**
     * Fetch JSON Data (Optimized)
     */
    async fetchFacts() {
        try {
            // NOTE: Ensure the path to your JSON file is correct based on your Blogger setup
            const response = await fetch('/security-facts.json'); 
            if (!response.ok) throw new Error('Network response was not ok');
            
            this.facts = await response.json();
            
            // Show initial fact
            if (this.facts.length > 0) {
                this.updateUI(0, false); // Initialize without enter animation
            }
        } catch (error) {
            console.error('Failed to load facts:', error);
            this.contentArea.innerHTML = `<p class="sf-fact-en text-danger">Failed to load facts. Please try again later.</p>`;
        }
    }

    /**
     * Core update method with seamless enter/exit animations
     */
    updateUI(index, animate = true) {
        if (!this.facts.length || this.isAnimating) return;
        
        const fact = this.facts[index];
        const theme = this.categoryConfig[fact.category] || this.categoryConfig["Default"];

        const applyUpdates = () => {
            // Update Text Content
            this.elCategory.innerHTML = `<i class="bi ${theme.icon}"></i> ${fact.category}`;
            this.elEn.textContent = fact.en;
            this.elHi.textContent = fact.hi;
            this.elCounter.textContent = `Fact #${index + 1} of ${this.facts.length}`;

            // Update Theme Colors & Watermark
            this.container.style.setProperty('--sf-accent', theme.color);
            
            // Convert Hex to RGBA for background
            const hex = theme.color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            this.container.style.setProperty('--sf-accent-bg', `rgba(${r}, ${g}, ${b}, 0.1)`);
            
            // Update Watermark Icon
            this.watermark.className = `bi ${theme.icon} sf-watermark`;

            // Update Button Disabled States
            this.btnPrev.disabled = (index === 0);
            this.btnNext.disabled = (index === this.facts.length - 1);
        };

        if (animate) {
            this.isAnimating = true;
            this.contentArea.classList.remove('sf-anim-enter');
            this.contentArea.classList.add('sf-anim-exit');
            
            setTimeout(() => {
                applyUpdates();
                this.contentArea.classList.remove('sf-anim-exit');
                this.contentArea.classList.add('sf-anim-enter');
                
                setTimeout(() => {
                    this.isAnimating = false;
                }, 300); // Matches CSS transition duration
            }, 300); // Wait for exit animation
        } else {
            applyUpdates();
        }
    }

    /**
     * Navigation Logic
     */
    navigate(direction) {
        const newIndex = this.currentIndex + direction;
        if (newIndex >= 0 && newIndex < this.facts.length) {
            this.currentIndex = newIndex;
            this.updateUI(this.currentIndex);
        }
    }

    showRandom() {
        if(this.facts.length <= 1) return;
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.facts.length);
        } while (randomIndex === this.currentIndex);
        
        this.currentIndex = randomIndex;
        this.updateUI(this.currentIndex);
    }

    /**
     * Copy functionality replacing native alert() with sleek Toast
     */
    copyFact() {
        const fact = this.facts[this.currentIndex];
        const textToCopy = `🛡️ Security Fact:\n${fact.en}\n\n${fact.hi}\n\nVia Suraksha Guide`;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            this.showToast("Fact copied to clipboard!");
        }).catch(err => {
            console.error('Copy failed', err);
            this.showToast("Failed to copy fact.");
        });
    }

    /**
     * WhatsApp Sharing
     */
    shareWhatsApp() {
        const fact = this.facts[this.currentIndex];
        const textToShare = encodeURIComponent(`🛡️ Security Fact:\n${fact.en}\n\n${fact.hi}\n\nRead more at Suraksha Guide`);
        window.open(`https://api.whatsapp.com/send?text=${textToShare}`, '_blank');
    }

    /**
     * Custom DOM Toast implementation
     */
    createToastElement() {
        this.toastEl = document.createElement('div');
        this.toastEl.className = 'sf-toast';
        this.toastEl.setAttribute('role', 'alert');
        this.toastEl.setAttribute('aria-live', 'assertive');
        document.body.appendChild(this.toastEl);
    }

    showToast(message) {
        this.toastEl.innerHTML = `<i class="bi bi-check-circle-fill text-success"></i> ${message}`;
        this.toastEl.classList.add('show');
        
        if (this.toastTimeout) clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            this.toastEl.classList.remove('show');
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SecurityFactsWidget();
});
