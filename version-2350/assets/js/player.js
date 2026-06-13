var MoviePlayer = (function () {
  function mount(options) {
    var video = document.getElementById(options.videoId);
    var mask = document.getElementById(options.maskId);
    var source = options.source;
    var hls = null;
    var ready = false;

    if (!video || !mask || !source) {
      return;
    }

    function hideMask() {
      mask.classList.add("is-hidden");
      video.setAttribute("controls", "controls");
    }

    function playVideo() {
      var promise = video.play();

      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    function loadNative() {
      if (!video.getAttribute("src")) {
        video.setAttribute("src", source);
      }

      ready = true;
      playVideo();
    }

    function loadWithHls() {
      if (hls) {
        playVideo();
        return;
      }

      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        ready = true;
        playVideo();
      });
    }

    function start() {
      hideMask();

      if (ready) {
        playVideo();
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        loadNative();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        loadWithHls();
        return;
      }

      loadNative();
    }

    mask.addEventListener("click", start);

    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
  }

  return {
    mount: mount
  };
})();
