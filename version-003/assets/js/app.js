(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var heroSlides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var heroDots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var heroIndex = 0;

    function showHero(index) {
      if (!heroSlides.length) {
        return;
      }
      heroIndex = (index + heroSlides.length) % heroSlides.length;
      heroSlides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === heroIndex);
      });
      heroDots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === heroIndex);
      });
    }

    heroDots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showHero(i);
      });
    });

    if (heroSlides.length) {
      showHero(0);
      window.setInterval(function () {
        showHero(heroIndex + 1);
      }, 5200);
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll("[data-local-search]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search]"));
    var emptyState = document.querySelector("[data-empty-state]");

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function applyFilter(value) {
      var query = normalize(value);
      var visible = 0;
      cards.forEach(function (card) {
        var target = normalize(card.getAttribute("data-search"));
        var matched = !query || target.indexOf(query) !== -1;
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });
      if (emptyState) {
        emptyState.style.display = visible ? "none" : "block";
      }
    }

    searchInputs.forEach(function (input) {
      input.addEventListener("input", function () {
        applyFilter(input.value);
      });
    });

    var urlQuery = new URLSearchParams(window.location.search).get("q");
    if (urlQuery && searchInputs.length) {
      searchInputs.forEach(function (input) {
        input.value = urlQuery;
      });
      applyFilter(urlQuery);
    }

    var playerConfig = document.getElementById("player-config");
    var video = document.querySelector("[data-video-player]");
    var cover = document.querySelector("[data-player-cover]");
    var startButton = document.querySelector("[data-player-start]");
    var hlsInstance = null;
    var attached = false;

    function readPlayerSource() {
      if (!playerConfig) {
        return "";
      }
      try {
        var config = JSON.parse(playerConfig.textContent || "{}");
        return config.src || "";
      } catch (error) {
        return "";
      }
    }

    function attachVideo() {
      if (!video || attached) {
        return;
      }
      var src = readPlayerSource();
      if (!src) {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        attached = true;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
        attached = true;
        return;
      }
      video.src = src;
      attached = true;
    }

    function playVideo() {
      if (!video) {
        return;
      }
      attachVideo();
      if (cover) {
        cover.classList.add("hidden");
      }
      var playAction = video.play();
      if (playAction && typeof playAction.catch === "function") {
        playAction.catch(function () {});
      }
    }

    if (startButton) {
      startButton.addEventListener("click", playVideo);
    }

    if (cover) {
      cover.addEventListener("click", playVideo);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          playVideo();
        }
      });
    }
  });
})();
