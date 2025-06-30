# 🏆 Torneo de Bolas Eléctricas

Un widget automático para OBS que simula un torneo de bolas eléctricas con combates automáticos.

## 🚀 Inicio Rápido

1. **Abre `index.html` directamente en tu navegador**
2. Configura los jugadores (4, 8 o 16)
3. Guarda la configuración
4. Inicia el torneo automático
5. ¡El torneo avanzará completamente solo!

## 🎮 Características

- ✅ **Sin servidor requerido** - Funciona directamente en el navegador
- ✅ **Modo automático completo** - Ideal para OBS y streaming
- ✅ **Temporizadores configurables** - Ajusta tiempos en `config.js`
- ✅ **Configuración guardable** - Guarda jugadores en localStorage
- ✅ **Diseño responsivo** - Funciona en diferentes pantallas
- ✅ **Logs automáticos** - Seguimiento del flujo en consola

## 📁 Archivos

- `index.html` - Archivo principal (abrir directamente)
- `script.js` - Lógica del juego
- `config.js` - Configuración y temporizadores
- `styles.css` - Estilos y diseño
- `INSTRUCCIONES-RAPIDAS.md` - Guía detallada

## ⚙️ Configuración

Edita `config.js` para personalizar:

```javascript
timers: {
    autoDecision: 5,      // Tiempo para mejoras
    showResult: 3,        // Tiempo para resultado
    showChampion: 10,     // Tiempo para campeón
    autoRestart: 5        // Tiempo antes de reiniciar
}
```

## 🎬 Para OBS

1. Abre `index.html` en el navegador
2. Configura y guarda los jugadores
3. Inicia el torneo automático
4. Captura la ventana del navegador en OBS
5. ¡El torneo avanzará automáticamente!

## 🔧 Solución de Problemas

- **Archivo no se abre**: Verifica que todos los archivos estén en la misma carpeta
- **Modo automático no funciona**: Revisa la consola del navegador (F12)
- **Errores**: Asegúrate de que el navegador soporte JavaScript moderno

---

**¡Disfruta del torneo automático!** 🏆⚡ 