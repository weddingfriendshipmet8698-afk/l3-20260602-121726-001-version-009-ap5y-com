(function () {
    var body = document.body;
    var menuButton = document.querySelector('[data-menu-toggle]');

    if (menuButton) {
        menuButton.addEventListener('click', function () {
            body.classList.toggle('menu-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.dataset.heroDot || 0));
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    }

    var sortableList = document.querySelector('[data-sortable-list]');
    var toolbar = document.querySelector('[data-list-toolbar]');

    if (sortableList && toolbar) {
        var cards = Array.from(sortableList.children);
        var genreSelect = toolbar.querySelector('[data-filter-genre]');

        function renderCards(sortKey) {
            var selectedGenre = genreSelect ? genreSelect.value : '';
            var nextCards = cards.filter(function (card) {
                if (!selectedGenre) {
                    return true;
                }

                return (card.dataset.genre || '').indexOf(selectedGenre) !== -1;
            });

            nextCards.sort(function (a, b) {
                var left = Number(a.dataset[sortKey] || 0);
                var right = Number(b.dataset[sortKey] || 0);
                return right - left;
            });

            sortableList.innerHTML = '';

            nextCards.forEach(function (card) {
                sortableList.appendChild(card);
            });
        }

        toolbar.querySelectorAll('[data-sort]').forEach(function (button) {
            button.addEventListener('click', function () {
                renderCards(button.dataset.sort || 'year');
            });
        });

        if (genreSelect) {
            genreSelect.addEventListener('change', function () {
                renderCards('year');
            });
        }
    }
})();
