/*
==========================================
Suraksha Guide
Security Facts Widget
Version : 1.0
==========================================
*/

document.addEventListener("DOMContentLoaded", function () {

    const widget = document.getElementById("securityFactsWidget");

    if (!widget) return;

    const jsonURL = "https://digitalmotions-assets.github.io/suraksha-guide/data/security-facts.json";

    fetch(jsonURL)
        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to load security facts.");
            }

            return response.json();

        })
        .then(data => {

            if (!Array.isArray(data) || data.length === 0) {

                widget.innerHTML = `
                    <div class="alert alert-warning">
                        No Security Facts Available.
                    </div>
                `;

                return;

            }

            // Same fact for everyone on the same day

            const today = new Date();

            const dayNumber = Math.floor(today.getTime() / 86400000);

            const fact = data[dayNumber % data.length];

            widget.innerHTML = `

            <div class="sg-fact-card">

                <div class="sg-fact-icon">

                    <i class="bi ${fact.icon}"></i>

                </div>

                <div class="sg-fact-title">

                    ${fact.title}

                </div>

                <div class="sg-fact-category">

                    ${fact.category}

                </div>

                <p class="sg-fact-english">

                    ${fact.english}

                </p>

                <p class="sg-fact-hindi">

                    ${fact.hindi}

                </p>

                <div class="sg-fact-author">

                    — ${fact.author}

                </div>

            </div>

            `;

        })

        .catch(error => {

            console.error(error);

            widget.innerHTML = `

            <div class="alert alert-danger">

                Unable to load Security Facts.

            </div>

            `;

        });

});
