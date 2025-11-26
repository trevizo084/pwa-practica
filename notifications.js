document.addEventListener("DOMContentLoaded", () => {
  // Verifica si el navegador soporta notificaciones
  if (!("Notification" in window)) {
    alert("Este navegador no soporta notificaciones.");
    return;
  }

  // Escucha el clic en el botón
  const notifyBtn = document.getElementById("notifyBtn");
  if (!notifyBtn) {
    console.error("❌ No se encontró el botón de notificación.");
    return;
  }

  notifyBtn.addEventListener("click", async () => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // 🌤️ Simular o recuperar pronóstico
      let data;

      try {
        // Intentar obtener datos del localStorage (último pronóstico)
        const stored = localStorage.getItem('lastWeather');
        if (stored) {
          data = JSON.parse(stored);
        } else {
          // Si no hay datos guardados, simulamos uno
          data = {
            today: { summary: "Soleado ☀️", temp: 27 },
            tomorrow: { summary: "Parcialmente nublado 🌤️", temp: 25 }
          };
        }
      } catch (e) {
        console.warn("⚠️ No se pudieron obtener los datos del clima:", e);
      }

      // 📨 Crear texto de pronóstico
      const message = `Hoy: ${data.today.summary} (${data.today.temp}°C)\nMañana: ${data.tomorrow.summary} (${data.tomorrow.temp}°C)`;

      // 🔔 Mostrar la notificación
      new Notification("🌦️ Pronóstico del Clima", {
        body: message,
        icon: "https://cdn-icons-png.flaticon.com/512/1116/1116453.png",
        vibrate: [200, 100, 200],
        tag: "clima-pronostico",
        actions: [
          { action: "open", title: "Abrir aplicación" }
        ]
      });
    } else if (permission === "denied") {
      alert("Has denegado las notificaciones.");
    } else {
      alert("Debes permitir las notificaciones para probar.");
    }
  });
});

// 🟢 Nuevo método para manejar las notificaciones
function initNotifications() {
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






