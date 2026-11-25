(() => {
  const SKIP_SELECTORS = [
    '.ytp-skip-ad-button',
    '.ytp-ad-skip-button',
    '.ytp-ad-skip-button-modern',
    '.ytp-ad-skip-button-container button',
    'button.ytp-ad-skip-button-modern'
  ];

  let inAd = false;
  let saved = { muted: false, rate: 1 };

  function handleAd() {
    const player = document.querySelector('#movie_player');
    const video = document.querySelector('video.html5-main-video') || document.querySelector('video');
    if (!player || !video) return;

    const adShowing = player.classList.contains('ad-showing');

    if (adShowing) {
      if (!inAd) {
        saved = { muted: video.muted, rate: video.playbackRate || 1 };
        inAd = true;
      }
      video.muted = true;
      video.playbackRate = 16;
      if (isFinite(video.duration) && video.duration > 0) {
        video.currentTime = video.duration;
      }
      for (const sel of SKIP_SELECTORS) {
        const btn = document.querySelector(sel);
        if (btn) btn.click();
      }
    } else if (inAd) {
      video.muted = saved.muted;
      video.playbackRate = saved.rate;
      inAd = false;
    }
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      handleAd();
    });
  }

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });

  setInterval(handleAd, 500);
})();
