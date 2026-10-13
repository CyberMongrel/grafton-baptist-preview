for (const button of document.querySelectorAll('[data-spotify-src]')) {
  button.addEventListener('click', () => {
    const slot = button.closest('[data-spotify-player]').querySelector('[data-player-slot]');
    const frame = document.createElement('iframe');
    frame.src = button.dataset.spotifySrc;
    frame.title = 'Grafton Baptist Church sermons on Spotify';
    frame.allow = 'encrypted-media; fullscreen; picture-in-picture';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.className = 'spotify-frame';
    slot.replaceChildren(frame);
    button.hidden = true;
    frame.focus();
  }, { once: true });
}

for (const button of document.querySelectorAll('[data-audio-src]')) {
  button.addEventListener('click', async () => {
    const card = button.closest('.sermon-card');
    const container = card.querySelector('.sermon-audio');
    const audio = container.querySelector('audio');
    const status = container.querySelector('.audio-status');
    for (const other of document.querySelectorAll('.sermon-audio audio')) {
      if (other !== audio) other.pause();
    }
    container.hidden = false;
    if (!audio.hasAttribute('src')) {
      audio.src = button.dataset.audioSrc;
      audio.addEventListener('error', () => {
        status.textContent = 'This audio could not be loaded. Try the audio-file link or listen on Spotify, if available.';
      });
      audio.addEventListener('playing', () => { status.textContent = ''; });
    }
    audio.focus();
    try {
      await audio.play();
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        status.textContent = 'Your browser needs another action to begin playback. Use the audio controls below.';
      } else if (error.name === 'NotSupportedError') {
        status.textContent = 'This recording could not be played here. Try the audio-file link or listen on Spotify, if available.';
      } else if (error.name !== 'AbortError') {
        status.textContent = 'Playback failed. Try the audio-file link or listen on Spotify, if available.';
        console.error('Sermon playback failed:', error);
      }
    }
  });
}
