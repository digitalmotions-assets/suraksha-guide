/*
==========================================
Suraksha Guide
Daily Security Motivation
Version: 1.0
Author: Suraksha Guide
==========================================
*/

document.addEventListener("DOMContentLoaded", function () {

    const widget = document.getElementById("dailyMotivationWidget");

    if (!widget) return;

    const jsonURL = "https://digitalmotions-assets.github.io/suraksha-guide/data/motivation.json";

    fetch(jsonURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Unable to load motivation data.");
            }
            return response.json();
        })
        .then(data => {

            if (!Array.isArray(data) || data.length === 0) {
                widget.innerHTML = "<p>No motivation quote available.</p>";
                return;
            }

            // Same quote for everyone on the same day
            const today = new Date();

            const dayNumber = Math.floor(today.getTime() / 86400000);

            const quote = data[dayNumber % data.length];

            widget.innerHTML = `
                <div class="sg-motivation-card">

                    <div class="sg-icon">
                        <i class="bi bi-quote"></i>
                    </div>

                    <h4 class="sg-title">
                        Security Daily Motivation
                    </h4>

                    <p class="sg-quote">
                        "${quote.text}"
                    </p>

                    <div class="sg-author">
                        — ${quote.author}
                    </div>

                    <span class="sg-category">
                        ${quote.category}
                    </span>

                </div>
            `;

        })
        .catch(error => {

            console.error(error);

            widget.innerHTML = `
                <div class="alert alert-warning">
                    Unable to load today's motivation.
                </div>
            `;

        });

});
