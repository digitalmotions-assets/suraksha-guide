/*
==========================================
Suraksha Guide
Security Facts Widget
Version : 2.0
==========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    const widget = document.getElementById("securityFactsWidget");

    if (!widget) return;

    const jsonURL = "https://digitalmotions-assets.github.io/suraksha-guide/data/security-facts.json";

    let facts = [];
    let currentIndex = 0;

    fetch(jsonURL)
        .then(res => res.json())
        .then(data => {

            facts = data;

            // Today's Fact
            const dayNumber = Math.floor(Date.now() / 86400000);

            currentIndex = dayNumber % facts.length;

            renderFact();

        })
        .catch(() => {

            widget.innerHTML = `
            <div class="alert alert-danger">
            Unable to load Security Facts.
            </div>
            `;

        });

    function renderFact() {

        const fact = facts[currentIndex];

        widget.innerHTML = `

<div class="sg-fact-card"

style="--factColor:${fact.color};">

<div class="sg-fact-icon">
<i class="bi ${fact.icon}"></i>
</div>

<div class="sg-fact-title">
${fact.title}
</div>

<span class="sg-fact-category">
${fact.category}
</span>

<p class="sg-fact-english">
${fact.english}
</p>

<p class="sg-fact-hindi">
${fact.hindi}
</p>

<div class="sg-fact-author">
— ${fact.author}
</div>

<div class="sg-fact-counter">
Fact ${currentIndex+1} / ${facts.length}
</div>

<div class="sg-buttons">

<button class="btn btn-primary btn-sm" id="prevFact">
<i class="bi bi-arrow-left"></i>
Previous
</button>

<button class="btn btn-warning btn-sm" id="randomFact">
🎲 Surprise Me
</button>

<button class="btn btn-primary btn-sm" id="nextFact">
Next
<i class="bi bi-arrow-right"></i>
</button>

</div>

<div class="sg-buttons mt-2">

<button class="btn btn-success btn-sm" id="copyFact">
<i class="bi bi-clipboard"></i>
Copy
</button>

<button class="btn btn-success btn-sm" id="shareFact">
<i class="bi bi-whatsapp"></i>
WhatsApp
</button>

</div>

</div>

`;

        bindButtons();

    }

    function bindButtons(){

        document.getElementById("prevFact").onclick=()=>{

            currentIndex--;

            if(currentIndex<0)
                currentIndex=facts.length-1;

            renderFact();

        };

        document.getElementById("nextFact").onclick=()=>{

            currentIndex++;

            if(currentIndex>=facts.length)
                currentIndex=0;

            renderFact();

        };

        document.getElementById("randomFact").onclick=()=>{

            currentIndex=Math.floor(Math.random()*facts.length);

            renderFact();

        };

        document.getElementById("copyFact").onclick=()=>{

            const fact=facts[currentIndex];

            navigator.clipboard.writeText(

fact.english+

"\n\n"+

fact.hindi+

"\n\nSuraksha Guide"

            );

            alert("Fact copied.");

        };

        document.getElementById("shareFact").onclick=()=>{

            const fact=facts[currentIndex];

            const text=

"🛡 Security Fact\n\n"+

fact.english+

"\n\n"+

fact.hindi+

"\n\nhttps://surakshaguide.blogspot.com";

            window.open(

"https://wa.me/?text="+encodeURIComponent(text),

"_blank"

            );

        };

    }

    // Keyboard

    document.addEventListener("keydown",(e)=>{

        if(!facts.length) return;

        if(e.key==="ArrowRight"){

            currentIndex++;

            if(currentIndex>=facts.length)
                currentIndex=0;

            renderFact();

        }

        if(e.key==="ArrowLeft"){

            currentIndex--;

            if(currentIndex<0)
                currentIndex=facts.length-1;

            renderFact();

        }

    });

});
