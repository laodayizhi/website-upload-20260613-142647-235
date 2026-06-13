(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function initNavigation() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                slide.classList.toggle("is-active", position === index);
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle("is-active", position === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                restart();
            });
        }
        dots.forEach(function (dot, position) {
            dot.addEventListener("click", function () {
                show(position);
                restart();
            });
        });
        show(0);
        restart();
    }

    function initFilters() {
        var areas = Array.prototype.slice.call(document.querySelectorAll("[data-filter-area]"));
        areas.forEach(function (area) {
            var container = area.parentElement;
            var grid = container ? container.querySelector("[data-card-grid]") : null;
            if (!grid) {
                grid = document.querySelector("[data-card-grid]");
            }
            if (!grid) {
                return;
            }
            var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-card]"));
            var search = area.querySelector("[data-search-input]");
            var year = area.querySelector("[data-year-filter]");
            var type = area.querySelector("[data-type-filter]");

            function apply() {
                var query = normalize(search && search.value);
                var yearValue = normalize(year && year.value);
                var typeValue = normalize(type && type.value);
                cards.forEach(function (card) {
                    var content = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-tags")
                    ].join(" "));
                    var matchedQuery = !query || content.indexOf(query) !== -1;
                    var matchedYear = !yearValue || normalize(card.getAttribute("data-year")) === yearValue;
                    var matchedType = !typeValue || normalize(card.getAttribute("data-type")) === typeValue;
                    card.hidden = !(matchedQuery && matchedYear && matchedType);
                });
            }

            [search, year, type].forEach(function (node) {
                if (node) {
                    node.addEventListener("input", apply);
                    node.addEventListener("change", apply);
                }
            });
            apply();
        });
    }

    function initPlayer() {
        var shell = document.querySelector("[data-player]");
        if (!shell) {
            return;
        }
        var video = shell.querySelector("video");
        var button = shell.querySelector("[data-play]");
        var proxy = document.querySelector("[data-play-proxy]");
        if (!video) {
            return;
        }
        var stream = video.getAttribute("data-stream");
        var loaded = false;
        var hls = null;

        function attach() {
            if (loaded || !stream) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }
            loaded = true;
        }

        function start() {
            attach();
            shell.classList.add("is-playing");
            video.setAttribute("controls", "controls");
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener("click", start);
        }
        if (proxy) {
            proxy.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hls && typeof hls.destroy === "function") {
                hls.destroy();
            }
        });
    }

    ready(function () {
        initNavigation();
        initHero();
        initFilters();
        initPlayer();
    });
})();
