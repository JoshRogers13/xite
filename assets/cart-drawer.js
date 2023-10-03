// ---------------------------------------------------------------------------
// Cart Drawer
// ---------------------------------------------------------------------------
var cartDrawerWrapper = '#shopify-section-cart-drawer',
    closeCartDrawerBtn = document.querySelector('.execute--cart-drawer-close'),
    loadingScreenWrapper = document.querySelector('.store--loading-wrapper');

// Function for opening the cart
function openCartDrawer() {
  document.querySelector('#shopify-section-cart-drawer').classList.add('cart-is-open');
}

// Function for closing the cart
function closeCartDrawer() {
  document.querySelector(cartDrawerWrapper).classList.remove('cart-is-open');
}

// Function for update the cart
async function updateCartDrawer() {

  // Grab the new cart data once it's finished processing the changes
  const currentCartDrawer = await fetch('/?section_id=cart-drawer');

  // Convert the new data to html and update the cart with the new html
  const currentCartDrawerContent = await currentCartDrawer.text();
  const newCartDrawer = document.createElement('div');

  newCartDrawer.innerHTML = currentCartDrawerContent;

  const newCartDrawerContent = newCartDrawer.querySelector('.cart-drawer--inner-wrapper').innerHTML;

  document.querySelector('.cart-drawer--inner-wrapper').innerHTML = newCartDrawerContent;

  loadingScreenWrapper.classList.remove('loading-screen-open');

  addCartEventListeners();
}

// Regenerate cart event listeners for when the cart is recreated. Rebind the listeners to the new elements
function addCartEventListeners() {
  // Close the cart
  closeCartDrawerBtn = document.querySelector('.execute--cart-drawer-close');

  closeCartDrawerBtn.addEventListener('click', () => {
    closeCartDrawer();
  });

  // Close the cart on background click
  document.querySelector('#shopify-section-cart-drawer').addEventListener('click', () => {
    closeCartDrawer();
  });

  //Prevent cart from closing during interaction
  document.querySelector('.store--cart-drawer').addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Update Quantities
  document.querySelectorAll('.cart-drawer--input-wrapper button').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      loadingScreenWrapper.classList.add('loading-screen-open');

      // When the quantity buttons are clicked go up the tree to grab the nearest data key
      // Then grab the current quantity and check if the button pressed is increase or decrease
      var parentItem = button.closest('.cart-drawer--item'),
          parentItemKey = parentItem.getAttribute('data-line-key'),
          currentQuantity = Number(button.parentElement.querySelector('.product--quantity-input').value),
          quantityIncreased = button.classList.contains('product--quantity-increase'),
          newQuantity = quantityIncreased ? currentQuantity + 1 : currentQuantity - 1;          

      // Use the Shopify cart API to update the quantity of the line item by using the line key from above    
      const newItemResult =  await fetch('/cart/update.js', {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updates: {
              [parentItemKey]: newQuantity
          }
        }) 
      });

      var newItem = await newItemResult.json();

      // Following a successful add update the cart
      updateCartDrawer();
    });
  });
}

addCartEventListeners();

// Add the loading screen when an item is added to cart
document.querySelectorAll('button[data-action=add-to-cart]').forEach((button) => {
  button.addEventListener('click', () => {
    loadingScreenWrapper.classList.add('loading-screen-open');
  });
});

// Function for changing the carts default behvaiour when submitted
document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    //Submit form with AJAX
    await fetch('/cart/add', {
      method: "post",
      body: new FormData(form)
    });

    loadingScreenWrapper.classList.remove('loading-screen-open');

    // On success update the cart
    await updateCartDrawer();

    openCartDrawer();

    // Scroll the cart items into view when an item is added
    if(document.querySelector(cartDrawerWrapper).classList.contains('cart-is-open')) {
      document.querySelector('#cart-drawer--anchor').scrollIntoView({
        behavior: "smooth"
      });
    }
  }) 
});