// Central do Brasil
const map = L.map('map').setView([-14.2, -51.9], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Função para cores (exemplo de degradê)
function getColor(valor) {
  return valor > 80 ? '#ff0000' :
         valor > 60 ? '#ff6600' :
         valor > 40 ? '#ffcc00' :
         valor > 20 ? '#ccff00' :
                       '#00ff00';
}

// Estilo dos estados
function style(feature) {
  // Aqui colocamos um valor aleatório só pra exemplo
  const valor = Math.floor(Math.random() * 100);
  return {
    fillColor: getColor(valor),
    weight: 1,
    color: '#111',
    fillOpacity: 0.7
  };
}

// Carregar GeoJSON do Brasil
fetch('brazil.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJson(data, { style }).addTo(map);
  });
