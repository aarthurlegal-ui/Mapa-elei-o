// Inicializa o mapa centralizado no Brasil
var map = L.map('map').setView([-14.2, -51.9], 4);

// Mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Cores por candidato
function getColor(candidato) {
  switch(candidato) {
    case "Laryssa": return "#ff69b4";
    case "Matheus": return "#1e90ff";
    default: return "#cccccc"; // cinza neutro
  }
}

// Estilo dos estados
function style(feature) {
  return {
    fillColor: getColor(feature.properties.candidato),
    weight: 2, // contorno mais visível
    color: '#000', // cor do contorno
    fillOpacity: 0.7
  };
}

// Função do popup detalhado
function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.name) {
    const votes = feature.properties.votes || {};
    let popupContent = `<strong>${feature.properties.name}</strong><br>`;
    for (let candidato in votes) {
      popupContent += `${candidato}: ${votes[candidato].percent}% (~${votes[candidato].votos.toLocaleString()} votos)<br>`;
    }
    layer.bindPopup(popupContent);
  }
}

// Candidatos por estado
const candidatos = {
  "Acre": "Laryssa",
  "Alagoas": "Matheus",
  "Amapá": "Laryssa",
  "Amazonas": "Matheus",
  "Bahia": "Laryssa",
  "Ceará": "Matheus",
  "Distrito Federal": "Laryssa",
  "Espírito Santo": "Matheus",
  "Goiás": "Laryssa",
  "Maranhão": "Matheus",
  "Mato Grosso": "Laryssa",
  "Mato Grosso do Sul": "Matheus",
  "Minas Gerais": "Laryssa",
  "Pará": "Matheus",
  "Paraíba": "Laryssa",
  "Paraná": "Matheus",
  "Pernambuco": "Laryssa",
  "Piauí": "Matheus",
  "Rio de Janeiro": "Laryssa",
  "Rio Grande do Norte": "Matheus",
  "Rio Grande do Sul": "Laryssa",
  "Rondônia": "Matheus",
  "Roraima": "Laryssa",
  "Santa Catarina": "Matheus",
  "São Paulo": "Laryssa",
  "Sergipe": "Matheus",
  "Tocantins": "Laryssa"
};

// Percentual aproximado e votos por estado
const votosPorEstado = {
  "Acre": {"Laryssa": {percent:54.38,votos:45062}, "Matheus": {percent:45.62,votos:40819}},
  "Alagoas": {"Laryssa": {percent:50.12,votos:50000}, "Matheus": {percent:49.88,votos:49750}},
  "Amapá": {"Laryssa": {percent:60.00,votos:30000}, "Matheus": {percent:40.00,votos:20000}},
  "Amazonas": {"Laryssa": {percent:48.50,votos:200000}, "Matheus": {percent:51.50,votos:212500}},
  "Bahia": {"Laryssa": {percent:55.00,votos:1500000}, "Matheus": {percent:45.00,votos:1230000}},
  // Continua para os 27 estados...
  "Mato Grosso": {"Laryssa": {percent:54.38,votos:45062}, "Matheus": {percent:45.62,votos:40819}}
};

// Fetch do GeoJSON oficial só do Brasil
fetch("https://raw.githubusercontent.com/giuliano-macedo/geodata-br-states/main/geojson/br_states.json")
  .then(response => response.json())
  .then(data => {
    data.features.forEach(f => {
      const nome = f.properties.name;
      f.properties.candidato = candidatos[nome] || null;
      f.properties.votes = votosPorEstado[nome] || {};
    });

    const layer = L.geoJSON(data, { style: style, onEachFeature: onEachFeature }).addTo(map);

    // Ajusta zoom para mostrar só o Brasil
    map.fitBounds(layer.getBounds());
  })
  .catch(err => console.error("Erro ao carregar GeoJSON oficial:", err));
