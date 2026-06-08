const api = '/api';
const session = { token: localStorage.getItem('fastfoodToken') };

function headers() {
  return session.token ? { Authorization: `Bearer ${session.token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

function formToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function renderCards(targetId, items, renderItem) {
  const target = document.getElementById(targetId);
  target.innerHTML = items.length ? items.map(renderItem).join('') : '<p class="output">Nessun risultato trovato.</p>';
}

async function request(path, options = {}) {
  const response = await fetch(`${api}${path}`, { ...options, headers: { ...headers(), ...(options.headers || {}) } });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Richiesta non riuscita');
  }
  if (response.status === 204) return null;
  return response.json();
}

async function submitAuth(form, path) {
  const data = formToObject(form);
  const result = await request(path, { method: 'POST', body: JSON.stringify(data) });
  session.token = result.token;
  localStorage.setItem('fastfoodToken', result.token);
  document.getElementById('session-output').textContent = `Sessione attiva: ${result.user.username} (${result.user.role})`;
}

document.getElementById('register-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  await submitAuth(event.currentTarget, '/auth/register');
});

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  await submitAuth(event.currentTarget, '/auth/login');
});

document.getElementById('restaurant-search').addEventListener('submit', async (event) => {
  event.preventDefault();
  const params = new URLSearchParams(formToObject(event.currentTarget));
  const restaurants = await request(`/restaurants?${params}`);
  renderCards('restaurant-results', restaurants, (restaurant) => `
    <article class="card">
      <h3>${restaurant.name}</h3>
      <p>${restaurant.address}, ${restaurant.city}</p>
      <small>ID: ${restaurant._id}</small>
      <p><strong>${restaurant.menu?.length || 0}</strong> piatti in menu</p>
    </article>`);
});

document.getElementById('meal-search').addEventListener('submit', async (event) => {
  event.preventDefault();
  const params = new URLSearchParams(formToObject(event.currentTarget));
  const meals = await request(`/meals?${params}`);
  renderCards('meal-results', meals, (meal) => `
    <article class="card">
      <h3>${meal.name}</h3>
      <p>${meal.type} • €${meal.basePrice.toFixed(2)}</p>
      <p>${meal.ingredients.join(', ')}</p>
      <small>ID: ${meal._id}</small>
    </article>`);
});

document.getElementById('order-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = formToObject(event.currentTarget);
  const order = await request('/orders', {
    method: 'POST',
    body: JSON.stringify({
      restaurantId: data.restaurantId,
      pickupMode: data.pickupMode,
      deliveryAddress: data.deliveryAddress,
      items: [{ mealId: data.mealId, quantity: Number(data.quantity) }]
    })
  });
  document.getElementById('order-results').innerHTML = `<p class="output">Ordine ${order._id} creato: totale €${order.total.toFixed(2)}, attesa ${order.estimatedWaitMinutes} minuti.</p>`;
});

document.getElementById('load-orders').addEventListener('click', async () => {
  const orders = await request('/orders/mine');
  renderCards('order-results', orders, (order) => `
    <article class="card">
      <h3>Ordine ${order._id}</h3>
      <p>Stato: <strong>${order.status}</strong></p>
      <p>Totale: €${order.total.toFixed(2)} • ${order.pickupMode}</p>
    </article>`);
});

Promise.all([request('/restaurants'), request('/meals')])
  .then(([restaurants, meals]) => {
    renderCards('restaurant-results', restaurants, (restaurant) => `<article class="card"><h3>${restaurant.name}</h3><p>${restaurant.city}</p><small>ID: ${restaurant._id}</small></article>`);
    renderCards('meal-results', meals, (meal) => `<article class="card"><h3>${meal.name}</h3><p>${meal.type} • €${meal.basePrice.toFixed(2)}</p><small>ID: ${meal._id}</small></article>`);
  })
  .catch((error) => console.warn(error.message));
