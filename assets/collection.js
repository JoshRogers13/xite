var collectionFiltersWrapper = '.collection--filter-form-inner-wrapper',
    collectionFiltersContainer = '.collection--filter-form-container',
    collectionFiltersCloseBtn = '.execute--collection-filters-close',
    collectionFilterTrigger = '#executeOpenCollectionFilters',
    collectionIconParent = '.filter-group-summary';

// document.querySelector(collectionFiltersWrapper).classList.add('menu-is-open');

// Function to open filter
function openCollectionFilters() {
    document.querySelector(collectionFiltersWrapper).classList.add('menu-is-open');
}

// Function to close filter
function closeCollectionFilters() {
    document.querySelector(collectionFiltersWrapper).classList.remove('menu-is-open');
}

document.querySelector(collectionFilterTrigger).addEventListener('click', (e) => {
    openCollectionFilters();
});

// Close the filters when the overlay is clicked
document.querySelector(collectionFiltersWrapper).addEventListener('click', () => {
    closeCollectionFilters();
});

// Prevent interaction with the filters from closing the filters
document.querySelector(collectionFiltersContainer).addEventListener('click', (e) => {
    e.stopPropagation();
});

document.querySelector(collectionFiltersCloseBtn).addEventListener('click', () => {
    closeCollectionFilters();
});