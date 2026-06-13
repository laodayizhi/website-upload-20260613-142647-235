(function () {
  window.setupMoviePlayer = function (streamUrl) {
    var video = document.querySelector("[data-player-video]");
    var cover = document.querySelector("[data-player-cover]");
    var button = document.querySelector("[data-player-button]");
    var loaded = false;
    var hls = null;

    if (!video || !streamUrl) {
      return;
    }

    function loadSource() {
      if (loaded) {
        return;
      }

      loaded = true;
      video.controls = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        video.load();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        return;
      }

      video.src = streamUrl;
      video.load();
    }

    function hideCover() {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    }

    function startPlayback(event) {
      if (event) {
        event.preventDefault();
      }

      loadSource();
      hideCover();

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", startPlayback);
    }

    if (button) {
      button.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
