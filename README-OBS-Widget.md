# 🎮 Widget OBS - Torneo de Bolas Eléctricas

## 📋 Descripción

Este es un widget optimizado para OBS (Open Broadcaster Software) que permite mostrar torneos automáticos de bolas eléctricas en tu stream. El widget funciona completamente de forma automática, perfecto para mantener el contenido fluyendo sin interrupciones manuales.

## ✨ Características Principales

### 🤖 Modo Automático Completo
- **Temporizadores automáticos**: Cada decisión se toma automáticamente después de 5 segundos
- **Mejoras automáticas**: Las mejoras se aplican aleatoriamente sin intervención manual
- **Combates automáticos**: Los enfrentamientos se ejecutan automáticamente
- **Transiciones automáticas**: El torneo avanza sin pausas

### 🎯 Configuración Rápida
- **4, 8 o 16 jugadores**: Configuración instantánea con un clic
- **Nombres automáticos**: Los jugadores tienen nombres temáticos predefinidos
- **Inicio automático**: Un solo botón para comenzar todo el torneo

### 🔗 URL para OBS
- **URL visible**: Se muestra la URL del widget en la esquina superior derecha
- **Botón de copiar**: Copia la URL al portapapeles con un clic
- **Fácil integración**: Simplemente pega la URL en OBS como fuente de navegador

## 🚀 Cómo Usar en OBS

### Paso 1: Abrir el Widget
1. Abre el archivo `obs-widget.html` en tu navegador
2. Verás la URL del widget en la esquina superior derecha
3. Haz clic en "Copiar URL" para copiarla al portapapeles

### Paso 2: Configurar en OBS
1. Abre OBS Studio
2. En la sección "Fuentes", haz clic en el botón "+"
3. Selecciona "Navegador"
4. Dale un nombre como "Torneo Widget"
5. En "URL", pega la URL que copiaste del widget
6. Configura el ancho y alto según necesites (recomendado: 1920x1080)
7. Haz clic en "Aceptar"

### Paso 3: Iniciar el Torneo
1. En el widget, selecciona el número de jugadores (4, 8 o 16)
2. Haz clic en "Iniciar Auto"
3. ¡El torneo comenzará automáticamente!

## ⚙️ Configuración del Widget

### Temporizadores Automáticos
- **Decisión de mejoras**: 5 segundos
- **Mostrar resultado**: 3 segundos  
- **Mostrar campeón**: 10 segundos
- **Reinicio automático**: Después de mostrar el campeón

### Jugadores Automáticos
El widget incluye 16 nombres temáticos predefinidos:
- Bola Eléctrica, Guambrillo Pro, Sierra Mortal, Velocidad X
- Tornado Azul, Rayo Verde, Furia Roja, Hielo Blanco
- Sombra Negra, Luz Dorada, Viento Gris, Fuego Púrpura
- Agua Celeste, Tierra Marrón, Metal Plateado, Cristal Arcoíris

### Mejoras Automáticas
- **Velocidad**: +2 puntos automáticamente
- **Probabilidad de Sierra**: +10% automáticamente
- **Tamaño**: +20% automáticamente

## 🎨 Personalización

### Modificar Temporizadores
Puedes cambiar los tiempos editando las constantes en el archivo `obs-widget.html`:

```javascript
const OBS_CONFIG = {
    autoTimer: 5,        // Tiempo para decisiones automáticas
    resultTimer: 3,      // Tiempo para mostrar resultado
    championTimer: 10,   // Tiempo para mostrar campeón
    autoUpgrades: true,  // Mejoras automáticas
    autoBattles: true    // Combates automáticos
};
```

### Cambiar Colores y Estilos
Los estilos están definidos en la sección `<style>` del archivo HTML. Puedes modificar:
- Colores de fondo
- Colores de texto
- Tamaños de fuente
- Animaciones y efectos

## 🔧 Solución de Problemas

### El widget no se muestra en OBS
1. Verifica que la URL sea correcta
2. Asegúrate de que el archivo esté en un servidor web (no funciona con `file://`)
3. Prueba abrir la URL directamente en tu navegador

### Los temporizadores no funcionan
1. Verifica que JavaScript esté habilitado
2. Revisa la consola del navegador para errores
3. Recarga la página

### El widget se ve muy grande/pequeño
1. Ajusta el ancho y alto en la configuración de OBS
2. Usa la opción "Redimensionar fuente" en OBS
3. Modifica los estilos CSS en el archivo HTML

## 📱 Optimización para Stream

### Tamaños Recomendados
- **Pantalla completa**: 1920x1080
- **Widget pequeño**: 800x600
- **Widget mediano**: 1280x720

### Posicionamiento en OBS
- **Esquina superior derecha**: Para información del torneo
- **Centro inferior**: Para combates en vivo
- **Pantalla completa**: Para momentos importantes

## 🎯 Casos de Uso

### Durante Streams
- **Entre juegos**: Muestra el torneo mientras cambias de juego
- **Pausas**: Mantén contenido entretenido durante descansos
- **Interludios**: Usa como transición entre segmentos

### Eventos Especiales
- **Torneos comunitarios**: Permite que los espectadores voten
- **Celebraciones**: Torneos temáticos para ocasiones especiales
- **Colaboraciones**: Torneos con otros streamers

## 🔄 Actualizaciones

### Versión 1.0
- ✅ Modo automático completo
- ✅ Temporizadores configurables
- ✅ URL para OBS
- ✅ 16 jugadores automáticos
- ✅ Mejoras automáticas
- ✅ Combates visuales

### Próximas Características
- [ ] Personalización de nombres de jugadores
- [ ] Más opciones de temporizadores
- [ ] Efectos de sonido
- [ ] Integración con chat de Twitch
- [ ] Estadísticas de torneos

## 📞 Soporte

Si tienes problemas o sugerencias:
1. Revisa esta documentación
2. Verifica la consola del navegador para errores
3. Prueba con diferentes configuraciones
4. Contacta al desarrollador con detalles específicos

---

**¡Disfruta de tu torneo automático de bolas eléctricas en OBS!** ⚡🏆 