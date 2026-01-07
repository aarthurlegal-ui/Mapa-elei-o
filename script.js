      // Inicializa o mapa
var map = L.map('map').setView([-14.2, -51.9], 4);

// TileLayer base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// Dados de votos por estado
const votosPorEstado = {
  "Acre": {"Laryssa":54.49,"Matheus":45.51},
  "Alagoas": {"Laryssa":45.60,"Matheus":54.40},
  "Amapá": {"Laryssa":50.00,"Matheus":50.00},
  "Amazonas": {"Laryssa":48.30,"Matheus":51.70},
  "Bahia": {"Laryssa":55.20,"Matheus":44.80},
  "Ceará": {"Laryssa":49.00,"Matheus":51.00},
  "Distrito Federal": {"Laryssa":52.00,"Matheus":48.00},
  "Espírito Santo": {"Laryssa":47.50,"Matheus":52.50},
  "Goiás": {"Laryssa":53.00,"Matheus":47.00},
  "Maranhão": {"Laryssa":46.00,"Matheus":54.00},
  "Mato Grosso": {"Laryssa":54.49,"Matheus":45.51},
  "Mato Grosso do Sul": {"Laryssa":45.00,"Matheus":55.00},
  "Minas Gerais": {"Laryssa":51.00,"Matheus":49.00},
  "Pará": {"Laryssa":48.00,"Matheus":52.00},
  "Paraíba": {"Laryssa":53.50,"Matheus":46.50},
  "Paraná": {"Laryssa":47.00,"Matheus":53.00},
  "Pernambuco": {"Laryssa":52.00,"Matheus":48.00},
  "Piauí": {"Laryssa":49.50,"Matheus":50.50},
  "Rio de Janeiro": {"Laryssa":51.50,"Matheus":48.50},
  "Rio Grande do Norte": {"Laryssa":46.50,"Matheus":53.50},
  "Rio Grande do Sul": {"Laryssa":52.00,"Matheus":48.00},
  "Rondônia": {"Laryssa":47.00,"Matheus":53.00},
  "Roraima": {"Laryssa":50.00,"Matheus":50.00},
  "Santa Catarina": {"Laryssa":46.50,"Matheus":53.50},
  "São Paulo": {"Laryssa":54.00,"Matheus":46.00},
  "Sergipe": {"Laryssa":48.50,"Matheus":51.50},
  "Tocantins": {"Laryssa":52.50,"Matheus":47.50}
};

// Função para definir cor do estado (vencedor)
function getColor(votes) {
  if(!votes) return "#cccccc"; // cinza neutro
  return votes["Laryssa"] >= votes["Matheus"] ? "#ff69b4" : "#1e90ff";
}

// Carrega GeoJSON do Brasil (somente estados)
fetch("https://raw.githubusercontent.com/giuliano-macedo/geodata-br-states/main/geojson/br_states.json")
  .then(res => res.json())
  .then(data => {

    const layer = L.geoJSON(data, {
      style: function(feature) {
        const votes = votosNormalizados[feature.properties.name];
        return {
          fillColor: getColor(votes),
          color: "#000", // contorno preto
          weight: 2,
          fillOpacity: 0.7
              // Normaliza os nomes dos estados (remove acentos)
const votosNormalizados = {};

for (const estado in votosPorEstado) {
  const chave = estado
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  votosNormalizados[chave] = votosPorEstado[estado];
              }
        };
      },
      onEachFeature: function(feature, layer) {
        const votes = votosPorEstado[feature.properties.name];
        if(votes){
          layer.bindPopup(`
            <strong>${feature.properties.name}</strong><br>
            Laryssa ${votes["Laryssa"].toFixed(2)}%<br>
            Matheus ${votes["Matheus"].toFixed(2)}%
          `);
        } else {
          layer.bindPopup(feature.properties.name);
        }
      }
    }).addTo(map);

    map.fitBounds(layer.getBounds());
  })
  .catch(err => console.error("Erro ao carregar GeoJSON:", err));
