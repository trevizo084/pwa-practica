class AppShell {
  constructor() {
    this.content = document.getElementById('content');
    this.routes = {
      inicio: this.renderInicio,
      pronostico: this.renderPronostico,
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

  async renderPronostico() {
    this.renderSkeleton();

    try {
      // Simular llamada a API local
      const fakeAPI = new Promise(resolve => {
        setTimeout(() => {
          resolve({
            today: { summary: "Soleado con algunas nubes ☀️", temp: 27 },
            tomorrow: { summary: "Parcialmente nublado 🌤️", temp: 25 }
          });
        }, 1000);
      });

      const data = await fakeAPI;

      // Guardar el último pronóstico
      localStorage.setItem('lastWeather', JSON.stringify(data));

      // Mostrar en pantalla
      this.content.innerHTML = `
        <h2>Pronóstico</h2>
        <p>Hoy: ${data.today.summary} — ${data.today.temp}°C</p>
        <p>Mañana: ${data.tomorrow.summary} — ${data.tomorrow.temp}°C</p>
      `;

    } catch (e) {
      console.warn('⚠️ Error o sin conexión, intentando datos guardados...');

      const lastData = localStorage.getItem('lastWeather');
      if (lastData) {
        const data = JSON.parse(lastData);
        this.content.innerHTML = `
          <h2>Pronóstico (último guardado)</h2>
          <p>Hoy: ${data.today.summary} — ${data.today.temp}°C</p>
          <p>Mañana: ${data.tomorrow.summary} — ${data.tomorrow.temp}°C</p>
        `;
      } else {
        this.content.innerHTML = `
          <h2>Pronóstico</h2>
          <p class="error">Sin conexión: no se pudo obtener el pronóstico.</p>
        `;
      }
    }
  }

  renderInicio() {
    this.content.innerHTML = `
      <h2>Bienvenido</h2>
      <p>Consulta el clima actual y el pronóstico de tu ciudad.</p>
    `;
  }

  renderInfo() {
    this.content.innerHTML = `
      <h2>Acerca de</h2>
      <p>Esta aplicación muestra el clima actual.</p>
    `;
  }

  registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js')
        .then(() => console.log('✅ Service Worker registrado correctamente.'))
        .catch(err => console.warn('❌ Error al registrar SW:', err));
    }
  }

  // 🟢 Nuevo método para manejar las notificaciones
  initNotifications() {
    const notifyBtn = document.getElementById("notifyBtn");
    if (!notifyBtn) return;

    if (!("Notification" in window)) {
      console.warn("❌ Este navegador no soporta notificaciones.");
      return;
    }

    notifyBtn.addEventListener("click", async () => {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Debes permitir las notificaciones para usarlas.");
        return;
      }

      // Intentar obtener datos del clima actual o guardado
      let data;
      try {
        const stored = localStorage.getItem('lastWeather');
        if (stored) {
          data = JSON.parse(stored);
        } else {
          // Si no hay datos previos, generar unos por defecto
          data = {
            today: { summary: "Soleado ☀️", temp: 27 },
            tomorrow: { summary: "Parcialmente nublado 🌤️", temp: 25 }
          };
          localStorage.setItem('lastWeather', JSON.stringify(data));
        }
      } catch (e) {
        console.warn("⚠️ No se pudieron obtener los datos del clima:", e);
        return;
      }

      // Crear mensaje
      const message = `Hoy ${data.today.summary} (${data.today.temp}°C)\nMañana ${data.tomorrow.summary} (${data.tomorrow.temp}°C)`;

      // Mostrar notificación
      new Notification("🌦️ Pronóstico del Clima", {
        body: message,
        icon: "https://cdn-icons-png.flaticon.com/512/1116/1116453.png",
        vibrate: [200, 100, 200],
        tag: "clima-pronostico"
      });
    });
  }
}

// Inicializar la app
const appShell = new AppShell();

// Detectar conexión
window.addEventListener('offline', () => {
  const content = document.getElementById('content');
  const warning = document.createElement('div');
  warning.id = 'offline-warning';
  warning.textContent = '⚠️ Estás sin conexión. Algunas funciones no estarán disponibles.';
  warning.style.background = '#ffcc00';
  warning.style.color = '#000';
  warning.style.padding = '10px';
  warning.style.marginTop = '10px';
  warning.style.borderRadius = '8px';
  warning.style.textAlign = 'center';
  content.prepend(warning);
});

window.addEventListener('online', () => {
  const warning = document.getElementById('offline-warning');
  if (warning) warning.remove();

  const content = document.getElementById('content');
  const notice = document.createElement('div');
  notice.textContent = '✅ Conexión restaurada.';
  notice.style.background = '#4CAF50';
  notice.style.color = 'white';
  notice.style.padding = '10px';
  notice.style.marginTop = '10px';
  notice.style.borderRadius = '8px';
  notice.style.textAlign = 'center';
  content.prepend(notice);

  setTimeout(() => notice.remove(), 3000);
});
