/**
 * ==========================================================================
 * PREMIUM SECURITY FACTS WIDGET
 * Version : 3.0
 * Blogger + GitHub Pages Compatible
 * Author : Suraksha Guide
 * ==========================================================================
 */

class SecurityFactsWidget {

    constructor() {

        this.facts = [];
        this.currentIndex = 0;
        this.isAnimating = false;

        this.JSON_URL =
            "https://digitalmotions-assets.github.io/suraksha-guide/data/security-facts.json";

        this.categoryConfig = {

            "Fire Safety": {
                color: "#dc3545",
                icon: "bi-fire"
            },

            "Emergency": {
                color: "#fd7e14",
                icon: "bi-exclamation-triangle-fill"
            },

            "CCTV": {
                color: "#0d6efd",
                icon: "bi-camera-video-fill"
            },

            "Leadership": {
                color: "#6f42c1",
                icon: "bi-award-fill"
            },

            "Security Guard": {
                color: "#198754",
                icon: "bi-shield-shaded"
            },

            "Society Security": {
                color: "#20c997",
                icon: "bi-buildings-fill"
            },

            "Industrial Security": {
                color: "#6c757d",
                icon: "bi-gear-fill"
            },

            "Motivation": {
                color: "#0A2342",
                icon: "bi-lightning-fill"
            },

            "Default": {
                color: "#0A2342",
                icon: "bi-shield-check"
            }

        };

        this.initDOM();

    }

    initDOM() {

        this.container =
            document.getElementById("securityFactsWidget");

        if (!this.container) {

            console.error("securityFactsWidget not found.");

            return;

        }

        this.container.classList.add("sf-premium-widget");

        this.container.innerHTML = `

<i class="bi sf-watermark"
id="sf-watermark-icon"></i>

<div class="sf-header">

<span id="fact-category"
class="sf-category-badge"></span>

<span id="fact-counter"
class="sf-counter"></span>

</div>

<div id="fact-content-area"
class="sf-content-area">

<p id="fact-english"
class="sf-fact-en"></p>

<p id="fact-hindi"
class="sf-fact-hi"></p>

</div>

<div class="sf-footer">

<button
id="sf-btn-prev"
class="sf-btn">

<i class="bi bi-chevron-left"></i>

Previous

</button>

<button
id="sf-btn-random"
class="sf-btn">

<i class="bi bi-shuffle"></i>

Surprise

</button>

<button
id="sf-btn-next"
class="sf-btn sf-btn-primary">

Next

<i class="bi bi-chevron-right"></i>

</button>

<button
id="sf-btn-copy"
class="sf-btn sf-btn-copy">

<i class="bi bi-clipboard"></i>

Copy

</button>

<button
id="sf-btn-whatsapp"
class="sf-btn sf-btn-whatsapp">

<i class="bi bi-whatsapp"></i>

Share

</button>

</div>

`;

        this.watermark =
            document.getElementById("sf-watermark-icon");

        this.contentArea =
            document.getElementById("fact-content-area");

        this.elCategory =
            document.getElementById("fact-category");

        this.elCounter =
            document.getElementById("fact-counter");

        this.elEnglish =
            document.getElementById("fact-english");

        this.elHindi =
            document.getElementById("fact-hindi");

        this.btnPrev =
            document.getElementById("sf-btn-prev");

        this.btnNext =
            document.getElementById("sf-btn-next");

        this.btnPrev.onclick = () => this.navigate(-1);

        this.btnNext.onclick = () => this.navigate(1);

        document
            .getElementById("sf-btn-random")
            .onclick = () => this.showRandom();

        document
            .getElementById("sf-btn-copy")
            .onclick = () => this.copyFact();

        document
            .getElementById("sf-btn-whatsapp")
            .onclick = () => this.shareWhatsApp();

        this.createToast();

        this.bindKeyboard();

        this.fetchFacts();

    }

    async fetchFacts() {

        try {

            const response =
                await fetch(this.JSON_URL);

            if (!response.ok)
                throw new Error("JSON Load Failed");

            this.facts =
                await response.json();

            const day =
                Math.floor(Date.now() / 86400000);

            this.currentIndex =
                day % this.facts.length;

            this.updateUI(
                this.currentIndex,
                false
            );

        }

        catch (e) {

            console.error(e);

            this.contentArea.innerHTML =
                "<p>Unable to load Security Facts.</p>";

        }

    }
        updateUI(index, animate = true) {

        if (!this.facts.length || this.isAnimating) return;

        const fact = this.facts[index];

        const theme =
            this.categoryConfig[fact.category] ||
            this.categoryConfig.Default;

        const apply = () => {

            this.elCategory.innerHTML =
                `<i class="bi ${theme.icon}"></i> ${fact.category}`;

            this.elEnglish.textContent =
                fact.english;

            this.elHindi.textContent =
                fact.hindi;

            this.elCounter.textContent =
                `${index + 1} / ${this.facts.length}`;

            this.container.style.setProperty(
                "--sf-accent",
                theme.color
            );

            const hex =
                theme.color.replace("#", "");

            const r =
                parseInt(hex.substring(0,2),16);

            const g =
                parseInt(hex.substring(2,4),16);

            const b =
                parseInt(hex.substring(4,6),16);

            this.container.style.setProperty(

                "--sf-accent-bg",

                `rgba(${r},${g},${b},0.12)`

            );

            this.watermark.className =
                `bi ${theme.icon} sf-watermark`;

        };

        if(!animate){

            apply();

            return;

        }

        this.isAnimating = true;

        this.contentArea.classList.add(
            "sf-anim-exit"
        );

        setTimeout(()=>{

            apply();

            this.contentArea.classList.remove(
                "sf-anim-exit"
            );

            this.contentArea.classList.add(
                "sf-anim-enter"
            );

            setTimeout(()=>{

                this.contentArea.classList.remove(
                    "sf-anim-enter"
                );

                this.isAnimating = false;

            },300);

        },250);

    }

    navigate(direction){

        this.currentIndex += direction;

        if(this.currentIndex < 0){

            this.currentIndex =
                this.facts.length - 1;

        }

        if(this.currentIndex >= this.facts.length){

            this.currentIndex = 0;

        }

        this.updateUI(this.currentIndex);

    }

    showRandom(){

        if(this.facts.length <= 1)
            return;

        let random;

        do{

            random =
                Math.floor(
                    Math.random() *
                    this.facts.length
                );

        }while(random === this.currentIndex);

        this.currentIndex = random;

        this.updateUI(this.currentIndex);

    }

    copyFact(){

        const fact =
            this.facts[this.currentIndex];

        const text =

`🛡️ Security Fact

${fact.english}

${fact.hindi}

https://surakshaguide.blogspot.com`;

        navigator.clipboard
            .writeText(text)
            .then(()=>{

                this.showToast(
                    "Fact copied successfully."
                );

            });

    }

    shareWhatsApp(){

        const fact =
            this.facts[this.currentIndex];

        const text =

`🛡️ Security Fact

${fact.english}

${fact.hindi}

https://surakshaguide.blogspot.com`;

        window.open(

            "https://wa.me/?text=" +

            encodeURIComponent(text),

            "_blank"

        );

    }
