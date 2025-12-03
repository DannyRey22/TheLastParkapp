// ===========================
//   PARQUES DE PRUEBA
// ===========================

let parques = [
  {id:1,nombre:'Parque Simón Bolívar',lat:4.655, lng:-74.093,localidad:'Teusaquillo',area_m2:114000,descripcion:'El principal parque de la ciudad, con lagos y zonas verdes.', direccion:"Av. 68"},
  {id:2,nombre:'Parque El Virrey',lat:4.678, lng:-74.050,localidad:'Chapinero',area_m2:20000,descripcion:'Abarrotado de corredores y áreas para perros.', direccion:"Cra 15"},
  {id:3,nombre:'Parque de los Novios',lat:4.652, lng:-74.065,localidad:'Barrios Unidos',area_m2:48000,descripcion:'Hermosas zonas para picnic y eventos.', direccion:"Calle 63"},
  {id:4,nombre:'Parque Nacional Enrique Olaya Herrera',lat:4.636, lng:-74.073,localidad:'Santa Fe',area_m2:30000,descripcion:'Parque tradicional con senderos y esculturas.', direccion:"Cra 7"},
  {id:5,nombre:'Parque El Tunal',lat:4.598, lng:-74.136,localidad:'Tunjuelito',area_m2:60000,descripcion:'Gran parque recreativo con canchas deportivas.', direccion:"Av Boyacá"}
];

let mapa;
let markers = [];
let userMarker = null;


// ===========================
//   INICIALIZAR MAPA
// ===========================
function iniciarMapa() {
    mapa = L.map("map").setView([4.65, -74.1], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18
    }).addTo(mapa);

    mostrarParques(parques);
    llenarLista(parques);
}


// ===========================
//   MOSTRAR MARCADORES
// ===========================
function mostrarParques(lista) {
    markers.forEach(m => mapa.removeLayer(m));
    markers = [];

    lista.forEach(p => {
        const marker = L.marker([p.lat, p.lng])
            .addTo(mapa)
            .bindPopup(`
                <strong>${p.nombre}</strong><br>
                ${p.direccion}<br>
                Localidad: ${p.localidad}
            `);

        markers.push(marker);
    });
}


// ===========================
//   LLENAR LISTA LATERAL
// ===========================
function llenarLista(lista) {
    const cont = document.getElementById("parksContainer");
    cont.innerHTML = "";

    lista.forEach(p => {
        const card = document.createElement("div");
        card.className = "park-card";

        card.innerHTML = `
            <h4>${p.nombre}</h4>
            <p>${p.localidad}</p>
            <p>${p.direccion}</p>
            <button class="btn-small" data-lat="${p.lat}" data-lng="${p.lng}">
                Ver en mapa
            </button>
        `;

        card.querySelector("button").addEventListener("click", e => {
            const lat = parseFloat(e.target.dataset.lat);
            const lng = parseFloat(e.target.dataset.lng);
            mapa.setView([lat, lng], 16);
        });

        cont.appendChild(card);
    });
}


// ===========================
//   BUSQUEDA
// ===========================
function buscarParques() {
    const texto = document.getElementById("searchInput").value.toLowerCase();

    const filtrados = parques.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.localidad.toLowerCase().includes(texto) ||
        p.direccion.toLowerCase().includes(texto)
    );

    mostrarParques(filtrados);
    llenarLista(filtrados);
}


// ===========================
//   PARQUE MÁS CERCANO
// ===========================
function parqueMasCercano(posUsuario) {
    let menorDist = Infinity;
    let parqueCercano = null;

    parques.forEach(p => {
        const dist = Math.sqrt(
            Math.pow(posUsuario.lat - p.lat, 2) +
            Math.pow(posUsuario.lng - p.lng, 2)
        );

        if (dist < menorDist) {
            menorDist = dist;
            parqueCercano = p;
        }
    });

    return parqueCercano;
}

function ubicarMasCercano() {
    navigator.geolocation.getCurrentPosition(pos => {
        const ubicacion = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        };

        if (userMarker) mapa.removeLayer(userMarker);

        userMarker = L.marker([ubicacion.lat, ubicacion.lng], { title: "Tu posición" })
            .addTo(mapa);

        const cercano = parqueMasCercano(ubicacion);

        if (cercano) {
            mapa.setView([cercano.lat, cercano.lng], 16);
        }
    });
}


// ===========================
//   EVENTOS
// ===========================
function registrarEventos() {
    const searchBtn   = document.getElementById("searchBtn");
    const listAllBtn  = document.getElementById("listAllBtn");
    const locateBtn   = document.getElementById("locateBtn");

    if (searchBtn) {
        searchBtn.addEventListener("click", buscarParques);
    }

    if (listAllBtn) {
        listAllBtn.addEventListener("click", () => {
            mostrarParques(parques);
            llenarLista(parques);
        });
    }

    if (locateBtn) {
        locateBtn.addEventListener("click", ubicarMasCercano);
    }
}



// ===========================
//   INICIO
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    iniciarMapa();
    registrarEventos();
});

