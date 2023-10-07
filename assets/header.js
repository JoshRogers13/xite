var headerMenuWrapper = '.header--menu-wrapper',
    headerMenuContainer = '.header--menu-inner-wrapper',
    headerMenuTrigger = '#executeOpenNavigation',
    headerMenuCloseTrigger = '#executeCloseNavigation',
    headerMenuChildMenuWrapper = '.header--childmenu-items',
    headerMenuChildMenuTrigger = '.header--menu-item-child-menu-trigger',
    headerMenuBackButton = '.header--menu-back-button';

var headerClassesToAdd = {
    menuOpen: 'flyout-is-open'
}

document.querySelector(headerMenuWrapper).classList.add(headerClassesToAdd.menuOpen);

// Function to open menu
function openMenu() {
    document.querySelector(headerMenuWrapper).classList.add(headerClassesToAdd.menuOpen);
}

// Function to close filter
function closeMenu() {
    document.querySelector(headerMenuWrapper).classList.remove(headerClassesToAdd.menuOpen);
    document.querySelector(headerMenuChildMenuWrapper).classList.remove(headerClassesToAdd.menuOpen);
}

document.querySelector(headerMenuTrigger).addEventListener('click', (e) => {
    openMenu();
});

// Close the filters when the overlay is clicked
document.querySelector(headerMenuWrapper).addEventListener('click', () => {
    closeMenu();
});

// Prevent interaction with the filters from closing the filters
document.querySelector(headerMenuContainer).addEventListener('click', (e) => {
    e.stopPropagation();
});

document.querySelector(headerMenuCloseTrigger).addEventListener('click', () => {
    closeMenu();
});

document.querySelectorAll(headerMenuChildMenuTrigger).forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();

        e.target.closest('.header--menu-item').querySelector(headerMenuChildMenuWrapper).classList.add(headerClassesToAdd.menuOpen);
    });
});

document.querySelectorAll(headerMenuBackButton).forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();

        e.target.closest(headerMenuChildMenuWrapper).classList.remove(headerClassesToAdd.menuOpen);
    });
});