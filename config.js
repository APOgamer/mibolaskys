// Configuración del Widget OBS - Torneo de Bolas Eléctricas
// Modifica estos valores según tus preferencias

const WIDGET_CONFIG = {
    // Temporizadores (en segundos)
    timers: {
        autoDecision: 5,      // Tiempo para decisiones automáticas (mejoras)
        showResult: 3,        // Tiempo para mostrar resultado del combate
        showChampion: 10,     // Tiempo para mostrar campeón
        autoRestart: 5        // Tiempo antes de reiniciar automáticamente
    },

    // Configuración de jugadores
    players: {
        defaultCount: 4,      // Número de jugadores por defecto
        maxCount: 16,         // Máximo número de jugadores
        names: [              // Nombres temáticos predefinidos
            'Bola Eléctrica', 'Guambrillo Pro', 'Sierra Mortal', 'Velocidad X',
            'Tornado Azul', 'Rayo Verde', 'Furia Roja', 'Hielo Blanco',
            'Sombra Negra', 'Luz Dorada', 'Viento Gris', 'Fuego Púrpura',
            'Agua Celeste', 'Tierra Marrón', 'Metal Plateado', 'Cristal Arcoíris'
        ]
    },

    // Configuración de mejoras
    upgrades: {
        speed: {
            increment: 2,     // Incremento de velocidad
            maxValue: 15      // Valor máximo de velocidad
        },
        sawChance: {
            increment: 10,    // Incremento de probabilidad de sierra
            maxValue: 80      // Valor máximo de probabilidad
        },
        size: {
            increment: 20,    // Incremento de tamaño
            maxValue: 200     // Valor máximo de tamaño
        }
    },

    // Configuración de combate
    battle: {
        duration: 300,        // Duración máxima del combate (frames)
        sawSpawnRate: 0.02,   // Probabilidad de generar sierra por frame
        collisionDamage: 10,  // Daño por colisión entre bolas
        sawDamage: 5          // Daño por colisión con sierra
    },

    // Configuración visual
    visual: {
        colors: {
            primary: '#4ecdc4',      // Color principal
            secondary: '#ff6b6b',    // Color secundario
            background: '#1e3c72',   // Color de fondo
            text: '#ffffff'          // Color de texto
        },
        animations: {
            enabled: true,           // Habilitar animaciones
            duration: 1000          // Duración de animaciones (ms)
        }
    },

    // Configuración de OBS
    obs: {
        showUrl: true,              // Mostrar URL en el widget
        autoStart: false,           // Iniciar automáticamente al cargar
        fullscreen: false,          // Modo pantalla completa
        responsive: true            // Diseño responsivo
    },

    // Configuración de debug
    debug: {
        enabled: false,             // Habilitar modo debug
        showFPS: false,             // Mostrar FPS
        logEvents: false            // Registrar eventos en consola
    }
};

// Función para obtener configuración
function getConfig() {
    return WIDGET_CONFIG;
}

// Función para actualizar configuración
function updateConfig(newConfig) {
    Object.assign(WIDGET_CONFIG, newConfig);
}

// Función para obtener valor específico de configuración
function getConfigValue(path) {
    return path.split('.').reduce((obj, key) => obj[key], WIDGET_CONFIG);
}

// Exportar configuración si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WIDGET_CONFIG, getConfig, updateConfig, getConfigValue };
} 