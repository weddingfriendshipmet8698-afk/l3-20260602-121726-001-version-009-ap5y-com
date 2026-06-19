(function () {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var input = document.querySelector('[data-search-input]');
    var title = document.querySelector('[data-search-title]');
    var count = document.querySelector('[data-search-count]');
    var results = document.querySelector('[data-search-results]');

    if (input) {
        input.value = query;
    }

    if (!query || !results || !window.SITE_MOVIES) {
        return;
    }

    var normalized = query.toLowerCase();
    var matched = window.SITE_MOVIES.filter(function (movie) {
        return movie.searchText.indexOf(normalized) !== -1;
    }).slice(0, 120);

    if (title) {
        title.textContent = '搜索结果：' + query;
    }

    if (count) {
        count.textContent = '共找到 ' + matched.length + ' 条相关结果。';
    }

    if (!matched.length) {
        results.innerHTML = '<div class="content-card"><h2>未找到相关内容</h2><p>可以更换关键词，或返回分类页继续浏览。</p></div>';
        return;
    }

    results.innerHTML = matched.map(function (movie) {
        var tags = movie.tags.slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');

        return [
            '<article class="movie-card" data-year="' + movie.year + '" data-views="' + movie.views + '" data-score="' + movie.score + '" data-genre="' + escapeHtml(movie.genre) + '">',
            '    <a class="poster-link" href="' + movie.url + '" aria-label="查看 ' + escapeHtml(movie.title) + '">',
            '        <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '        <span class="play-mark">▶</span>',
            '    </a>',
            '    <div class="card-body">',
            '        <div class="card-meta">',
            '            <a href="' + movie.categoryUrl + '">' + escapeHtml(movie.category) + '</a>',
            '            <span>' + movie.year + '</span>',
            '            <span>' + escapeHtml(movie.region) + '</span>',
            '        </div>',
            '        <h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
            '        <p>' + escapeHtml(movie.description) + '</p>',
            '        <div class="tag-row">' + tags + '</div>',
            '        <div class="card-stats">',
            '            <span>' + movie.views.toLocaleString() + ' 次浏览</span>',
            '            <span>推荐 ' + movie.score + '</span>',
            '        </div>',
            '    </div>',
            '</article>'
        ].join('');
    }).join('');

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
})();
