class Juego {
  constructor(palabra) {
    this.palabra = palabra.toLowerCase(); // Convierte la palabra a minúsculas
    this.oculta = Array(palabra.length).fill("_"); // Representación oculta con guiones bajos
    this.vidas = 6; // Vidas iniciales
    this.puntos = 0; // Puntos iniciales
    this.inicio = Date.now(); // Marca de tiempo de inicio
  }
  probar(letra) {
    let acierto = false;
    this.palabra.split("").forEach((l, i) => {
      if (l === letra && this.oculta[i] === "_") {
        this.oculta[i] = letra;
        acierto = true;
        this.puntos += 10; // Suma puntos por cada letra acertada
      }
    });

    if (!acierto) this.vidas--; // Si no acierta, pierde una vida
    return acierto;
  }
  haGanado() {
    return !this.oculta.includes("_"); // Gana si no quedan letras ocultas
  }

  tiempoTotal() {
    return Math.floor((Date.now() - this.inicio) / 1000); // Tiempo en segundos desde el inicio
  }
}
let juego;

async function iniciarJuego() {
  const res = await fetch("https://random-word-api.herokuapp.com/word"); // Palabra aleatoria
  const [palabra] = await res.json();
  juego = new Juego(palabra); // Se crea una nueva instancia del juego
  actualizarUI(); // Se actualiza la interfaz
}
function actualizarUI() {
  document.getElementById("palabra").textContent = "Palabra: " + juego.oculta.join(" ");
  document.getElementById("vidas").textContent = "Vidas: " + juego.vidas;
}
document.getElementById("probar").addEventListener("click", () => {
  const letra = document.getElementById("letra").value.toLowerCase();
  document.getElementById("letra").value = "";

  if (!letra.match(/[a-z]/i)) return; // Valida que sea una letra

  juego.probar(letra); // Comprueba la letra
  actualizarUI();

  const mensaje = document.getElementById("mensaje");
  if (juego.haGanado()) {
    const tiempo = juego.tiempoTotal();
    mensaje.textContent = `¡Ganaste! Tiempo: ${tiempo}s, Puntos: ${juego.puntos}`;
    document.getElementById("formScore").dataset.score = JSON.stringify({ puntos: juego.puntos, tiempo });
  } else if (juego.vidas <= 0) {
    mensaje.textContent = `Perdiste. La palabra era: ${juego.palabra}`;
  }
});
document.getElementById("formScore").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const { puntos, tiempo } = JSON.parse(e.target.dataset.score);
  const fecha = new Date().toISOString().split("T")[0];

  await fetch("/api/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, puntos, tiempo, fecha })
  });

  cargarTabla(); // Recarga la tabla de posiciones
});
async function cargarTabla() {
  const res = await fetch("/api/score");
  const data = await res.json();
  const tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";
  data.forEach(row => {
    tbody.innerHTML += `<tr><td>${row.nombre}</td><td>${row.puntos}</td><td>${row.tiempo}</td><td>${row.fecha}</td></tr>`;
  });
}
document.getElementById("descargarPDF").addEventListener("click", async () => {
  const nombre = document.getElementById("nombre").value;
  const { puntos, tiempo } = JSON.parse(document.getElementById("formScore").dataset.score || "{}");
  if (!nombre || !puntos) return alert("Debes ganar y guardar tu score primero");

  const res = await fetch(`/api/pdf?nombre=${nombre}&puntos=${puntos}&tiempo=${tiempo}`);
  const blob = await res.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "score.pdf";
  link.click();
});
iniciarJuego();
cargarTabla();
