<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi PWA - Práctica Service Worker</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="manifest" href="manifest.json">
</head>
<body>
  <h1>💡 Práctica: Service Worker y PWA</h1>
  <p>Esta página funciona sin conexión gracias al Service Worker.</p>

  <!-- 🔔 Botón para mostrar notificaciones -->
  <button id="notifyBtn">🔔 Mostrar notificación</button>

  <script>
    // ✅ Registrar el Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('✅ ¡Service Worker registrado!', reg))
        .catch(err => console.error('❌ Error al registrar el Service Worker:', err));
    }

    // ✅ Lógica para las notificaciones
    document.addEventListener("DOMContentLoaded", () => {
      const notifyBtn = document.getElementById("notifyBtn");

      // Verificar compatibilidad
      if (!("Notification" in window)) {
        alert("Este navegador no soporta notificaciones.");
        return;
      }

      // Evento de clic para solicitar permiso y mostrar la notificación
      notifyBtn.addEventListener("click", async () => {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          // Crear la notificación
          new Notification("🌤️ PWA Notificación activa", {
            body: "¡Tu PWA ya puede mostrar notificaciones!",
            icon: "https://cdn-icons-png.flaticon.com/512/1116/1116453.png",
            vibrate: [200, 100, 200],
            tag: "pwa-demo",
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
  </script>
</body>
</html>
