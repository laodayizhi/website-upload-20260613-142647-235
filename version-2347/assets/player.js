(function () {
    function initializePlayer(streamUrl) {
        var shell = document.querySelector("[data-player]");

        if (!shell) {
            return;
        }

        var video = shell.querySelector("video");
        var cover = shell.querySelector(".player-cover");
        var attached = false;
        var hls = null;

        function attach() {
            if (attached || !video || !streamUrl) {
                return;
            }

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                attached = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.ERROR, function (_event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }

                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        hls.destroy();
                    }
                });
                attached = true;
            }
        }

        function start() {
            attach();

            if (cover) {
                cover.classList.add("is-hidden");
            }

            if (video) {
                video.setAttribute("controls", "controls");
                var attempt = video.play();

                if (attempt && typeof attempt.catch === "function") {
                    attempt.catch(function () {});
                }
            }
        }

        if (cover) {
            cover.addEventListener("click", start);
        }

        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });
        }

        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    window.initializePlayer = initializePlayer;
})();
