# 🏆 Torneo de Bolas Eléctricas - Instrucciones Rápidas

## 🚀 Inicio Rápido

### Opción A: Abrir directamente en el navegador (Recomendado)
1. Haz doble clic en `index.html`
2. El juego se abrirá directamente en tu navegador
3. ¡No necesitas servidor!

### Opción B: Usar Live Server (VS Code)
1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

### Opción C: Servidor local simple
Si necesitas un servidor por alguna razón:
- **Node.js**: `npx http-server`
- **PHP**: `php -S localhost:8000`
- **Python**: `python -m http.server 8000`

## 🎮 Cómo Jugar

### Configuración Manual
1. Configura los jugadores (4, 8 o 16)
2. Completa todos los nombres
3. Haz clic en "Iniciar Torneo"
4. Juega manualmente o activa el modo automático

### Modo Automático (OBS)
1. Configura los jugadores
2. Guarda la configuración con "💾 Guardar Configuración"
3. Haz clic en "🚀 Iniciar Torneo Automático"
4. El torneo avanzará completamente solo

### Activación Durante el Torneo
- En cualquier momento, haz clic en "🚀 Activar Modo Automático"
- El torneo continuará automáticamente desde ese punto

## ⚙️ Configuración

### Temporizadores (config.js)
```javascript
timers: {
    autoDecision: 5,      // Tiempo para mejoras
    showResult: 3,        // Tiempo para resultado
    showChampion: 10,     // Tiempo para campeón
    autoRestart: 5        // Tiempo antes de reiniciar
}
```

### Personalización
- Modifica `config.js` para cambiar temporizadores
- Edita `styles.css` para cambiar colores
- Personaliza nombres en `config.js`

## 📁 Estructura del Proyecto

```
mibolaskys/
├── index.html          # Archivo principal (abrir directamente)
├── script.js           # Lógica del juego
├── config.js           # Configuración
├── styles.css          # Estilos
└── INSTRUCCIONES-RAPIDAS.md
```

## 🔧 Solución de Problemas

### El archivo no se abre
- Asegúrate de que todos los archivos estén en la misma carpeta
- Verifica que el navegador soporte JavaScript moderno

### Modo automático no funciona
- Verifica que hayas guardado la configuración
- Revisa la consola del navegador (F12) para errores
- Asegúrate de que `config.js` esté presente

### Errores de JavaScript
- Abre la consola del navegador (F12)
- Verifica que todos los archivos se carguen correctamente
- Revisa que no haya errores de sintaxis

## 🎯 Características

- ✅ **Sin servidor requerido** - Abre directamente en el navegador
- ✅ **Modo automático completo** - Para OBS y streaming
- ✅ **Configuración guardable** - Guarda jugadores en localStorage
- ✅ **Temporizadores configurables** - Ajusta tiempos en config.js
- ✅ **Diseño responsivo** - Funciona en diferentes pantallas
- ✅ **Logs automáticos** - Seguimiento del flujo en consola

## 🚀 Para OBS

1. Abre `index.html` en el navegador
2. Configura y guarda los jugadores
3. Inicia el torneo automático
4. Captura la ventana del navegador en OBS
5. El torneo avanzará automáticamente

¡Disfruta del torneo! 🏆⚡ 