// scripts.js

// Function to load cart items into the checkout page
function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let orderSummaryTable = document.querySelector('#order-summary-table tbody');
    let orderTotal = 0;

    // Clear existing table rows
    orderSummaryTable.innerHTML = '';

    cart.forEach(item => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
        `;
        orderSummaryTable.appendChild(row);
        orderTotal += item.price * item.quantity;
    });

    document.querySelector('#order-total').textContent = `$${orderTotal.toFixed(2)}`;
}

// Call loadCart on page load
document.addEventListener('DOMContentLoaded', loadCart);

// Function to add a product to the cart
function addToCart(productName, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let item = cart.find(product => product.name === productName);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ name: productName, price: price, quantity: 3 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} has been added to your cart.`);
}

// PayPal button integration
paypal.Buttons({
    createOrder: function(data, actions) {
        return fetch('/api/create-order', { // Adjust the API endpoint to your server-side code
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                items: JSON.parse(localStorage.getItem('cart')),
                shipping: {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    zip: document.getElementById('zip').value
                }
            })
        }).then(function(res) {
            return res.json();
        }).then(function(orderData) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: orderData.total_amount
                    }
                }]
            });
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert('Transaction completed by ' + details.payer.name.given_name);
            // Clear cart and redirect to an order confirmation page
            localStorage.removeItem('cart');
            window.location.href = '/order-confirmation.html'; // Redirect to order confirmation page
        });
    },
    onError: function(err) {
        console.error('PayPal error:', err);
        alert('An error occurred during the payment process. Please try again.');
    }
}).render('#paypal-button-container');

// scripts.js

// Function to add a product to the cart
function addToCart(productName, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let item = cart.find(product => product.name === productName);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ name: productName, price: price, quantity: 2 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} has been added to your cart.`);
}

// PayPal button integration (included in payment.html)
paypal.Buttons({
    createOrder: function(data, actions) {
        return fetch('/api/create-order', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                // Add details about the transaction
                items: JSON.parse(localStorage.getItem('cart'))
            })
        }).then(function(res) {
            return res.json();
        }).then(function(orderData) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: orderData.total_amount
                    }
                }]
            });
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert('Transaction completed by ' + details.payer.name.given_name);
            // Clear cart after successful payment
            localStorage.removeItem('cart');
        });
    },
    onError: function(err) {
        console.error('PayPal error:', err);
        alert('An error occurred during the payment process. Please try again.');
    }
}).render('#paypal-button-container');
