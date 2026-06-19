(function () {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobilePanel = document.querySelector("[data-mobile-panel]");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("is-open");
    });
  }

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    let current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        const index = Number(dot.getAttribute("data-hero-dot"));
        show(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  }

  const panels = document.querySelectorAll("[data-filter-panel]");
  panels.forEach(function (panel) {
    const root = panel.parentElement || document;
    const input = panel.querySelector("[data-filter-input]");
    const typeFilter = panel.querySelector("[data-type-filter]");
    const yearFilter = panel.querySelector("[data-year-filter]");
    const cards = Array.from(root.querySelectorAll("[data-filter-card]"));

    function apply() {
      const keyword = input ? input.value.trim().toLowerCase() : "";
      const typeValue = typeFilter ? typeFilter.value : "";
      const yearValue = yearFilter ? Number(yearFilter.value || 0) : 0;

      cards.forEach(function (card) {
        const title = (card.getAttribute("data-title") || "").toLowerCase();
        const keywords = (card.getAttribute("data-keywords") || "").toLowerCase();
        const type = card.getAttribute("data-type") || "";
        const year = Number(card.getAttribute("data-year") || 0);
        const keywordOk = !keyword || title.includes(keyword) || keywords.includes(keyword);
        const typeOk = !typeValue || type.includes(typeValue) || keywords.includes(typeValue.toLowerCase());
        const yearOk = !yearValue || year >= yearValue;
        card.classList.toggle("is-hidden", !(keywordOk && typeOk && yearOk));
      });
    }

    [input, typeFilter, yearFilter].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });
  });

  const searchInput = document.querySelector("[data-search-input]");
  const searchCards = Array.from(document.querySelectorAll("[data-search-results] [data-filter-card]"));
  if (searchInput && searchCards.length) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";
    searchInput.value = query;

    function runSearch() {
      const keyword = searchInput.value.trim().toLowerCase();
      searchCards.forEach(function (card) {
        const text = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-type") || "",
          card.getAttribute("data-year") || "",
          card.getAttribute("data-keywords") || ""
        ].join(" ").toLowerCase();
        card.classList.toggle("is-hidden", Boolean(keyword) && !text.includes(keyword));
      });
    }

    searchInput.addEventListener("input", runSearch);
    runSearch();
  }
}());
