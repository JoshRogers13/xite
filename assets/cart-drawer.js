// ---------------------------------------------------------------------------
// Cart Drawer
// ---------------------------------------------------------------------------
var headerCartDrawerBtn = '#executeOpenCartDrawer',
    cartDrawerWrapper = '#shopify-section-cart-drawer',
    cartDrawerInnerWrapper = '.cart-drawer--inner-wrapper',
    closeCartDrawerBtn = document.querySelector('.execute--cart-drawer-close'),
    loadingScreenWrapper = document.querySelector('.store--loading-wrapper'),
    removeItemBtn = '.product-card--remove-item';

var cartClassesToAdd = {
  cartIsOpen: 'flyout-is-open',
  loadScreenOpen: 'loading-screen-open'
}

// Function for opening the cart
function openCartDrawer() {
  document.querySelector(cartDrawerWrapper).classList.add(cartClassesToAdd.cartIsOpen);
}

// Function for closing the cart
function closeCartDrawer() {
  document.querySelector(cartDrawerWrapper).classList.remove(cartClassesToAdd.cartIsOpen);
}

// Function for adding the loading screen
function addLoadingScreen() {
  loadingScreenWrapper.classList.add(cartClassesToAdd.loadScreenOpen);
}

// Function for removing the loading screen
function removeLoadingScreen() {
  loadingScreenWrapper.classList.remove(cartClassesToAdd.loadScreenOpen);
}

document.querySelector(headerCartDrawerBtn).addEventListener('click', () => {
  openCartDrawer();
});

// Add the loading screen when an item is added to cart
document.querySelectorAll('button[data-action=add-to-cart]').forEach((button) => {
  button.addEventListener('click', () => {
    addLoadingScreen();
  });
});

document.querySelectorAll(removeItemBtn).forEach((button) => {
  button.addEventListener('click', () => {
    addLoadingScreen()
  });
});

// Function for update the cart
async function updateCartDrawer() {

  // Grab the new cart data once it's finished processing the changes
  const currentCartDrawer = await fetch('/?section_id=cart-drawer');

  // Convert the new data to html and update the cart with the new html
  const currentCartDrawerContent = await currentCartDrawer.text();
  const newCartDrawer = document.createElement('div');

  newCartDrawer.innerHTML = currentCartDrawerContent;

  const newCartDrawerContent = newCartDrawer.querySelector(cartDrawerInnerWrapper).innerHTML;

  document.querySelector(cartDrawerInnerWrapper).innerHTML = newCartDrawerContent;

  removeLoadingScreen();
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
  document.querySelector(cartDrawerWrapper).addEventListener('click', () => {
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
      addLoadingScreen();

      // When the quantity buttons are clicked go up the tree to grab the nearest data key
      // Then grab the current quantity and check if the button pressed is increase or decrease
      var parentItem = button.closest('.cart-drawer--item'),
          parentItemKey = parentItem.getAttribute('data-line-key'),
          currentQuantity = Number(button.parentElement.querySelector('.product--quantity-input').value),
          quantityIncreased = button.classList.contains('product--quantity-increase'),
          newQuantity = quantityIncreased ? currentQuantity + 1 : currentQuantity - 1;          

      // Use the Shopify cart API to update the quantity of the line item by using the line key from above    
      await fetch('/cart/update.js', {
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
      })
      .then(() => {
        updateCartDrawer();
      })
      .catch(error => {
        alert('There has been an error' + error);
      })
    });
  });


  // Remove products from cart drawer without redirecting to cart page
  const removeButtons = document.querySelectorAll(removeItemBtn);

  removeButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      event.preventDefault(); // Prevent the default behavior (i.e., redirect)

      loadingScreenWrapper.classList.add(cartClassesToAdd.loadScreenOpen);

      const lineItemKey = button.getAttribute('data-line');

      // Send an AJAX request to remove the item from the cart
      await fetch('/cart/update.js', {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updates: {
              [lineItemKey]: 0
          }
        })
      })
      .then(() => {
        updateCartDrawer();
      })
      .catch(error => {
        alert('There has been an error' + error);
      })

      removeLoadingScreen();
    });
  });
}

addCartEventListeners();

// Function for changing the carts default behvaiour when submitted
document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    //Submit form with AJAX
    await fetch('/cart/add', {
      method: "post",
      body: new FormData(form)
    })
    .then(async () => {
      // On success update the cart
      await updateCartDrawer();

      openCartDrawer();

      // Scroll the cart items into view when an item is added
      if(document.querySelector(cartDrawerWrapper).classList.contains(cartClassesToAdd.cartIsOpen)) {
        document.querySelector('#cart-drawer--anchor').scrollIntoView({
          behavior: "smooth"
        });
      }
    })
    .catch(error => {
      console.log('There has been an error' + error);
    })

    removeLoadingScreen();
  }) 
});