const API_BASE_URL = 'https://pattes-and-co-api.onrender.com';

const products = [
    { id: 'orthopedic-bed', name: 'Orthopedic Bed', price: 52.00 },
    { id: 'royal-collar', name: 'Royal Collar', price: 32.50 },
    { id: 'memory-mat', name: 'Memory Mat', price: 37.50 },
    { id: 'stainless-bowl', name: 'Stainless Bowl', price: 25.00 },
    { id: 'interactive-toy', name: 'Interactive Toy', price: 43.50 },
    { id: 'couch-cover', name: 'Couch Cover', price: 49.00 }
];

const grid = document.getElementById('product-grid');

products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'bg-white p-6 rounded-lg shadow-md';
    div.innerHTML = `
        <h2 class="text-xl font-semibold mb-2">${p.name}</h2>
        <p class="text-gray-600 mb-4">$${p.price.toFixed(2)}</p>
        <button onclick="checkout('${p.id}')" class="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
            Buy Now
        </button>
    `;
    grid.appendChild(div);
});

async function checkout(productId) {
    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            items: [{ id: productId, quantity: 1 }],
            customer_email: 'julesjospinhongongang18@gmail.com'
        })
    });
    const { url } = await response.json();
    window.location.href = url;
}