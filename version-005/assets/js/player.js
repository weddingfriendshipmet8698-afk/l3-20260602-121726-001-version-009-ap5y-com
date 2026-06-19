import { H as Hls } from './hls-vendor-dru42stk.js';

function setStatus(player, message) {
    var status = player.querySelector('[data-player-status]');

    if (status) {
        status.textContent = message;
    }
}

function setupPlayer(player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-player-start]');
    var source = player.dataset.src;
    var poster = player.dataset.poster;
    var hlsInstance = null;
    var initialized = false;

    if (!video || !button || !source) {
        return;
    }

    if (poster) {
        video.setAttribute('poster', poster);
    }

    function initialize() {
        if (initialized) {
            return Promise.resolve();
        }

        initialized = true;
        setStatus(player, '正在初始化播放源，请稍候。');

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            setStatus(player, '已使用浏览器原生 HLS 能力加载播放源。');
            return Promise.resolve();
        }

        if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });

            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
                setStatus(player, '播放源加载完成，可以开始观看。');
            });
            hlsInstance.on(Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    setStatus(player, '播放源加载失败，请检查网络或稍后重试。');
                }
            });

            return Promise.resolve();
        }

        video.src = source;
        setStatus(player, '当前浏览器不支持 HLS.js，已尝试直接加载播放源。');
        return Promise.resolve();
    }

    button.addEventListener('click', function () {
        initialize()
            .then(function () {
                player.classList.add('playing');
                return video.play();
            })
            .then(function () {
                setStatus(player, '正在播放。');
            })
            .catch(function () {
                player.classList.remove('playing');
                setStatus(player, '浏览器阻止了自动播放，请再次点击播放按钮。');
            });
    });

    video.addEventListener('play', function () {
        player.classList.add('playing');
    });

    video.addEventListener('pause', function () {
        if (video.currentTime === 0) {
            player.classList.remove('playing');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}

document.querySelectorAll('[data-player]').forEach(setupPlayer);
