document.addEventListener('DOMContentLoaded', function () {
    const navigationButton = document.getElementById('navigation-button');
    const navigationBlock = document.getElementById('nav-menu-block');
    const navigation = document.querySelector('.navigation');

    function switchNavigationState() {
        if (navigation.classList.contains('show')) {
            navigation.classList.remove('show');
            navigationBlock.classList.remove('show');
        }else {
            navigation.classList.add('show');
            navigationBlock.classList.add('show');
        }
    }

    navigationButton.addEventListener('click', switchNavigationState);
    navigationBlock.addEventListener('click', switchNavigationState);
});