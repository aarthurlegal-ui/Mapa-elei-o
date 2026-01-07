// Inicializa o mapa
var map = L.map('map').setView([-14.2, -51.9], 4);

// Adiciona o mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Função de cores por candidato
function getColor(candidato) {
  switch(candidato) {
    case "Laryssa": return "#ff69b4";
    case "Matheus": return "#1e90ff";
    default: return "#cccccc";
  }
}

// Estilo de cada estado
function style(feature) {
  return {
    fillColor: getColor(feature.properties.candidato),
    weight: 1,
    color: '#111',
    fillOpacity: 0.7
  };
}

// Popup interativo
function onEachFeature(feature, layer) {
  if(feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name + " - " + feature.properties.candidato);
  }
}

// Busca o GeoJSON oficial direto do GitHub
fetch("https://raw.githubusercontent.com/giuliano-macedo/geodata-br-states/main/geojson/br_states.json")
  .then(response => response.json())
  .then(data => {

    // Define o candidato de cada estado
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

    // Adiciona a propriedade candidato em cada estado
    data.features.forEach(f => {
      f.properties.candidato = candidatos[f.properties.name] || "Laryssa";
    });

    // Adiciona o GeoJSON no mapa
    L.geoJSON(data, { style: style, onEachFeature: onEachFeature }).addTo(map);

  })
  .catch(err => console.error("Erro ao carregar o GeoJSON:", err));
