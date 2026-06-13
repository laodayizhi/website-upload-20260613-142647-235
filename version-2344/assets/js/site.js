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
    var menu = document.querySelector("[data-nav-menu]");

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        menu.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var current = 0;

      function showSlide(index) {
        if (!slides.length) {
          return;
        }

        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          showSlide(index);
        });
      });

      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    var urlQuery = new URLSearchParams(window.location.search).get("q") || "";
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));

    panels.forEach(function (panel) {
      var input = panel.querySelector("[data-search-input]");
      var selects = Array.prototype.slice.call(panel.querySelectorAll("[data-filter-select]"));
      var list = panel.parentElement ? panel.parentElement.querySelector("[data-card-list]") : null;
      var cards = list ? Array.prototype.slice.call(list.querySelectorAll("[data-card]")) : [];

      if (input && urlQuery) {
        input.value = urlQuery;
      }

      function normalize(value) {
        return String(value || "").trim().toLowerCase();
      }

      function applyFilters() {
        var term = normalize(input ? input.value : "");

        cards.forEach(function (card) {
          var matched = true;
          var searchText = normalize(card.getAttribute("data-search"));

          if (term && searchText.indexOf(term) === -1) {
            matched = false;
          }

          selects.forEach(function (select) {
            var key = select.getAttribute("data-filter-select");
            var selected = normalize(select.value);
            var value = normalize(card.getAttribute("data-" + key));

            if (selected && value !== selected) {
              matched = false;
            }
          });

          card.classList.toggle("is-hidden", !matched);
        });
      }

      if (input) {
        input.addEventListener("input", applyFilters);
      }

      selects.forEach(function (select) {
        select.addEventListener("change", applyFilters);
      });

      applyFilters();
    });
  });
})();
