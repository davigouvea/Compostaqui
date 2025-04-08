const ORS_API_KEY = '5b3ce3597851110001cf6248adaecce8ef6b4024b8383d87c25c31b4'; // Troque pela sua chave!
const map = L.map('map').setView([-25.4294, -49.2719], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const pracaOsorio = [-25.4284, -49.2707];
let userMarker = L.marker(pracaOsorio, {
  icon: L.divIcon({ className: 'user-location', html: '', iconSize: [20, 20] })
}).addTo(map);

let routeLayer = null;

const biodigestores = [
  { id: 1, nome: "Biodigestor Batel", lat: -25.4391, lng: -49.2872, capacidade: "400m³", status: "Ativo", endereco: "Rua Teixeira Coelho, Batel" },
  { id: 2, nome: "Biodigestor Água Verde", lat: -25.4525, lng: -49.2764, capacidade: "350m³", status: "Ativo", endereco: "Av. República Argentina, Água Verde" },
  { id: 3, nome: "Biodigestor Alto da Glória", lat: -25.4195, lng: -49.2630, capacidade: "300m³", status: "Manutenção", endereco: "Rua Mauá, Alto da Glória" }
];

let biodigestorSelecionado = null;

biodigestores.forEach(bio => {
  const marker = L.marker([bio.lat, bio.lng], {
    icon: L.divIcon({ className: 'biodigestor-marker', html: '', iconSize: [16, 16] })
  }).addTo(map);

  marker.on('click', () => {
    biodigestorSelecionado = bio;
    const card = document.getElementById('biodigestor-card');
    card.querySelector('h3').textContent = bio.nome;
    card.querySelector('p').textContent = `Capacidade: ${bio.capacidade}`;
    const statusSpan = card.querySelector('span');
    statusSpan.textContent = bio.status;
    statusSpan.className = `bg-${bio.status === 'Ativo' ? 'eco-light' : 'yellow-500'} text-white px-2 py-1 rounded-full text-xs`;
    card.querySelector('span:nth-child(2)').textContent = `${bio.endereco} - Curitiba/PR`;
    card.classList.remove('hidden');
  });
});

document.getElementById('locate-btn').addEventListener('click', () => {
  map.setView(pracaOsorio, 15);
});

document.getElementById('rota-btn').addEventListener('click', () => {
  if (!biodigestorSelecionado) return;

  const coords = {
    start: [pracaOsorio[1], pracaOsorio[0]],
    end: [biodigestorSelecionado.lng, biodigestorSelecionado.lat]
  };

  fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coordinates: [coords.start, coords.end] })
  })
    .then(res => res.json())
    .then(data => {
      const route = L.geoJSON(data.routes[0].geometry, {
        style: { color: '#1e90ff', weight: 4 }
      });
      if (routeLayer) map.removeLayer(routeLayer);
      route.addTo(map);
      routeLayer = route;
      map.fitBounds(route.getBounds());
    })
    .catch(err => {
      alert("Erro ao buscar rota.");
      console.error(err);
    });
});

document.addEventListener('click', function (event) {
  const card = document.getElementById('biodigestor-card');
  if (card && !card.contains(event.target) && !event.target.classList.contains('biodigestor-marker')) {
    card.classList.add('hidden');
  }
});

// Busca
document.getElementById('search-input').addEventListener('input', function () {
  const value = this.value.toLowerCase();
  const match = biodigestores.find(b => b.nome.toLowerCase().includes(value) || b.endereco.toLowerCase().includes(value));
  if (match) {
    map.setView([match.lat, match.lng], 15);
  }
});

// Dark Mode
const toggleDarkMode = document.getElementById('toggle-dark');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');

settingsBtn.addEventListener('click', () => {
  settingsModal.classList.remove('hidden');
});
closeSettings.addEventListener('click', () => {
  settingsModal.classList.add('hidden');
});

toggleDarkMode.addEventListener('change', function () {
  document.body.classList.toggle('dark', this.checked);
  localStorage.setItem('darkMode', this.checked);
});

window.addEventListener('load', () => {
  const isDark = localStorage.getItem('darkMode') === 'true';
  document.body.classList.toggle('dark', isDark);
  toggleDarkMode.checked = isDark;
});
