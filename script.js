  // Paste button functionality
  document.getElementById('pasteBtn').addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('videoUrl').value = text;
    } catch (err) {
        showError('Failed to paste from clipboard. Please paste manually.');
        console.error(err);
    }
});

// Play button functionality
document.getElementById('playBtn').addEventListener('click', () => {
    const url = document.getElementById('videoUrl').value.trim();
    const videoId = extractVideoId(url);
    if (!videoId) {
        showError('Please enter a valid YouTube video URL.');
        return;
    }
    playVideo(videoId);
});

// Extract video ID from URL
function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Play video and handle ad skipping
function playVideo(videoId) {
    const playerDiv = document.getElementById('player-container');
    playerDiv.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                allow="autoplay; encrypted-media" allowfullscreen></iframe>
    `;

    // Skip skippable ads
    const adSkipInterval = setInterval(() => {
        const iframe = playerDiv.querySelector('iframe');
        try {
            const skipButton = iframe.contentWindow.document.querySelector('.ytp-ad-skip-button');
            if (skipButton) {
                skipButton.click();
            }
        } catch (e) {
            console.log('Cannot access iframe content due to cross-origin restrictions.');
        }
    }, 1000);

    // Clear interval when video ends
    const iframe = playerDiv.querySelector('iframe');
    iframe.onload = () => {
        iframe.contentWindow.addEventListener('ended', () => {
            clearInterval(adSkipInterval);
            playerDiv.innerHTML = ''; // Clear player when video ends
        });
    };
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
}