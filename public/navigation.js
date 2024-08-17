document.addEventListener('DOMContentLoaded', function () {
    const navigationButton = document.getElementById('navigation-button');
    const navigationBlock = document.getElementById('nav-menu-block');
    const navigation = document.querySelector('.navigation');

    function switchNavigationState() {
        navigation.classList.toggle('show');
        navigationBlock.classList.toggle('show');
        navigationButton.classList.toggle('open');
    }

    navigationButton.addEventListener('click', switchNavigationState);
    navigationBlock.addEventListener('click', switchNavigationState);
});