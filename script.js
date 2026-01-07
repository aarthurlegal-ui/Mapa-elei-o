// Inicializa o mapa centralizado no Brasil
var map = L.map('map').setView([-14.2, -51.9], 4);

// Mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Função para cores por candidato
function getColor(candidato) {
  switch(candidato) {
    case "Laryssa": return "#ff69b4"; // rosa
    case "Matheus": return "#1e90ff"; // azul
    default: return "#cccccc"; // cinza neutro se não definido
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
  "Mato Grosso": {"Laryssa": {percent:54.38,votos:45062}, "Matheus": {percent:45.62,votos:40819}},
  // Adiciona os outros estados aqui seguindo o mesmo formato
};

// Fetch do GeoJSON oficial do Brasil (somente estados)
fetch("https://raw.githubusercontent.com/giuliano-macedo/geodata-br-states/main/geojson/br_states.json")
  .then(response => response.json())
  .then(data => {

    // Adiciona informações de candidato e votos no GeoJSON
    data.features.forEach(f => {
      const nome = f.properties.name;
      f.properties.candidato = candidatos[nome] || null;
      f.properties.votes = votosPorEstado[nome] || {};
    });

    // Cria camada do GeoJSON com estilo e popup
    const layer = L.geoJSON(data, {
      style: function(feature) {
        return {
          fillColor: getColor(feature.properties.candidato),
          color: '#000', // contorno preto sério
          weight: 2,
          fillOpacity: 0.7
        };
      },
      onEachFeature: function(feature, layer) {
        if(feature.properties.name) {
          let popupContent = `<strong>${feature.properties.name}</strong><br>`;
          const votes = feature.properties.votes;
          for(let c in votes) {
            popupContent += `${c}: ${votes[c].percent}% (~${votes[c].votos.toLocaleString()} votos)<br>`;
          }
          layer.bindPopup(popupContent);
        }
      }
    }).addTo(map);

    // Ajusta zoom para mostrar só o Brasil
    map.fitBounds(layer.getBounds());

  })
  .catch(err => console.error("Erro ao carregar GeoJSON:", err));
