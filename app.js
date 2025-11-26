// app.js — Lógica principal de la PWA

class AppShell {
  constructor() {
    this.content = document.getElementById('content');

    this.routes = {
      inicio: this.renderInicio,
      pronostico: this.renderPronostico,
      detalles: this.renderDetalles,
      info: this.renderInfo
    };

    this.registerSW();
    this.navigate('inicio');
    this.initNotifications();
  }

  navigate(ruta) {
    const view = this.routes[ruta];
    if (view) view.call(this);
  }

  renderSkeleton() {
    this.content.innerHTML = `
      <div class="skeleton-title"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    `;
  }

  // =============================
  // 🔹 INICIO (ACTUALIZADO)
  // =============================
 renderInicio() {
  this.content.innerHTML = `
    <h2>☀️ Bienvenido</h2>
    <p>Consulta el clima de tu ciudad en tiempo real, incluso sin conexión.</p>

    <h3>🌤️ ¿Qué es el clima?</h3>
    <p>
      El clima es el conjunto de condiciones atmosféricas como temperatura,
      humedad, viento y presión que ocurren en un lugar específico.
      Esta aplicación toma esos datos y te muestra una descripción sencilla
      y fácil de entender.
    </p>

    <h3>⭐ ¿Qué muestra la app?</h3>
    <ul>
      <li>Temperatura actual</li>
      <li>Descripción del estado del tiempo (nublado, soleado, etc.)</li>
      <li>Pronóstico básico de hoy y mañana</li>
      <li>Notificaciones sobre cambios importantes</li>
    </ul>

    <h3>📱 Funciones</h3>
    <p>
      Puedes navegar por el menú para ver el pronóstico, detalles o información del proyecto.
    </p>
  `;
}


  // =============================
  // 🔹 PRONÓSTICO ORIGINAL
  // =============================
  async renderPronostico() {
    this.renderSkeleton();

    const fakeAPI = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          today: { summary: "Soleado ☀️", temp: 27 },
          tomorrow: { summary: "Parcialmente nublado 🌤️", temp: 25 }
        });
      }, 1000);
    });

    try {
      const data = await fakeAPI;

      localStorage.setItem('lastWeather', JSON.stringify(data));

      this.content.innerHTML = `
        <h2>Pronóstico</h2>
        <p>Hoy: ${data.today.summary} — ${data.today.temp}°C</p>
        <p>Mañana: ${data.tomorrow.summary} — ${data.tomorrow.temp}°C</p>
      `;
    } catch {
      const stored = localStorage.getItem('lastWeather');

      if (stored) {
        const data = JSON.parse(stored);
        this.content.innerHTML = `
          <h2>Pronóstico (offline)</h2>
          <p>Hoy: ${data.today.summary} — ${data.today.temp}°C</p>
          <p>Mañana: ${data.tomorrow.summary} — ${data.tomorrow.temp}°C</p>
        `;
      } else {
        this.content.innerHTML = `<p>No hay datos y estás offline.</p>`;
      }
    }
  }

  // =============================
  // 🔹 NUEVA SECCIÓN: DETALLES DEL CLIMA
  // =============================
  renderDetalles() {
    this.content.innerHTML = `
      <h2>Detalles del clima</h2>
      <p>Información extendida basada en tu último pronóstico guardado.</p>
    `;

    const stored = localStorage.getItem('lastWeather');

    if (!stored) {
      this.content.innerHTML += `
        <p>No hay datos aún. Visita la sección Pronóstico para generarlos.</p>
      `;
      return;
    }

    const data = JSON.parse(stored);

    this.content.innerHTML += `
      <h3>Hoy</h3>
      <ul>
        <li>Condición: ${data.today.summary}</li>
        <li>Temperatura: ${data.today.temp}°C</li>
        <li>Sensación térmica: ${data.today.temp - 1}°C</li>
        <li>Humedad estimada: 40%</li>
      </ul>

      <h3>Mañana</h3>
      <ul>
        <li>Condición: ${data.tomorrow.summary}</li>
        <li>Temperatura: ${data.tomorrow.temp}°C</li>
        <li>Sensación térmica: ${data.tomorrow.temp - 1}°C</li>
        <li>Viento estimado: 12 km/h</li>
      </ul>
    `;
  }

  // =============================
  // 🔹 ACERCA DE (AMPLIADA)
  // =============================
  renderInfo() {
    this.content.innerHTML = `
      <h2>Acerca de</h2>
      <p>PWA creada por Denisse Trevizo.</p>

      <h3>🛠️ Tecnologías utilizadas</h3>
      <ul>
        <li>JavaScript Vanilla</li>
        <li>Service Workers</li>
        <li>Cache API</li>
        <li>LocalStorage</li>
        <li>Manifest Web App</li>
      </ul>

      <h3>🎯 Objetivo</h3>
      <p>Brindar una aplicación ligera y rápida para consultar el clima incluso sin conexión y enviar notificaciones personalizadas.</p>

      <h3>📌 Versión</h3>
      <p>v2.0 — Información ampliada y nueva sección de detalles.</p>
    `;
  }

  // =============================
  // 🔹 SERVICE WORKER
  // =============================
  registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('SW registrado'))
        .catch(err => console.error('SW error:', err));
    }
  }

  // =============================
  // 🔹 NOTIFICACIONES (NO TOCADO)
  // =============================
  initNotifications() {
    const btn = document.getElementById("notifyBtn");
    if (!btn) return;

    btn.addEventListener("click", async () => {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Debes permitir notificaciones.");
        return;
      }

      let data = JSON.parse(localStorage.getItem('lastWeather')) || {
        today: { summary: "Soleado ☀️", temp: 27 },
        tomorrow: { summary: "Parcialmente nublado 🌤️", temp: 25 }
      };

      new Notification("🌦️ Pronóstico del Clima", {
        body: `Hoy: ${data.today.summary} (${data.today.temp}°C)
Mañana: ${data.tomorrow.summary} (${data.tomorrow.temp}°C)`,
        icon: "https://cdn-icons-png.flaticon.com/512/1116/1116453.png",
        vibrate: [200, 100, 200],
      });
    });
  }
}

// Iniciar App
const appShell = new AppShell();
