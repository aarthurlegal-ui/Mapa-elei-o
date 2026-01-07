// Inicializa o mapa
var map = L.map('map').setView([-14.2, -51.9], 4); // Centro do Brasil

// Adiciona o tile layer (mapa base)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Função para definir a cor de cada candidato
function getColor(candidato) {
  switch(candidato) {
    case "Laryssa": return "#ff69b4"; // Rosa
    case "Matheus": return "#1e90ff"; // Azul
    default: return "#cccccc"; // Cinza neutro
  }
}

// Função para aplicar estilo a cada estado
function style(feature) {
  return {
    fillColor: getColor(feature.properties.candidato),
    weight: 1,
    color: '#111',
    fillOpacity: 0.7
  };
}

// Função para adicionar interatividade
function onEachFeature(feature, layer) {
  if(feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name + " - " + feature.properties.candidato);
  }
}

// Carrega o GeoJSON oficial direto do GitHub
fetch("https://raw.githubusercontent.com/giuliano-macedo/geodata-br-states/main/geojson/br_states.json")
  .then(response => response.json())
  .then(data => {
    // Aqui a gente adiciona uma propriedade 'candidato' pra cada estado
    data.features.forEach(f => {
      // Aqui você define quem ganhou em cada estado
      switch(f.properties.name) {
        case "São Paulo": f.properties.candidato = "Laryssa"; break;
        case "Rio de Janeiro": f.properties.candidato = "Matheus"; break;
        case "Minas Gerais": f.properties.candidato = "Laryssa"; break;
        case "Bahia": f.properties.candidato = "Matheus"; break;
        // Continua pra todos os outros estados
        default: f.properties.candidato = "Laryssa";
      }
    });

    // Adiciona o GeoJSON no mapa
    L.geoJSON(data, { style: style, onEachFeature: onEachFeature }).addTo(map);
  })
  .catch(err => console.error("Erro ao carregar o GeoJSON:", err));
