const ORS_API_KEY = '5b3ce3597851110001cf6248adaecce8ef6b4024b8383d87c25c31b4';
const locateContainer = document.getElementById('locate-container');
const map = L.map('map').setView([-25.4294, -49.2719], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const pracaOsorio = [-25.4284, -49.2707];
let userMarker = L.marker(pracaOsorio, {
  icon: L.divIcon({ className: 'user-location', html: '', iconSize: [20, 20] })
}).addTo(map);

let routeLayer = null;

const biodigestores = [
  {
    id: 1,
    nome: "Biodigestor Batel",
    lat: -25.4391,
    lng: -49.2872,
    capacidade: "8 mil sacos de lixo de 50L",
    status: "Ativo",
    endereco: "Rua Teixeira Coelho, Batel",
    tipo: "Privado",
    horario: null
  },
  {
    id: 2,
    nome: "Biodigestor Água Verde",
    lat: -25.4525,
    lng: -49.2764,
    capacidade: "7 mil sacos de lixo de 50L",
    status: "Ativo",
    endereco: "Av. República Argentina, Água Verde",
    tipo: "Público",
    horario: "08:00 às 17:00"
  },
  {
    id: 3,
    nome: "Biodigestor Alto da Glória",
    lat: -25.4195,
    lng: -49.2630,
    capacidade: "6.000 sacos de lixo de 50L",
    status: "Manutenção",
    endereco: "Rua Mauá, Alto da Glória",
    tipo: "Privado",
    horario: null
  },
  {
    id: 4,
    nome: "Biodigestor Zoológico de Curitiba",
    lat: -25.559541,
    lng: -49.231445,
    capacidade: "	5.000 sacos de lixo de 50L",
    status: "Ativo",
    endereco: "R. João Miqueletto, 1500, Alto Boqueirão",
    tipo: "Público",
    horario: "10:00 às 16:00"
  },
  {
    id: 5,
    nome: "Biodigestor UTFPR Sede Centro",
    lat: -25.439259583108356,
    lng: -49.268807920605546,
    capacidade: "3.000 sacos de lixo de 50L",
    status: "Ativo",
    endereco: "Avenida Sete de Setembro, 3165, Rebouças",
    tipo: "Público",
    horario: "07:00 às 18:00"
  }
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

    document.getElementById('tipo-texto').textContent = `Tipo: ${bio.tipo}`;
    document.getElementById('tipo-info').classList.remove('hidden');

    const horarioInfo = document.getElementById('horario-info');
    const reservaBtn = document.getElementById('reserva-btn-wrapper');

    if (bio.tipo === 'Público') {
      document.getElementById('horario-texto').textContent = `Horário: ${bio.horario}`;
      horarioInfo.classList.remove('hidden');
      reservaBtn.classList.add('hidden');
    } else {
      horarioInfo.classList.add('hidden');
      reservaBtn.classList.remove('hidden');
    }
  });
});

document.getElementById('locate-btn').addEventListener('click', () => {
  map.setView(pracaOsorio, 15);
});

document.addEventListener('click', function (event) {
  const card = document.getElementById('biodigestor-card');
  if (card && !card.contains(event.target) && !event.target.classList.contains('biodigestor-marker')) {
    card.classList.add('hidden');
  }
});

// Reserva de horário
const modal = document.getElementById('reserva-modal');
const abrirReserva = document.getElementById('abrir-reserva');
const fecharReserva = document.getElementById('fechar-reserva');
const formReserva = document.getElementById('form-reserva');
const confirmacao = document.getElementById('reserva-confirmada');

abrirReserva.addEventListener('click', () => {
  modal.classList.remove('hidden');
  formReserva.reset();
  confirmacao.classList.add('hidden');
});

fecharReserva.addEventListener('click', () => {
  modal.classList.add('hidden');
});

formReserva.addEventListener('submit', e => {
  e.preventDefault();
  const data = document.getElementById('data-reserva').value;
  const hora = document.getElementById('hora-reserva').value;

  if (!data || !hora || !biodigestorSelecionado) return;

  const reserva = {
    id: Date.now(),
    biodigestor: biodigestorSelecionado.nome,
    endereco: biodigestorSelecionado.endereco,
    data,
    hora
  };

  const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
  reservas.push(reserva);
  localStorage.setItem('reservas', JSON.stringify(reservas));

  confirmacao.classList.remove('hidden');
});

// Configurações e dark mode
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
const toggleDark = document.getElementById('toggle-dark');

settingsBtn.addEventListener('click', () => {
  settingsModal.classList.remove('hidden');
});
closeSettings.addEventListener('click', () => {
  settingsModal.classList.add('hidden');
});

toggleDark.addEventListener('change', function () {
  document.body.classList.toggle('dark', this.checked);
  localStorage.setItem('darkMode', this.checked);
});

window.addEventListener('load', () => {
  const isDark = localStorage.getItem('darkMode') === 'true';
  document.body.classList.toggle('dark', isDark);
  toggleDark.checked = isDark;
});

// Lista
const listaView = document.getElementById('lista-biodigestores');
const mapaView = document.querySelector('.map-container');
const cardView = document.getElementById('biodigestor-card');
const btnLista = document.getElementById('btn-lista');
const btnMapa = document.getElementById('btn-mapa');
const listaItens = document.getElementById('lista-itens');

btnLista.addEventListener('click', () => {
  mapaView.classList.add('hidden');
  cardView.classList.add('hidden');
  listaView.classList.remove('hidden');
  locateContainer.classList.add('hidden'); // esconde o botão
  btnMapa.classList.remove('text-eco-green');
  btnLista.classList.add('text-eco-green');
  preencherLista();
});

btnMapa.addEventListener('click', () => {
  listaView.classList.add('hidden');
  mapaView.classList.remove('hidden');
  locateContainer.classList.remove('hidden'); // mostra o botão
  btnLista.classList.remove('text-eco-green');
  btnMapa.classList.add('text-eco-green');
});

function preencherLista() {
  listaItens.innerHTML = '';
  biodigestores.forEach(bio => {
    const li = document.createElement('li');
    li.className = 'p-3 rounded bg-gray-100 hover:bg-eco-dark text-gray-800 hover:text-white cursor-pointer transition';
    li.textContent = `${bio.nome} - ${bio.status} - ${bio.endereco}`;
    li.addEventListener('click', () => {
      btnMapa.click();
      map.setView([bio.lat, bio.lng], 16);
      L.popup().setLatLng([bio.lat, bio.lng]).setContent(`<strong>${bio.nome}</strong>`).openOn(map);
    });
    listaItens.appendChild(li);
  });
}
