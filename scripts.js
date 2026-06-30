// ============================================================
// scripts.js — GitHub Release Page Interactive Features
// ============================================================

(function() {
    'use strict';

    // ----- DOM refs -----
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadCountEl = document.getElementById('downloadCount');
    const counterContainer = document.getElementById('downloadCounter');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const clockEl = document.getElementById('liveClock');

    // ----- State -----
    let downloadCount = parseInt(localStorage.getItem('githubReleaseDownloads') || '0', 10);
    let toastTimeout = null;

    // ----- Update counter display -----
    function updateCounterDisplay() {
        downloadCountEl.textContent = downloadCount;
        // animate pop
        counterContainer.classList.remove('pop');
        // force reflow
        void counterContainer.offsetWidth;
        counterContainer.classList.add('pop');
    }

    // ----- Save to localStorage -----
    function saveCount() {
        localStorage.setItem('githubReleaseDownloads', String(downloadCount));
    }

    // ----- Show toast notification -----
    function showToast(message, duration) {
        duration = duration || 2500;
        toastMessage.textContent = message || 'Download started!';
        toast.classList.add('show');
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }
        toastTimeout = setTimeout(function() {
            toast.classList.remove('show');
            toastTimeout = null;
        }, duration);
    }

    // ----- Ripple effect on button -----
    function createRipple(e) {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        const x = (e.clientX || e.pageX || 0) - rect.left - size / 2;
        const y = (e.clientY || e.pageY || 0) - rect.top - size / 2;
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        btn.appendChild(ripple);
        setTimeout(function() {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // ----- Handle download click -----
    function handleDownload(e) {
        // Increment counter
        downloadCount += 1;
        updateCounterDisplay();
        saveCount();

        // Show toast
        showToast('⬇️ Download started! (' + downloadCount + ' total)');

        // The link will open in new tab because of target="_blank"
        // We don't prevent default — let the link do its job.
    }

    // ----- Live clock -----
    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = h + ':' + m + ':' + s + ' UTC';
    }

    // ----- Init -----
    function init() {
        // Set initial counter
        updateCounterDisplay();

        // Set initial clock
        updateClock();
        setInterval(updateClock, 1000);

        // Attach event listeners
        if (downloadBtn) {
            // Ripple + download handling on click
            downloadBtn.addEventListener('click', function(e) {
                createRipple(e);
                handleDownload(e);
            });
        }

        // Optional: show a welcome toast
        setTimeout(function() {
            showToast('🔔 Release v1.0.0 available', 2000);
        }, 600);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();