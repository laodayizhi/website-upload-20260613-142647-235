(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-main-nav]");

        if (toggle && nav) {
            toggle.addEventListener("click", function () {
                nav.classList.toggle("is-open");
            });
        }

        var hero = document.querySelector("[data-hero]");

        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var prev = hero.querySelector("[data-hero-prev]");
            var next = hero.querySelector("[data-hero-next]");
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }

                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === current);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5000);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    show(Number(dot.getAttribute("data-hero-dot")) || 0);
                    start();
                });
            });

            if (prev) {
                prev.addEventListener("click", function () {
                    show(current - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(current + 1);
                    start();
                });
            }

            hero.addEventListener("mouseenter", stop);
            hero.addEventListener("mouseleave", start);
            show(0);
            start();
        }

        var list = document.querySelector("[data-card-list]");
        var filterPanel = document.querySelector("[data-filter-panel]");

        if (list && filterPanel) {
            var cards = Array.prototype.slice.call(list.querySelectorAll("[data-card]"));
            var input = filterPanel.querySelector("[data-filter-input]");
            var genre = filterPanel.querySelector("[data-filter-genre]");
            var region = filterPanel.querySelector("[data-filter-region]");
            var year = filterPanel.querySelector("[data-filter-year]");
            var empty = document.querySelector("[data-empty-state]");
            var params = new URLSearchParams(window.location.search);
            var q = params.get("q");

            if (q && input) {
                input.value = q;
            }

            function cardText(card) {
                return [
                    card.getAttribute("data-title") || "",
                    card.getAttribute("data-genre") || "",
                    card.getAttribute("data-region") || "",
                    card.getAttribute("data-year") || "",
                    card.getAttribute("data-category") || ""
                ].join(" ").toLowerCase();
            }

            function applyFilter() {
                var keyword = input ? input.value.trim().toLowerCase() : "";
                var genreValue = genre ? genre.value : "";
                var regionValue = region ? region.value : "";
                var visible = 0;

                cards.forEach(function (card) {
                    var matchesKeyword = !keyword || cardText(card).indexOf(keyword) !== -1;
                    var matchesGenre = !genreValue || (card.getAttribute("data-genre") || "").indexOf(genreValue) !== -1;
                    var matchesRegion = !regionValue || (card.getAttribute("data-region") || "") === regionValue;
                    var matches = matchesKeyword && matchesGenre && matchesRegion;
                    card.style.display = matches ? "" : "none";

                    if (matches) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.style.display = visible ? "none" : "block";
                }
            }

            function sortCards() {
                var value = year ? year.value : "";
                var sorted = cards.slice();

                if (value === "new") {
                    sorted.sort(function (a, b) {
                        return Number(b.getAttribute("data-year") || 0) - Number(a.getAttribute("data-year") || 0);
                    });
                }

                if (value === "old") {
                    sorted.sort(function (a, b) {
                        return Number(a.getAttribute("data-year") || 0) - Number(b.getAttribute("data-year") || 0);
                    });
                }

                sorted.forEach(function (card) {
                    list.appendChild(card);
                });
            }

            [input, genre, region].forEach(function (element) {
                if (element) {
                    element.addEventListener("input", applyFilter);
                    element.addEventListener("change", applyFilter);
                }
            });

            if (year) {
                year.addEventListener("change", function () {
                    sortCards();
                    applyFilter();
                });
            }

            applyFilter();
        }
    });
})();
