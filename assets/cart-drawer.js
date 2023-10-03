// ---------------------------------------------------------------------------
// Cart Drawer
// ---------------------------------------------------------------------------
var cartDrawerWrapper = '#shopify-section-cart-drawer',
    closeCartDrawerBtn = document.querySelector('.execute--cart-drawer-close'),
    loadingScreenWrapper = document.querySelector('.store--loading-wrapper');

function openCartDrawer() {
  document.querySelector('#shopify-section-cart-drawer').classList.add('cart-is-open');
}

function closeCartDrawer() {
  document.querySelector(cartDrawerWrapper).classList.remove('cart-is-open');
}

async function updateCartDrawer() {
  const currentCartDrawer = await fetch('/?section_id=cart-drawer');
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

      var parentItem = button.closest('.cart-drawer--item'),
          parentItemKey = parentItem.getAttribute('data-line-key'),
          currentQuantity = Number(button.parentElement.querySelector('.product--quantity-input').value),
          quantityIncreased = button.classList.contains('product--quantity-increase'),
          newQuantity = quantityIncreased ? currentQuantity + 1 : currentQuantity - 1;          

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

      updateCartDrawer();
    });
  });
}

addCartEventListeners();

document.querySelectorAll('button[data-action=add-to-cart]').forEach((button) => {
  button.addEventListener('click', () => {
    loadingScreenWrapper.classList.add('loading-screen-open');
  });
});

document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    //Submit form with AJAX
    await fetch('/cart/add', {
      method: "post",
      body: new FormData(form)
    });

    loadingScreenWrapper.classList.remove('loading-screen-open');

    await updateCartDrawer();

    openCartDrawer();

    if(document.querySelector(cartDrawerWrapper).classList.contains('cart-is-open')) {
      document.querySelector('#cart-drawer--anchor').scrollIntoView({
        behavior: "smooth"
      });
    }
  }) 
});