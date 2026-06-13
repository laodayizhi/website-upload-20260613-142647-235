document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector("[data-nav-toggle]");
  var links = document.querySelector("[data-nav-links]");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
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

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5600);
  }

  function yearMatches(cardYear, selectedYear) {
    var year = Number(cardYear || 0);

    if (!selectedYear) {
      return true;
    }

    if (selectedYear === "old") {
      return year < 2000;
    }

    if (selectedYear === "2010") {
      return year >= 2010 && year <= 2019;
    }

    if (selectedYear === "2000") {
      return year >= 2000 && year <= 2009;
    }

    return String(year) === selectedYear;
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]")).forEach(function (scope) {
    var root = scope.parentElement || document;
    var search = scope.querySelector(".movie-search");
    var type = scope.querySelector(".movie-filter-type");
    var year = scope.querySelector(".movie-filter-year");
    var cards = Array.prototype.slice.call(root.querySelectorAll(".movie-card"));

    function applyFilters() {
      var query = search ? search.value.trim().toLowerCase() : "";
      var selectedType = type ? type.value : "";
      var selectedYear = year ? year.value : "";

      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || "").toLowerCase();
        var cardType = card.getAttribute("data-type") || "";
        var cardYear = card.getAttribute("data-year") || "";
        var visible = true;

        if (query && text.indexOf(query) === -1) {
          visible = false;
        }

        if (selectedType && cardType !== selectedType) {
          visible = false;
        }

        if (!yearMatches(cardYear, selectedYear)) {
          visible = false;
        }

        card.classList.toggle("is-hidden", !visible);
      });
    }

    if (search) {
      search.addEventListener("input", applyFilters);
    }

    if (type) {
      type.addEventListener("change", applyFilters);
    }

    if (year) {
      year.addEventListener("change", applyFilters);
    }
  });
});
