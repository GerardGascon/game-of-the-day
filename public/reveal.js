document.addEventListener('DOMContentLoaded', function () {
    const scrollToTopButton = document.getElementById('sun');
    const overlayPanel = document.getElementById('overlay')
    const currentVersion = document.querySelector('meta[name="website-id"]').content;
    const storedVersion = localStorage.getItem('website-id');

    function revealWebsite() {
        scrollToTopButton.classList.add('hide');

        overlayPanel.style.opacity = '0';
        setTimeout(() => {
            overlayPanel.style.pointerEvents = 'none';
        }, 500);
    }

    scrollToTopButton.addEventListener('click', function () {
        localStorage.setItem('website-id', currentVersion);
        revealWebsite();
    });

    function checkForNewVersion() {

        if (storedVersion === currentVersion) {
            revealWebsite();
        }
    }

    checkForNewVersion();
});