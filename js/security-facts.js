/**
 * ==========================================================================
 * PREMIUM SECURITY FACTS WIDGET - JavaScript Architecture
 * Author: Senior Frontend Engineer
 * Features: Modular, Accessible, Performance-Optimized, No-jQuery
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
        this.fetchFacts();
    }

    /**
     * Cache DOM elements and prepare widget layout
     */
    initDOM() {
        // Main Container setup
        this.container = document.getElementById('security-fact-widget');
        if (this.container) {
            this.container.classList.add('sf-premium-widget');
            
            // Inject Watermark Element
            this.watermark = document.createElement('i');
            this.watermark.className = 'bi sf-watermark';
            this.container.appendChild(this.watermark);
        }

        // Content Elements
        this.contentArea = document.getElementById('fact-content-area') || document.querySelector('.fact-body');
        this.elCategory  = document.getElementById('fact-category');
        this.elEn        = document.getElementById('fact-en');
        this.elHi        = document.getElementById('fact-hi');
        this.elCounter   = document.getElementById('fact-counter');

        // Apply premium classes to elements
        if(this.contentArea) this.contentArea.classList.add('sf-content-area');
        if(this.elCategory) this.elCategory.classList.add('sf-category-badge');
        if(this.elEn) this.elEn.classList.add('sf-fact-en');
        if(this.elHi) this.elHi.classList.add('sf-fact-hi');
        if(this.elCounter) this.elCounter.classList.add('sf-counter');

        // Bind Buttons
        this.bindButton('btn-prev', () => this.navigate(-1), 'sf-btn', '<i class="bi bi-chevron-left"></i> Previous');
        this.bindButton('btn-next', () => this.navigate(1), 'sf-btn sf-btn-primary', 'Next <i class="bi bi-chevron-right"></i>');
        this.bindButton('btn-random', () => this.showRandom(), 'sf-btn', '<i class="bi bi-shuffle"></i> Surprise Me');
        this.bindButton('btn-copy', () => this.copyFact(), 'sf-btn sf-btn-copy', '<i class="bi bi-clipboard"></i> Copy');
        this.bindButton('btn-whatsapp', () => this.shareWhatsApp(), 'sf-btn sf-btn-whatsapp', '<i class="bi bi-whatsapp"></i> Share');

        // Create Toast Notification Element
        this.createToastElement();
    }

    bindButton(id, callback, classes, innerHTML) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.className = classes;
            btn.innerHTML = innerHTML;
            btn.addEventListener('click', callback);
            // Accessibility
            btn.setAttribute('aria-label', btn.innerText.trim());
        }
    }

    /**
     * Fetch JSON Data (Optimized)
     */
    async fetchFacts() {
        try {
            const response = await fetch('/security-facts.json'); // Adjust path if needed
            if (!response.ok) throw new Error('Network response was not ok');
            this.facts = await response.json();
            
            // Show initial fact
            if (this.facts.length > 0) {
                this.updateUI(0, false); // No animation on initial load
            }
        } catch (error) {
            console.error('Failed to load facts, using fallback data:', error);
            // Optional: Provide a fallback array here if network fails
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
            if (this.elCategory) this.elCategory.innerHTML = `<i class="bi ${theme.icon}"></i> ${fact.category}`;
            if (this.elEn) this.elEn.textContent = fact.en;
            if (this.elHi) this.elHi.textContent = fact.hi;
            if (this.elCounter) this.elCounter.textContent = `Fact #${index + 1} of ${this.facts.length}`;

            // Update Theme Colors & Watermark
            if (this.container) {
                this.container.style.setProperty('--sf-accent', theme.color);
                
                // Convert Hex to RGBA for background
                const hex = theme.color.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                this.container.style.setProperty('--sf-accent-bg', `rgba(${r}, ${g}, ${b}, 0.1)`);
                
                // Update Watermark Icon
                this.watermark.className = `bi ${theme.icon} sf-watermark`;
            }

            // Update Button States
            const btnPrev = document.getElementById('btn-prev');
            const btnNext = document.getElementById('btn-next');
            if(btnPrev) btnPrev.disabled = (index === 0);
            if(btnNext) btnNext.disabled = (index === this.facts.length - 1);
        };

        if (animate && this.contentArea) {
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
     * Custom DOM Toast implementation (No external frameworks needed)
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
