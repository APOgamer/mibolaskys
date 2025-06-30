// Clase principal del juego
class TorneoBolas {
    constructor() {
        this.players = [];
        this.currentRound = 1;
        this.currentMatch = 0;
        this.matches = [];
        this.currentPlayer1 = null;
        this.currentPlayer2 = null;
        this.battleAnimation = null;
        this.upgradesUsed = { 1: [], 2: [] };
        
        // Variables para modo automático
        this.autoTimer = null;
        this.resultTimer = null;
        this.championTimer = null;
        this.widgetMode = false;
        
        // Cargar configuración
        this.config = this.loadConfig();
        
        this.initializeEventListeners();
        
        // Hacer la instancia disponible globalmente
        window.torneo = this;
        
        // Verificar si hay parámetros de URL para iniciar automáticamente
        this.checkUrlParameters();
    }

    // Cargar configuración
    loadConfig() {
        if (typeof WIDGET_CONFIG !== 'undefined') {
            return WIDGET_CONFIG;
        }
        // Configuración por defecto si no está disponible
        return {
            timers: {
                autoDecision: 5,
                showResult: 3,
                showChampion: 10,
                autoRestart: 5
            }
        };
    }

    // Leer parámetros de URL
    readUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const participantes = urlParams.get('participantes');
        const autoStart = urlParams.get('auto') === 'true';
        
        if (participantes) {
            return this.parseParticipantes(participantes, autoStart);
        }
        return null;
    }

    // Parsear string de participantes
    parseParticipantes(participantesStr, autoStart = false) {
        const participantes = participantesStr.split('&').filter(p => p.trim());
        const players = [];
        participantes.forEach((participante, index) => {
            let player = {
                id: index + 1,
                name: participante,
                speed: 5,
                sawChance: 20,
                size: 100,
                eliminated: false
            };
            // Detectar ventajas en el nombre (ej: tuffy1, capi2)
            const match = participante.match(/^(.+?)([123])$/);
            if (match) {
                player.name = match[1];
                const ventaja = match[2];
                switch (ventaja) {
                    case '1': player.speed += 2; break;
                    case '2': player.sawChance += 10; break;
                    case '3': player.size += 20; break;
                }
            }
            players.push(player);
        });
        return {
            players: players,
            autoStart: autoStart
        };
    }

    // Inicializar event listeners
    initializeEventListeners() {
        // Configuración de jugadores
        document.getElementById('player-count').addEventListener('change', (e) => {
            this.updatePlayerInputs(parseInt(e.target.value));
        });

        document.getElementById('start-tournament').addEventListener('click', () => {
            this.startTournament();
        });

        // Botones de mejora
        document.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const player = parseInt(e.target.dataset.player);
                const upgrade = e.target.dataset.upgrade;
                this.applyUpgrade(player, upgrade);
            });
        });

        // Botones de combate
        document.getElementById('start-battle').addEventListener('click', () => {
            this.startBattle();
        });

        document.getElementById('skip-battle').addEventListener('click', () => {
            this.skipBattle();
        });

        // Botones de resultado
        document.getElementById('next-match').addEventListener('click', () => {
            this.nextMatch();
        });

        document.getElementById('tournament-over').addEventListener('click', () => {
            this.showChampion();
        });

        // Botón de nuevo torneo
        document.getElementById('new-tournament').addEventListener('click', () => {
            this.resetGame();
        });

        // Botón para activar modo automático
        const activateAutoBtn = document.getElementById('activate-auto-mode');
        if (activateAutoBtn) {
            activateAutoBtn.addEventListener('click', () => {
                this.setWidgetMode(true);
                activateAutoBtn.style.display = 'none';
            });
        }

        // Inicializar inputs de jugadores
        this.updatePlayerInputs(4);
    }

    // Actualizar inputs de jugadores
    updatePlayerInputs(count) {
        const container = document.getElementById('player-inputs');
        container.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.className = 'player-input';
            div.innerHTML = `
                <label for="player-${i + 1}">Jugador ${i + 1}:</label>
                <input type="text" id="player-${i + 1}" placeholder="Nombre del jugador ${i + 1}" required>
            `;
            container.appendChild(div);
        }
        
        // Actualizar URL del widget después de crear los inputs
        if (typeof updateWidgetUrl === 'function') {
            setTimeout(updateWidgetUrl, 50);
        }
    }

    // Iniciar torneo
    startTournament() {
        const playerCount = parseInt(document.getElementById('player-count').value);
        const players = [];
        for (let i = 0; i < playerCount; i++) {
            const input = document.getElementById(`player-${i + 1}`);
            const select = document.getElementById(`ventaja-player-${i + 1}`);
            if (!input.value.trim()) {
                alert('Por favor, completa todos los nombres de jugadores.');
                return;
            }
            let player = {
                id: i + 1,
                name: input.value.trim(),
                speed: 5,
                sawChance: 20,
                size: 100,
                eliminated: false
            };
            if (select && select.value) {
                switch (select.value) {
                    case '1': player.speed += 2; break;
                    case '2': player.sawChance += 10; break;
                    case '3': player.size += 20; break;
                }
            }
            players.push(player);
        }
        this.players = players;
        this.generateMatches();
        this.showScreen('tournament-screen');
        this.updateTournamentDisplay();
        this.prepareNextMatch();
        const activateAutoBtn = document.getElementById('activate-auto-mode');
        if (activateAutoBtn) {
            activateAutoBtn.style.display = 'block';
        }
    }

    // Generar emparejamientos
    generateMatches() {
        this.matches = [];
        const shuffledPlayers = [...this.players].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < shuffledPlayers.length; i += 2) {
            this.matches.push({
                player1: shuffledPlayers[i],
                player2: shuffledPlayers[i + 1],
                winner: null,
                completed: false
            });
        }
    }

    // Actualizar display del torneo
    updateTournamentDisplay() {
        document.getElementById('current-round').textContent = `Ronda ${this.currentRound}`;
        document.getElementById('match-info').textContent = `Combate ${this.currentMatch + 1} de ${this.matches.length}`;
        
        // Actualizar bracket
        this.updateBracket();
    }

    // Actualizar bracket visual
    updateBracket() {
        const container = document.getElementById('bracket-container');
        container.innerHTML = '';

        this.players.forEach(player => {
            const div = document.createElement('div');
            div.className = 'bracket-player';
            div.textContent = player.name;
            
            if (player.eliminated) {
                div.classList.add('eliminated');
            } else if (this.isPlayerInCurrentMatch(player)) {
                div.style.border = '2px solid #4ecdc4';
            }
            
            container.appendChild(div);
        });
    }

    // Verificar si un jugador está en el combate actual
    isPlayerInCurrentMatch(player) {
        if (this.currentMatch >= this.matches.length) return false;
        const match = this.matches[this.currentMatch];
        return match.player1.id === player.id || match.player2.id === player.id;
    }

    // Preparar siguiente combate
    prepareNextMatch() {
        if (this.currentMatch >= this.matches.length) {
            this.advanceRound();
            return;
        }

        const match = this.matches[this.currentMatch];
        // Reiniciar tamaño a 100% para ambos jugadores
        this.currentPlayer1 = { ...match.player1, size: 100 };
        this.currentPlayer2 = { ...match.player2, size: 100 };
        // Resetear mejoras
        this.upgradesUsed = { 1: [], 2: [] };
        // Actualizar display
        this.updateMatchPreview();
        // Iniciar temporizador automático si está activado
        if (this.widgetMode) {
            console.log('[AUTO] Preparando combate', this.currentMatch + 1, 'de', this.matches.length);
            this.startAutoUpgradeTimer();
        }
    }

    // Actualizar vista previa del combate
    updateMatchPreview() {
        document.getElementById('player1-name').textContent = this.currentPlayer1.name;
        document.getElementById('player1-speed').textContent = this.currentPlayer1.speed;
        document.getElementById('player1-saw-chance').textContent = this.currentPlayer1.sawChance + '%';
        document.getElementById('player1-size').textContent = this.currentPlayer1.size + '%';

        document.getElementById('player2-name').textContent = this.currentPlayer2.name;
        document.getElementById('player2-speed').textContent = this.currentPlayer2.speed;
        document.getElementById('player2-saw-chance').textContent = this.currentPlayer2.sawChance + '%';
        document.getElementById('player2-size').textContent = this.currentPlayer2.size + '%';

        // Resetear botones de mejora
        document.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.classList.remove('used');
        });
    }

    // Aplicar mejora
    applyUpgrade(player, upgrade) {
        const usedUpgrades = this.upgradesUsed[player];
        
        if (usedUpgrades.includes(upgrade)) {
            return; // Ya se usó esta mejora
        }

        const playerObj = player === 1 ? this.currentPlayer1 : this.currentPlayer2;
        
        switch (upgrade) {
            case 'speed':
                playerObj.speed += 2;
                break;
            case 'saw':
                if (!playerObj.sawBuffDuration) playerObj.sawBuffDuration = 180; // Valor base
                playerObj.sawBuffDuration += 180; // +3 segundos (180 frames)
                break;
            case 'size':
                playerObj.size += 20;
                break;
        }

        usedUpgrades.push(upgrade);
        
        // Log automático
        if (this.widgetMode) {
            console.log(`[AUTO] Mejora aplicada: Jugador ${player} - ${upgrade}`);
        }
        
        // Marcar botón como usado
        const btn = document.querySelector(`[data-player="${player}"][data-upgrade="${upgrade}"]`);
        btn.classList.add('used');
        
        // Actualizar display
        this.updateMatchPreview();
    }

    // Iniciar combate
    startBattle() {
        if (this.widgetMode) {
            console.log('[AUTO] Iniciando combate');
        }
        this.showScreen('battle-screen');
        document.getElementById('battle-title').textContent = `${this.currentPlayer1.name} vs ${this.currentPlayer2.name}`;
        document.getElementById('battle-player1-name').textContent = this.currentPlayer1.name;
        document.getElementById('battle-player2-name').textContent = this.currentPlayer2.name;
        this.startBattleSimulation();
    }

    // Iniciar simulación de combate
    startBattleSimulation() {
        const canvas = document.getElementById('battle-canvas');
        const ctx = canvas.getContext('2d');
        
        // Configuración del combate
        const battleConfig = {
            canvas: canvas,
            ctx: ctx,
            player1: { 
                ...this.currentPlayer1,
                x: 100,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * this.currentPlayer1.speed * 2,
                vy: (Math.random() - 0.5) * this.currentPlayer1.speed * 2,
                hasSaws: false,
                sawTimer: 0
            },
            player2: { 
                ...this.currentPlayer2,
                x: canvas.width - 100,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * this.currentPlayer2.speed * 2,
                vy: (Math.random() - 0.5) * this.currentPlayer2.speed * 2,
                hasSaws: false,
                sawTimer: 0
            },
            saws: [],
            sawSpawnTimer: 0,
            gameOver: false,
            winner: null
        };

        // Función de animación
        const animate = () => {
            if (battleConfig.gameOver) {
                this.endBattle(battleConfig.winner);
                return;
            }

            this.updateBattle(battleConfig);
            this.drawBattle(battleConfig);
            
            this.battleAnimation = requestAnimationFrame(animate);
        };

        animate();
    }

    // Actualizar estado del combate
    updateBattle(config) {
        const { player1, player2, saws, sawSpawnTimer } = config;
        
        // Mover bolas
        this.moveBall(player1);
        this.moveBall(player2);
        
        // Verificar colisiones con bordes
        this.checkWallCollision(player1, config.canvas);
        this.checkWallCollision(player2, config.canvas);
        
        // Verificar colisiones entre bolas
        this.checkBallCollision(player1, player2);
        
        // Generar sierras cada 5 segundos (300 frames a 60 FPS)
        config.sawSpawnTimer++;
        if (config.sawSpawnTimer > 300) {
            this.spawnSaw(config);
            config.sawSpawnTimer = 0;
        }
        
        // Actualizar temporizadores de sierras de los jugadores
        const defaultSawDuration = (player1.sawBuffDuration || 180);
        if (player1.hasSaws) {
            player1.sawTimer++;
            if (player1.sawTimer > defaultSawDuration) {
                player1.hasSaws = false;
                player1.sawTimer = 0;
            }
        }
        
        const defaultSawDuration2 = (player2.sawBuffDuration || 180);
        if (player2.hasSaws) {
            player2.sawTimer++;
            if (player2.sawTimer > defaultSawDuration2) {
                player2.hasSaws = false;
                player2.sawTimer = 0;
            }
        }
        
        // Actualizar sierras
        this.updateSaws(config);
        
        // Verificar colisiones con sierras
        this.checkSawCollisions(config);
        
        // Verificar fin del juego
        const minRadius = 14; // Tamaño mínimo absoluto en píxeles
        const player1Radius = (player1.size / 100) * 20;
        const player2Radius = (player2.size / 100) * 20;
        
        if (player1Radius <= minRadius || player2Radius <= minRadius) {
            config.gameOver = true;
            config.winner = player1Radius > player2Radius ? player1 : player2;
        }
        
        // Actualizar display
        document.getElementById('battle-player1-size').textContent = Math.round(player1.size) + '%';
        document.getElementById('battle-player2-size').textContent = Math.round(player2.size) + '%';
    }

    // Mover bola
    moveBall(player) {
        // Mantener velocidad constante según el atributo speed
        const targetSpeed = player.speed;
        const currentSpeed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
        if (currentSpeed > 0) {
            const scale = targetSpeed / currentSpeed;
            player.vx *= scale;
            player.vy *= scale;
        } else {
            // Si por alguna razón la velocidad es 0, asignar una dirección aleatoria
            const angle = Math.random() * 2 * Math.PI;
            player.vx = Math.cos(angle) * targetSpeed;
            player.vy = Math.sin(angle) * targetSpeed;
        }
        player.x += player.vx;
        player.y += player.vy;
    }

    // Verificar colisión con paredes
    checkWallCollision(player, canvas) {
        const radius = (player.size / 100) * 20;
        
        if (player.x - radius <= 0 || player.x + radius >= canvas.width) {
            player.vx *= -1;
        }
        if (player.y - radius <= 0 || player.y + radius >= canvas.height) {
            player.vy *= -1;
        }
        
        // Mantener dentro de los límites
        player.x = Math.max(radius, Math.min(canvas.width - radius, player.x));
        player.y = Math.max(radius, Math.min(canvas.height - radius, player.y));
    }

    // Verificar colisión entre bolas
    checkBallCollision(player1, player2) {
        const dx = player2.x - player1.x;
        const dy = player2.y - player1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (player1.size / 100) * 20 + (player2.size / 100) * 20;
        
        if (distance < minDistance && distance > 0) {
            // Separar las bolas para evitar que se superpongan
            const overlap = minDistance - distance;
            const separationX = (dx / distance) * overlap * 0.5;
            const separationY = (dy / distance) * overlap * 0.5;
            
            player1.x -= separationX;
            player1.y -= separationY;
            player2.x += separationX;
            player2.y += separationY;
            
            // Aplicar daño según el estado de las sierras
            if (player1.hasSaws && player2.hasSaws) {
                // Ambos tienen sierras - ambos se dañan y pierden el buff
                player1.size *= 0.8; // Reduce 20%
                player2.size *= 0.8; // Reduce 20%
                player1.hasSaws = false;
                player2.hasSaws = false;
                player1.sawTimer = 0;
                player2.sawTimer = 0;
            } else if (player1.hasSaws && !player2.hasSaws) {
                // Solo player1 tiene sierras - daña a player2
                player2.size *= 0.8; // Reduce 20%
                player1.hasSaws = false;
                player1.sawTimer = 0;
            } else if (player2.hasSaws && !player1.hasSaws) {
                // Solo player2 tiene sierras - daña a player1
                player1.size *= 0.8; // Reduce 20%
                player2.hasSaws = false;
                player2.sawTimer = 0;
            }
            // Si ninguno tiene sierras, solo rebotan sin daño
            
            // Calcular rebote elástico
            const normalX = dx / distance;
            const normalY = dy / distance;
            
            // Velocidades relativas
            const relativeVelocityX = player2.vx - player1.vx;
            const relativeVelocityY = player2.vy - player1.vy;
            
            // Producto punto de velocidad relativa con normal
            const velocityAlongNormal = relativeVelocityX * normalX + relativeVelocityY * normalY;
            
            // Solo rebotar si las bolas se están acercando
            if (velocityAlongNormal < 0) {
                // Calcular impulso
                const restitution = 0.8; // Factor de rebote
                const impulse = -(1 + restitution) * velocityAlongNormal;
                
                // Aplicar impulso
                const impulseX = impulse * normalX;
                const impulseY = impulse * normalY;
                
                // Actualizar velocidades
                player1.vx -= impulseX;
                player1.vy -= impulseY;
                player2.vx += impulseX;
                player2.vy += impulseY;
                
                // Añadir un pequeño impulso aleatorio para evitar que se queden atrapadas
                const randomAngle = Math.random() * Math.PI * 2;
                const randomForce = 1;
                player1.vx += Math.cos(randomAngle) * randomForce;
                player1.vy += Math.sin(randomAngle) * randomForce;
                player2.vx += Math.cos(randomAngle + Math.PI) * randomForce;
                player2.vy += Math.sin(randomAngle + Math.PI) * randomForce;
            }
        }
    }

    // Generar sierra
    spawnSaw(config) {
        const saw = {
            x: Math.random() * (config.canvas.width - 40) + 20,
            y: Math.random() * (config.canvas.height - 40) + 20,
            radius: 10,
            collected: false
        };
        config.saws.push(saw);
    }

    // Actualizar sierras
    updateSaws(config) {
        config.saws = config.saws.filter(saw => !saw.collected);
    }

    // Verificar colisiones con sierras
    checkSawCollisions(config) {
        const { player1, player2, saws } = config;
        
        saws.forEach(saw => {
            // Colisión con player1
            const dist1 = Math.sqrt(
                Math.pow(player1.x - saw.x, 2) + Math.pow(player1.y - saw.y, 2)
            );
            if (dist1 < (player1.size / 100) * 20 + saw.radius) {
                if (Math.random() * 100 < player1.sawChance) {
                    player1.hasSaws = true;
                    player1.sawTimer = 0; // Resetear temporizador
                    saw.collected = true;
                }
            }
            
            // Colisión con player2
            const dist2 = Math.sqrt(
                Math.pow(player2.x - saw.x, 2) + Math.pow(player2.y - saw.y, 2)
            );
            if (dist2 < (player2.size / 100) * 20 + saw.radius) {
                if (Math.random() * 100 < player2.sawChance) {
                    player2.hasSaws = true;
                    player2.sawTimer = 0; // Resetear temporizador
                    saw.collected = true;
                }
            }
        });
    }

    // Dibujar combate
    drawBattle(config) {
        const { ctx, canvas, player1, player2, saws } = config;
        
        // Limpiar canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar línea de referencia del tamaño mínimo
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Dibujar sierras
        saws.forEach(saw => {
            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.arc(saw.x, saw.y, saw.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Efecto eléctrico
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(saw.x, saw.y, saw.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
        });
        
        // Dibujar player1
        const radius1 = (player1.size / 100) * 20;
        ctx.fillStyle = '#4ecdc4';
        ctx.beginPath();
        ctx.arc(player1.x, player1.y, radius1, 0, Math.PI * 2);
        ctx.fill();
        
        // Efecto de sierras para player1
        if (player1.hasSaws) {
            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(player1.x, player1.y, radius1 + 8, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Dibujar player2
        const radius2 = (player2.size / 100) * 20;
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(player2.x, player2.y, radius2, 0, Math.PI * 2);
        ctx.fill();
        
        // Efecto de sierras para player2
        if (player2.hasSaws) {
            ctx.strokeStyle = '#4ecdc4';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(player2.x, player2.y, radius2 + 8, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    // Finalizar combate
    endBattle(winner) {
        if (this.battleAnimation) {
            cancelAnimationFrame(this.battleAnimation);
        }
        
        // Actualizar match
        const match = this.matches[this.currentMatch];
        match.winner = winner;
        match.completed = true;
        
        // Eliminar perdedor
        const loser = winner.id === match.player1.id ? match.player2 : match.player1;
        loser.eliminated = true;
        
        // Mostrar resultado
        this.showBattleResult(winner);
    }

    // Mostrar resultado del combate
    showBattleResult(winner) {
        document.getElementById('winner-name').textContent = winner.name;
        document.getElementById('winner-stats').innerHTML = `
            <div>Velocidad: ${winner.speed}</div>
            <div>Prob. Sierra: ${winner.sawChance}%</div>
            <div>Tamaño Final: ${Math.round(winner.size)}%</div>
        `;
        
        this.showScreen('result-screen');
        
        // Iniciar temporizador automático si está activado
        if (this.widgetMode) {
            console.log('[AUTO] Mostrando resultado del combate. Ganador:', winner.name);
            this.startAutoResultTimer();
        }
    }

    // Saltar combate
    skipBattle() {
        if (this.battleAnimation) {
            cancelAnimationFrame(this.battleAnimation);
        }
        
        // Simular resultado aleatorio
        const match = this.matches[this.currentMatch];
        const winner = Math.random() > 0.5 ? match.player1 : match.player2;
        const loser = winner.id === match.player1.id ? match.player2 : match.player1;
        
        match.winner = winner;
        match.completed = true;
        loser.eliminated = true;
        
        this.showBattleResult(winner);
    }

    // Siguiente combate
    nextMatch() {
        this.currentMatch++;
        
        if (this.currentMatch >= this.matches.length) {
            this.advanceRound();
        } else {
            if (this.widgetMode) {
                console.log('[AUTO] Siguiente combate');
            }
            this.showScreen('tournament-screen');
            this.updateTournamentDisplay();
            this.prepareNextMatch();
        }
    }

    // Avanzar ronda
    advanceRound() {
        const winners = this.matches.map(match => match.winner);
        if (winners.length === 1) {
            this.showChampion(winners[0]);
        } else {
            if (this.widgetMode) {
                console.log('[AUTO] Avanzando a la siguiente ronda');
            }
            this.players = winners;
            this.currentRound++;
            this.currentMatch = 0;
            this.generateMatches();
            this.showScreen('tournament-screen');
            this.updateTournamentDisplay();
            this.prepareNextMatch();
        }
    }

    // Mostrar campeón
    showChampion(champion = null) {
        if (champion) {
            document.getElementById('champion-name').textContent = champion.name;
        }
        this.showScreen('champion-screen');
        
        // Iniciar temporizador automático si está activado
        if (this.widgetMode) {
            console.log('[AUTO] ¡Campeón del torneo!', champion ? champion.name : '');
            this.startAutoChampionTimer();
        }
    }

    // Resetear juego
    resetGame() {
        this.players = [];
        this.currentRound = 1;
        this.currentMatch = 0;
        this.matches = [];
        this.currentPlayer1 = null;
        this.currentPlayer2 = null;
        this.upgradesUsed = { 1: [], 2: [] };
        
        // Limpiar temporizadores
        if (this.autoTimer) clearInterval(this.autoTimer);
        if (this.resultTimer) clearInterval(this.resultTimer);
        if (this.championTimer) clearInterval(this.championTimer);
        if (this.battleAnimation) {
            cancelAnimationFrame(this.battleAnimation);
        }
        
        // Desactivar modo automático
        this.setWidgetMode(false);
        
        // Ocultar botón de modo automático
        const activateAutoBtn = document.getElementById('activate-auto-mode');
        if (activateAutoBtn) {
            activateAutoBtn.style.display = 'none';
        }
        
        this.showScreen('start-screen');
        this.updatePlayerInputs(4);
    }

    // Mostrar pantalla
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    // ===== MÉTODOS PARA MODO AUTOMÁTICO =====

    // Establecer modo widget
    setWidgetMode(enabled) {
        this.widgetMode = enabled;
        console.log(`[AUTO] Modo automático ${enabled ? 'activado' : 'desactivado'}`);
        
        // Si se activa el modo automático, continuar el flujo
        if (enabled && this.players.length > 0) {
            this.continueAutoFlow();
        }
    }

    // Continuar flujo automático desde el punto actual
    continueAutoFlow() {
        if (!this.widgetMode) return;
        
        console.log('[AUTO] Continuando flujo automático');
        
        // Determinar en qué pantalla estamos y continuar
        const currentScreen = document.querySelector('.screen.active').id;
        
        switch (currentScreen) {
            case 'tournament-screen':
                // Si estamos en la pantalla de torneo, iniciar temporizador de mejoras
                if (this.currentPlayer1 && this.currentPlayer2) {
                    console.log('[AUTO] Iniciando temporizador de mejoras');
                    this.startAutoUpgradeTimer();
                }
                break;
            case 'battle-screen':
                // Si estamos en combate, esperar a que termine
                console.log('[AUTO] Combate en progreso, esperando resultado');
                break;
            case 'result-screen':
                // Si estamos en resultado, iniciar temporizador de resultado
                console.log('[AUTO] Iniciando temporizador de resultado');
                this.startAutoResultTimer();
                break;
            case 'champion-screen':
                // Si estamos en campeón, iniciar temporizador de campeón
                console.log('[AUTO] Iniciando temporizador de campeón');
                this.startAutoChampionTimer();
                break;
        }
    }

    // Iniciar temporizador automático de mejoras
    startAutoUpgradeTimer() {
        if (!this.widgetMode) return;
        
        const timerElement = document.getElementById('decision-timer');
        const startBattleBtn = document.getElementById('start-battle');
        
        if (timerElement) {
            timerElement.style.display = 'block';
            timerElement.style.fontSize = '48px';
            timerElement.style.fontWeight = 'bold';
            timerElement.style.color = '#ff6b6b';
            timerElement.style.background = '#fff';
            timerElement.style.border = '3px solid #4ecdc4';
            timerElement.style.margin = '20px auto';
        }
        
        if (startBattleBtn) startBattleBtn.style.display = 'none';
        
        // Usar configuración de temporizador
        let timeLeft = this.config.timers.autoDecision || 5;
        if (timerElement) timerElement.textContent = timeLeft;
        
        this.autoTimer = setInterval(() => {
            timeLeft--;
            if (timerElement) timerElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(this.autoTimer);
                if (timerElement) timerElement.style.display = 'none';
                if (startBattleBtn) startBattleBtn.style.display = '';
                if (this.widgetMode) {
                    console.log('[AUTO] Aplicando mejoras automáticas');
                }
                this.applyAutoUpgrades();
                setTimeout(() => { this.startBattle(); }, 500);
            }
        }, 1000);
    }

    // Aplicar mejoras automáticas
    applyAutoUpgrades() {
        const upgrades = ['speed', 'saw', 'size'];
        const players = [1, 2];
        
        players.forEach(player => {
            const availableUpgrades = upgrades.filter(upgrade => 
                !this.upgradesUsed[player].includes(upgrade)
            );
            
            if (availableUpgrades.length > 0) {
                const randomUpgrade = availableUpgrades[Math.floor(Math.random() * availableUpgrades.length)];
                this.applyUpgrade(player, randomUpgrade);
            }
        });
    }

    // Iniciar temporizador automático de resultado
    startAutoResultTimer() {
        if (!this.widgetMode) return;
        
        // Usar configuración de temporizador
        let timeLeft = this.config.timers.showResult || 3;
        
        this.resultTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(this.resultTimer);
                if (this.widgetMode) {
                    console.log('[AUTO] Avanzando al siguiente combate o ronda');
                }
                this.nextMatch();
            }
        }, 1000);
    }

    // Iniciar temporizador automático de campeón
    startAutoChampionTimer() {
        if (!this.widgetMode) return;
        
        // Usar configuración de temporizador
        let timeLeft = this.config.timers.showChampion || 10;
        
        this.championTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(this.championTimer);
                if (this.widgetMode) {
                    console.log('[AUTO] Reiniciando torneo');
                }
                this.resetGame();
            }
        }, 1000);
    }

    // Verificar si hay parámetros de URL para iniciar automáticamente
    checkUrlParameters() {
        const urlData = this.readUrlParameters();
        if (urlData && urlData.players.length > 0) {
            console.log('[URL] Participantes detectados en URL:', urlData.players.map(p => p.name));
            
            // Configurar jugadores desde URL
            this.players = urlData.players;
            
            // Generar emparejamientos
            this.generateMatches();
            
            // Mostrar pantalla de torneo
            this.showScreen('tournament-screen');
            this.updateTournamentDisplay();
            this.prepareNextMatch();
            
            // Si autoStart está activado, iniciar modo automático
            if (urlData.autoStart) {
                console.log('[URL] Iniciando modo automático desde URL');
                this.setWidgetMode(true);
                
                // Ocultar controles manuales
                const container = document.getElementById('game-container');
                container.classList.add('widget-mode');
                container.classList.remove('manual-mode');
            }
            
            // Ocultar botón de modo automático si ya está activado
            const activateAutoBtn = document.getElementById('activate-auto-mode');
            if (activateAutoBtn && urlData.autoStart) {
                activateAutoBtn.style.display = 'none';
            }
        }
    }
}

// Inicializar juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new TorneoBolas();
}); 