const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const { ROLES } = require('./roles');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

const PORT = process.env.PORT || 3000;

const ESCENARIOS = [
    { id: 'bg-bosque', nombre: '🌲 BOSQUE BINARIO' },
    { id: 'bg-castillo', nombre: '🏰 CASTILLO DEL KERNEL' },
    { id: 'bg-volcan', nombre: '🌋 VOLCÁN OVERCLOCK' },
    { id: 'bg-mazmorra', nombre: '💀 MAZMORRA ROOT' }
];

const CARGA_CONTRAATAQUE = { facil: 3, medio: 8, dificil: 15 };

// Banco de respaldo local (30 preguntas: 10 Fácil, 10 Medio, 10 Difícil)
const PREGUNTAS_RESPALDO = {
    facil: [
        { pregunta: "¿Qué comando lista los archivos y carpetas del directorio actual en Linux?", opciones: ["cd", "ls", "pwd", "mkdir"], correcta: 1, explicacion: "'ls' lista el contenido del directorio." },
        { pregunta: "¿Qué comando muestra la ruta completa del directorio actual?", opciones: ["pwd", "whoami", "echo", "dir"], correcta: 0, explicacion: "'pwd' significa Print Working Directory." },
        { pregunta: "¿Qué comando se usa en Debian para actualizar la lista de paquetes?", opciones: ["apt upgrade", "apt update", "apt install", "apt clean"], correcta: 1, explicacion: "'apt update' sincroniza el índice de paquetes." },
        { pregunta: "¿Cuál es el usuario administrador con privilegios totales en Linux?", opciones: ["admin", "system", "root", "sudoer"], correcta: 2, explicacion: "'root' es el superusuario del sistema." },
        { pregunta: "¿Qué comando se usa para crear un nuevo directorio en Linux?", opciones: ["touch", "mkdir", "rm", "cp"], correcta: 1, explicacion: "'mkdir' crea carpetas nuevas." },
        { pregunta: "¿Qué comando muestra el contenido de un archivo de texto en la terminal?", opciones: ["cat", "mv", "cd", "ping"], correcta: 0, explicacion: "'cat' muestra el contenido de archivos en pantalla." },
        { pregunta: "¿Qué comando cambia de directorio en la terminal de Linux?", opciones: ["ls", "cd", "chmod", "ps"], correcta: 1, explicacion: "'cd' significa Change Directory." },
        { pregunta: "¿Qué comando elimina un archivo en Linux?", opciones: ["del", "erase", "rm", "rmdir"], correcta: 2, explicacion: "'rm' elimina archivos; con -r elimina carpetas." },
        { pregunta: "¿Qué comando limpia la pantalla de la terminal?", opciones: ["clean", "clear", "cls", "resetall"], correcta: 1, explicacion: "'clear' limpia el texto visible en la terminal." },
        { pregunta: "¿Qué comando muestra el nombre del usuario actual en sesión?", opciones: ["whoami", "hostname", "uname", "id -g"], correcta: 0, explicacion: "'whoami' imprime el usuario efectivo actual." }
    ],
    medio: [
        { pregunta: "¿Qué directorio almacena los archivos de configuración del sistema en Linux?", opciones: ["/bin", "/var", "/etc", "/tmp"], correcta: 2, explicacion: "/etc contiene los archivos de configuración del sistema." },
        { pregunta: "¿Qué comando muestra los procesos activos y uso de CPU en tiempo real?", opciones: ["top", "df -h", "ls -la", "chmod"], correcta: 0, explicacion: "'top' monitorea procesos y recursos en tiempo real." },
        { pregunta: "¿Qué permiso otorga rwx al dueño y solo lectura (r--) a grupo y otros?", opciones: ["chmod 777", "chmod 755", "chmod 744", "chmod 644"], correcta: 2, explicacion: "7 (rwx) dueño, 4 (r--) grupo, 4 (r--) otros." },
        { pregunta: "¿Cuál es la función principal del Kernel en un Sistema Operativo?", opciones: ["Compilar programas en C", "Gestionar el hardware y servir de puente con el software", "Navegar por internet", "Crear documentos de texto"], correcta: 1, explicacion: "El Kernel administra CPU, memoria y dispositivos E/S." },
        { pregunta: "¿Qué comando muestra el espacio libre y usado en los discos montados?", opciones: ["du -a", "df -h", "free -m", "lsblk -f"], correcta: 1, explicacion: "'df -h' muestra el espacio en disco en formato legible." },
        { pregunta: "¿Qué comando muestra la memoria RAM y Swap disponible?", opciones: ["free -h", "top -m", "meminfo", "ram -s"], correcta: 0, explicacion: "'free -h' muestra RAM y Swap." },
        { pregunta: "¿Qué gestor de paquetes de bajo nivel utiliza Debian para archivos .deb?", opciones: ["rpm", "pacman", "dpkg", "yum"], correcta: 2, explicacion: "'dpkg' gestiona paquetes .deb." },
        { pregunta: "¿Qué comando busca una palabra dentro de un archivo de texto?", opciones: ["find", "grep", "locate", "which"], correcta: 1, explicacion: "'grep' busca patrones de texto dentro de archivos." },
        { pregunta: "¿En qué directorio se guardan los logs del sistema en Debian?", opciones: ["/etc/logs", "/var/log", "/usr/log", "/home/logs"], correcta: 1, explicacion: "/var/log almacena los registros del sistema." },
        { pregunta: "¿Qué comando moderno muestra las interfaces y direcciones IP en Debian?", opciones: ["ip a", "netstat -i", "ping -a", "route -n"], correcta: 0, explicacion: "'ip a' muestra las interfaces y direcciones IP." }
    ],
    dificil: [
        { pregunta: "¿Qué es un 'Deadlock' (interbloqueo) en sistemas operativos?", opciones: ["Fallo eléctrico", "Dos o más procesos bloqueados esperando recursos mutuos", "Caché vacía", "Error de sintaxis en Bash"], correcta: 1, explicacion: "Los procesos quedan detenidos esperando recursos que retiene el otro." },
        { pregunta: "¿Qué algoritmo de planificación usa un 'quantum' de tiempo fijo circular?", opciones: ["FCFS", "SJF", "Round Robin", "Prioridad Estricta"], correcta: 2, explicacion: "Round Robin reparte CPU en intervalos iguales (quantums)." },
        { pregunta: "¿Qué diferencia clave tienen los Hilos (Threads) frente a los Procesos?", opciones: ["Comparten el mismo espacio de memoria del proceso padre", "No usan CPU", "Solo hay uno por proceso", "Usan más RAM que un proceso"], correcta: 0, explicacion: "Los hilos comparten código, datos y archivos del proceso padre." },
        { pregunta: "¿Qué señal envía 'kill -9 PID' a un proceso en Linux?", opciones: ["SIGTERM", "SIGKILL (terminación forzada inmediata)", "SIGSTOP", "SIGHUP"], correcta: 1, explicacion: "La señal 9 es SIGKILL y termina el proceso inmediatamente." },
        { pregunta: "¿Qué es una 'Condición de Carrera' (Race Condition)?", opciones: ["Benchmark de CPU", "Resultado dependiente del orden no controlado de hilos", "Ataque DDoS", "Carga de GRUB"], correcta: 1, explicacion: "Ocurre cuando hilos acceden a datos compartidos sin sincronización." },
        { pregunta: "¿Qué mecanismo de sincronización usa un contador para controlar recursos?", opciones: ["Pipe", "Semáforo", "Inodo", "Socket"], correcta: 1, explicacion: "Los semáforos coordinan acceso concurrente con wait/signal." },
        { pregunta: "¿Qué es la 'Paginación' en gestión de memoria?", opciones: ["Dividir memoria en bloques fijos llamados páginas y marcos", "Ordenar archivos", "Comprimir disco", "Ejecutar en segundo plano"], correcta: 0, explicacion: "La paginación evita fragmentación externa usando bloques fijos." },
        { pregunta: "¿Qué ocurre en un 'Page Fault' (Fallo de página)?", opciones: ["Se daña la RAM", "La página no está en RAM y el SO la trae del disco", "Se reinicia la red", "Se cierra la terminal"], correcta: 1, explicacion: "El SO carga la página faltante desde almacenamiento secundario." },
        { pregunta: "¿Qué comando gestiona servicios en Debian con systemd?", opciones: ["servicecfg", "systemctl", "initctl", "daemond"], correcta: 1, explicacion: "'systemctl' controla los servicios de systemd." },
        { pregunta: "¿Qué almacena un 'Inodo' (inode) en Linux (ext4)?", opciones: ["Solo el nombre del archivo", "Metadatos del archivo (permisos, dueño, tamaño, bloques)", "Historial Bash", "Contraseñas"], correcta: 1, explicacion: "El inodo guarda metadatos y punteros a bloques." }
    ]
};

let bancoPreguntas = {
    facil: [...PREGUNTAS_RESPALDO.facil],
    medio: [...PREGUNTAS_RESPALDO.medio],
    dificil: [...PREGUNTAS_RESPALDO.dificil]
};

const LETRA_A_INDICE = { A: 0, B: 1, C: 2, D: 3 };

async function cargarPreguntasDesdeBD() {
    try {
        const [filas] = await db.query(
            'SELECT enunciado, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, dificultad, categoria FROM preguntas'
        );
        if (!Array.isArray(filas) || filas.length === 0) return;

        const agrupadas = { facil: [], medio: [], dificil: [] };
        for (const row of filas) {
            const nivel = ['facil', 'medio', 'dificil'].includes(String(row.dificultad).toLowerCase())
                ? String(row.dificultad).toLowerCase()
                : 'facil';

            const idxCorrecta = typeof row.respuesta_correcta === 'number'
                ? row.respuesta_correcta
                : (LETRA_A_INDICE[String(row.respuesta_correcta || '').trim().toUpperCase()] ?? 0);

            agrupadas[nivel].push({
                pregunta: row.enunciado,
                opciones: [row.opcion_a, row.opcion_b, row.opcion_c, row.opcion_d],
                correcta: idxCorrecta,
                explicacion: `Categoría: ${row.categoria || 'Sistemas Operativos'}.`
            });
        }

        for (const nivel of ['facil', 'medio', 'dificil']) {
            if (agrupadas[nivel].length > 0) {
                bancoPreguntas[nivel] = agrupadas[nivel];
            }
        }
        console.log(`📚 Preguntas cargadas desde MariaDB: ${filas.length} registros.`);
    } catch (err) {
        console.warn('⚠️ Usando banco de preguntas de respaldo:', err.message);
    }
}

async function asegurarUsuarioEnBD(username) {
    try {
        await db.query(
            `INSERT INTO usuarios (username, password_hash, puntos, victorias, derrotas)
             VALUES (?, 'guest_session', 0, 0, 0)
             ON DUPLICATE KEY UPDATE username = username`,
            [username]
        );
        const [rows] = await db.query('SELECT id FROM usuarios WHERE username = ?', [username]);
        return rows[0] ? rows[0].id : null;
    } catch (err) {
        console.error('❌ Error al registrar usuario en MariaDB:', err.message);
        return null;
    }
}

async function registrarResultadoCombateEnBD(ganador, perdedor, puntosGanados = 25) {
    try {
        const ganadorId = ganador ? await asegurarUsuarioEnBD(ganador.nombre) : null;
        const perdedorId = perdedor ? await asegurarUsuarioEnBD(perdedor.nombre) : null;

        if (ganadorId) {
            await db.query(
                'UPDATE usuarios SET puntos = puntos + ?, victorias = victorias + 1 WHERE id = ?',
                [puntosGanados, ganadorId]
            );
        }
        if (perdedorId) {
            await db.query(
                'UPDATE usuarios SET derrotas = derrotas + 1 WHERE id = ?',
                [perdedorId]
            );
        }
        if (ganadorId) {
            await db.query(
                'INSERT INTO combates (jugador1_id, jugador2_id, ganador_id, puntos_ganados) VALUES (?, ?, ?, ?)',
                [ganadorId, perdedorId, ganadorId, puntosGanados]
            );
        }
    } catch (err) {
        console.error('❌ Error al guardar resultado de combate en MariaDB:', err.message);
    }
}

// Endpoint REST para consultar el ranking desde la BD
app.get('/api/ranking', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, username, puntos, victorias, derrotas FROM usuarios ORDER BY puntos DESC, victorias DESC LIMIT 10'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'No se pudo obtener el ranking' });
    }
});

const jugadoresMundo = {};
const salasCombate = {};

function obtenerZona(x) {
    if (x < 266) return 1;
    if (x < 534) return 2;
    return 3;
}

function mezclar(arr) {
    const copia = [...arr];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function randomPregunta(sala, nivel) {
    const fuente = bancoPreguntas[nivel] && bancoPreguntas[nivel].length > 0
        ? bancoPreguntas[nivel]
        : PREGUNTAS_RESPALDO[nivel];

    if (!sala.baraja[nivel] || sala.baraja[nivel].length === 0) {
        sala.baraja[nivel] = mezclar(fuente);
    }
    return sala.baraja[nivel].pop();
}

function limpiarTimerSala(sala) {
    if (sala && sala.timerPregunta) {
        clearInterval(sala.timerPregunta);
        sala.timerPregunta = null;
    }
}

function resetearEstadosCombate(j) {
    const r = ROLES[j.rol];
    j.stats = { ...r.stats };
    j.contraataque = 0;
    j.despertarUsado = false;
    j.despertarTurnos = 0;
    j.tienePasiva = false;
    j.buffAtk = false;
    j.sobrevoltaje = false;
    j.escudoCuantico = false;
    j.buffDefTurnos = 0;
    j.debuffAtkTurnos = 0;
    j.debuffDefTurnos = 0;
    j.debuffVulnTurnos = 0;
    j.debuffRolTurnos = 0;
    j.throttlingTurnos = 0;
    j.corrupcionTurnos = 0;
    j.venenoTurnos = 0;
}

function crearInstanciaCombate(j1, j2, zonaId) {
    const salaId = `duelo_${j1.id}_${j2.id}_${Date.now()}`;
    j1.enCombate = true;
    j2.enCombate = true;
    j1.salaCombate = salaId;
    j2.salaCombate = salaId;

    resetearEstadosCombate(j1);
    resetearEstadosCombate(j2);

    const escenario = ESCENARIOS[Math.floor(Math.random() * ESCENARIOS.length)];
    const sala = {
        salaId,
        zonaId,
        escenario,
        jugadores: [j1, j2],
        turnoIndex: Math.random() < 0.5 ? 0 : 1,
        estado: 'eligiendo',
        accionPendiente: null,
        preguntaActual: null,
        contraataqueInfo: null,
        timerPregunta: null,
        tiempoRestante: 0,
        baraja: { facil: [], medio: [], dificil: [] }
    };

    salasCombate[salaId] = sala;

    const s1 = io.sockets.sockets.get(j1.id);
    const s2 = io.sockets.sockets.get(j2.id);
    if (s1) s1.join(salaId);
    if (s2) s2.join(salaId);

    prepararTurnoSala(sala, `⚔️ ¡DUELO INICIADO en ${escenario.nombre}!`);
}

function emitirEstadoSala(sala, log = '') {
    io.to(sala.salaId).emit('estadoCombate', {
        estado: sala.estado,
        jugadores: sala.jugadores,
        turnoDe: sala.jugadores[sala.turnoIndex].id,
        escenario: sala.escenario,
        log
    });
}

function verificarDespertar(defensor) {
    if (defensor.hp > 0 && (defensor.hp / defensor.hpMax) < 0.25 && !defensor.despertarUsado) {
        defensor.despertarUsado = true;
        defensor.despertarTurnos = 2;
        const postura = ROLES[defensor.rol].posturaDespertar;
        return ` 🔥 ¡DESPERTAR AL BORDE DE LA MUERTE! ${defensor.nombre} activa +20% ${postura} (2T).`;
    }
    return '';
}

function aplicarEfectoAleatorio(activo, oponente) {
    if (Math.random() > 0.30) return '';
    const roll = Math.floor(Math.random() * 6);
    if (roll === 0) {
        activo.sobrevoltaje = true;
        return ' ⚡ [EXTRA] ¡Sobrevoltaje (+20% próx. golpe)!';
    } else if (roll === 1) {
        const c = Math.min(activo.hpMax - activo.hp, 10);
        activo.hp += c;
        return ` 💾 [EXTRA] ¡Caché L1 (+${c} HP)!`;
    } else if (roll === 2) {
        activo.escudoCuantico = true;
        return ' 🔷 [EXTRA] ¡Escudo Cuántico (-10 daño próx. golpe)!';
    } else if (roll === 3) {
        oponente.throttlingTurnos = 2;
        return ` 🌡️ [EXTRA] ¡Throttling a ${oponente.nombre} (-20% ATK, 2T)!`;
    } else if (roll === 4) {
        oponente.hp = Math.max(1, oponente.hp - 8);
        return ` ⚡ [EXTRA] ¡Cortocircuito (-8 HP a ${oponente.nombre})!`;
    } else {
        oponente.corrupcionTurnos = 2;
        return ` 👾 [EXTRA] ¡Corrupción (+15% daño recibido, 2T)!`;
    }
}

function calcularDano(atacante, defensor, tipoDaño, multiplicador = 1.0, perforar = false) {
    const atk = tipoDaño === 'magico' ? atacante.stats.atkMag : atacante.stats.atkFis;
    let def = tipoDaño === 'magico' ? defensor.stats.defMag : defensor.stats.defFis;

    if (perforar) def = Math.round(def * 0.45);
    if (defensor.debuffDefTurnos > 0) def = Math.max(0, Math.round(def * 0.60));

    let bruto = atk * multiplicador;
    if (atacante.buffAtk) { bruto *= 1.40; atacante.buffAtk = false; }
    if (atacante.sobrevoltaje) { bruto *= 1.20; atacante.sobrevoltaje = false; }
    if (atacante.despertarTurnos > 0 && ROLES[atacante.rol].posturaDespertar === 'ATAQUE') bruto *= 1.20;
    if (atacante.debuffAtkTurnos > 0) bruto *= 0.65;
    if (atacante.throttlingTurnos > 0) bruto *= 0.80;
    if (atacante.debuffRolTurnos > 0 && ['santo_espada', 'berserker_carmesi', 'paladin_divino', 'disruptor_arcano', 'francotirador_espiritual', 'caballero_runico'].includes(atacante.rol)) {
        bruto *= 0.70;
    }

    let dano = bruto - (def * 0.55);

    if (defensor.buffDefTurnos > 0) dano *= 0.60;
    if (defensor.despertarTurnos > 0 && ROLES[defensor.rol].posturaDespertar === 'DEFENSA') dano *= 0.80;
    if (defensor.debuffVulnTurnos > 0) dano *= 1.25;
    if (defensor.corrupcionTurnos > 0) dano *= 1.15;
    if (defensor.debuffRolTurnos > 0 && defensor.rol === 'sabio_fuente_unica') dano *= 1.10;
    if (defensor.debuffRolTurnos > 0 && ['mago_elemental', 'maestro_evasion', 'ilusionista_psionico', 'caballero_no_muerto', 'asesino_sombras', 'cazador_sangre', 'fantasma_sin_nombre', 'inquisidor_crepuscular'].includes(defensor.rol)) {
        dano *= 1.20;
    }
    if (defensor.debuffRolTurnos > 0 && ['cuerpo_vajra', 'ciborg_runico'].includes(defensor.rol)) dano += 6;
    if (defensor.escudoCuantico) { dano -= 10; defensor.escudoCuantico = false; }

    return Math.max(5, Math.round(dano));
}

function reducirContadores(j) {
    if (j.buffDefTurnos > 0) j.buffDefTurnos--;
    if (j.debuffAtkTurnos > 0) j.debuffAtkTurnos--;
    if (j.debuffDefTurnos > 0) j.debuffDefTurnos--;
    if (j.debuffVulnTurnos > 0) j.debuffVulnTurnos--;
    if (j.debuffRolTurnos > 0) j.debuffRolTurnos--;
    if (j.throttlingTurnos > 0) j.throttlingTurnos--;
    if (j.corrupcionTurnos > 0) j.corrupcionTurnos--;
    if (j.despertarTurnos > 0) j.despertarTurnos--;
}

function cerrarCombate(sala, ganador, perdedor, motivoExtra = '') {
    limpiarTimerSala(sala);
    sala.estado = 'fin';

    registrarResultadoCombateEnBD(ganador, perdedor, 25);

    io.to(sala.salaId).emit('finDuelo', {
        ganador: ganador.nombre,
        rol: ROLES[ganador.rol].nombre,
        motivo: motivoExtra
    });

    setTimeout(() => {
        if (perdedor && jugadoresMundo[perdedor.id]) {
            perdedor.enCombate = false;
            perdedor.salaCombate = null;
            perdedor.x = 80 + Math.floor(Math.random() * 120);
            perdedor.y = 120 + Math.floor(Math.random() * 200);
            perdedor.zonaId = 1;
            perdedor.hp = Math.max(1, Math.round(perdedor.hpMax * 0.5));
            const sp = io.sockets.sockets.get(perdedor.id);
            if (sp) {
                sp.leave(sala.salaId);
                sp.emit('volverAlMapa', 'Caíste en combate. Reapareces en Ciudad Alianza con 50% HP.');
            }
        }
        if (ganador && jugadoresMundo[ganador.id]) {
            ganador.enCombate = false;
            ganador.salaCombate = null;
            const sg = io.sockets.sockets.get(ganador.id);
            if (sg) {
                sg.leave(sala.salaId);
                sg.emit('volverAlMapa', `🏆 ¡Victoria! Regresas al mapa como vencedor.`);
            }
        }
        delete salasCombate[sala.salaId];
    }, 3000);
}

function prepararTurnoSala(sala, mensajePrevio = '') {
    if (!salasCombate[sala.salaId]) return;
    limpiarTimerSala(sala);
    const activo = sala.jugadores[sala.turnoIndex];
    const oponente = sala.jugadores[1 - sala.turnoIndex];
    let logs = mensajePrevio ? [mensajePrevio] : [];

    if (activo.tienePasiva && activo.rol === 'clerigo_purificador') {
        const curado = Math.min(activo.hpMax - activo.hp, 8);
        activo.hp += curado;
        if (curado > 0) logs.push(`✨ Regeneración Cron: +${curado} HP.`);
    }
    if (activo.debuffRolTurnos > 0 && ['clerigo_purificador', 'tejedor_vacio', 'nigromante_cripta', 'tecnomante'].includes(activo.rol)) {
        activo.hp = Math.max(1, activo.hp - 6);
        logs.push(`☣️ Desgaste de rol: ${activo.nombre} pierde 6 HP.`);
    }
    if (activo.venenoTurnos > 0) {
        activo.hp = Math.max(0, activo.hp - 9);
        activo.venenoTurnos--;
        logs.push(`☠️ Veneno/Desgaste: ${activo.nombre} pierde 9 HP.`);
        if (activo.hp <= 0) {
            emitirEstadoSala(sala, logs.join(' '));
            cerrarCombate(sala, oponente, activo);
            return;
        }
    }

    const probOraculo = sala.zonaId === 3 ? 0.65 : 0.40;
    if (!activo.tienePasiva && Math.random() < probOraculo) {
        sala.estado = 'evento_pasiva';
        emitirEstadoSala(sala, logs.join(' ') + ` 🌟 ¡Oráculo del Sistema ante ${activo.nombre}!`);
        io.to(activo.id).emit('eventoPasiva', {
            pasiva: ROLES[activo.rol].pasiva,
            debuff: ROLES[activo.rol].debuffFallo
        });
    } else {
        sala.estado = 'eligiendo';
        emitirEstadoSala(sala, logs.join(' ') + ` ▶ Turno de ${activo.nombre}.`);
    }
}

function finalizarTurnoSala(sala, log, explicacion = null, efecto = null) {
    limpiarTimerSala(sala);
    const activo = sala.jugadores[sala.turnoIndex];
    const oponente = sala.jugadores[1 - sala.turnoIndex];

    reducirContadores(activo);
    io.to(sala.salaId).emit('resultadoAccion', { log, explicacion, jugadores: sala.jugadores, efecto });

    if (oponente.hp <= 0 || activo.hp <= 0) {
        const ganador = oponente.hp <= 0 ? activo : oponente;
        const perdedor = ganador === activo ? oponente : activo;
        setTimeout(() => cerrarCombate(sala, ganador, perdedor), 1800);
        return;
    }

    setTimeout(() => {
        if (!salasCombate[sala.salaId]) return;
        sala.turnoIndex = 1 - sala.turnoIndex;
        prepararTurnoSala(sala);
    }, explicacion ? 2800 : 1600);
}

function iniciarTimer10sSala(sala, callbackTimeout) {
    limpiarTimerSala(sala);
    sala.tiempoRestante = 10;
    io.to(sala.salaId).emit('tickTiempo', sala.tiempoRestante);
    sala.timerPregunta = setInterval(() => {
        sala.tiempoRestante--;
        io.to(sala.salaId).emit('tickTiempo', sala.tiempoRestante);
        if (sala.tiempoRestante <= 0) callbackTimeout();
    }, 1000);
}

function procesarContraataqueSala(sala, idx, porTiempo = false) {
    if (sala.estado !== 'contraataque' || !sala.contraataqueInfo) return;
    limpiarTimerSala(sala);

    const defensor = sala.jugadores[sala.contraataqueInfo.defensorIdx];
    const atacanteOriginal = sala.jugadores[1 - sala.contraataqueInfo.defensorIdx];
    const esCorrecta = (!porTiempo && idx === sala.preguntaActual.correcta);

    let log = '';
    let efecto = { tipo: 'fallo', objetivoId: defensor.id, texto: '❌ CONTRA FALLIDO' };

    if (esCorrecta) {
        const tipo = ROLES[defensor.rol].tipoBasico;
        const mult = sala.contraataqueInfo.completo ? 1.35 : 0.65;
        const dano = calcularDano(defensor, atacanteOriginal, tipo, mult);
        atacanteOriginal.hp = Math.max(0, atacanteOriginal.hp - dano);

        const etiqueta = sala.contraataqueInfo.completo ? 'CONTRAATAQUE TOTAL (100%)' : 'CONTRAATAQUE PARCIAL';
        log = `⚡ ¡${defensor.nombre} ejecuta ${etiqueta} e inflige ${dano} de daño!`;
        log += verificarDespertar(atacanteOriginal);
        efecto = { tipo: 'ataque', objetivoId: atacanteOriginal.id, texto: `⚡ -${dano} HP` };
    } else {
        log = `❌ ${defensor.nombre} falló el contraataque.`;
    }

    sala.contraataqueInfo = null;
    finalizarTurnoSala(sala, log, sala.preguntaActual.explicacion, efecto);
}

function procesarRespuestaSala(sala, idx, porTiempo = false) {
    if (sala.estado !== 'respondiendo') return;
    limpiarTimerSala(sala);

    const activo = sala.jugadores[sala.turnoIndex];
    const oponente = sala.jugadores[1 - sala.turnoIndex];
    const esCorrecta = (!porTiempo && idx === sala.preguntaActual.correcta);

    if (sala.accionPendiente.tipo === 'pasiva') {
        if (esCorrecta) {
            activo.tienePasiva = true;
            const rId = activo.rol;
            if (rId === 'sabio_fuente_unica') { activo.stats.atkFis += 6; activo.stats.atkMag += 6; }
            else if (['cuerpo_vajra', 'ciborg_runico'].includes(rId)) { activo.stats.defFis += 4; activo.stats.defMag += 4; }
            else if (['mago_elemental', 'tejedor_vacio', 'nigromante_cripta'].includes(rId)) activo.stats.atkMag += 5;
            else if (rId === 'disruptor_arcano') activo.stats.defMag += 5;
            else if (['ilusionista_psionico', 'inquisidor_crepuscular'].includes(rId)) { activo.stats.atkMag += 4; activo.stats.defMag += 3; }
            else if (rId === 'tecnomante') { activo.stats.atkMag += 4; activo.stats.atkFis += 3; }
            else if (rId === 'caballero_runico') { activo.stats.atkFis += 3; activo.stats.atkMag += 3; }
            else if (rId === 'paladin_divino') { activo.stats.defFis += 4; activo.stats.atkFis += 3; }
            else if (rId === 'cazador_sangre') { activo.stats.atkFis += 4; activo.stats.defFis += 3; }
            else if (rId !== 'clerigo_purificador' && rId !== 'maestro_evasion') activo.stats.atkFis += 5;

            sala.estado = 'eligiendo';
            io.to(sala.salaId).emit('efectoVisual', { tipo: 'buff', texto: `★ ${ROLES[rId].pasiva.nombre}` });
            emitirEstadoSala(sala, `🌟 ¡CORRECTO! ${activo.nombre} obtiene [${ROLES[rId].pasiva.nombre}]. Elige tu acción.`);
        } else {
            activo.debuffRolTurnos = 2;
            sala.estado = 'eligiendo';
            const motivo = porTiempo ? '⏰ ¡TIEMPO!' : '💀 ¡FALLÓ!';
            io.to(sala.salaId).emit('efectoVisual', { tipo: 'debuff', texto: `☣️ ${ROLES[activo.rol].debuffFallo.nombre}` });
            emitirEstadoSala(sala, `${motivo} ${activo.nombre} sufre [${ROLES[activo.rol].debuffFallo.nombre}] (2T). Elige tu acción.`);
        }
        return;
    }

    const hab = sala.accionPendiente.hab;

    if (!esCorrecta) {
        let carga = CARGA_CONTRAATAQUE[hab.dificultad] || 8;
        if (oponente.tienePasiva && oponente.rol === 'maestro_evasion') carga += 10;
        oponente.contraataque = Math.min(100, oponente.contraataque + carga);

        const esCompleto = oponente.contraataque >= 100;
        const activaParcial = !esCompleto && (Math.random() * 100 < oponente.contraataque);

        if (esCompleto || activaParcial) {
            if (esCompleto) oponente.contraataque = 0;
            sala.estado = 'contraataque';
            sala.contraataqueInfo = { defensorIdx: 1 - sala.turnoIndex, completo: esCompleto };

            const tituloContra = esCompleto ? '🔥 ¡CONTRAATAQUE TOTAL (100%)!' : '⚡ ¡CONTRAATAQUE PARCIAL!';
            io.to(sala.salaId).emit('resultadoAccion', {
                log: `❌ ${activo.nombre} falló ${hab.nombre}. ${oponente.nombre} (+${carga}%) ¡ACTIVA ${tituloContra}!`,
                explicacion: null,
                jugadores: sala.jugadores,
                efecto: { tipo: 'buff', texto: esCompleto ? '🔥 CONTRA 100%' : '⚡ CONTRAATAQUE' }
            });

            io.to(oponente.id).emit('mostrarPregunta', {
                titulo: tituloContra,
                dificultad: hab.dificultad.toUpperCase(),
                pregunta: sala.preguntaActual.pregunta,
                opciones: sala.preguntaActual.opciones,
                conTiempo: true
            });
            io.to(activo.id).emit('oponenteOcupado', `⚡ ${oponente.nombre} está ejecutando un CONTRAATAQUE...`);
            iniciarTimer10sSala(sala, () => procesarContraataqueSala(sala, -1, true));
            return;
        }

        const motivo = porTiempo ? '⏰ ¡Tiempo agotado!' : '❌ Falló';
        finalizarTurnoSala(
            sala,
            `${motivo} ${activo.nombre} falló ${hab.nombre}. ${oponente.nombre} +${carga}% contraataque (${oponente.contraataque}%).`,
            sala.preguntaActual.explicacion,
            { tipo: 'fallo', texto: '❌ FALLO' }
        );
        return;
    }

    let log = '';
    let efecto = { tipo: 'buff', texto: '✨ ÉXITO' };

    if (hab.tipo === 'ataque' || hab.tipo === 'perforar') {
        const dano = calcularDano(activo, oponente, hab.dañoTipo, hab.mult, hab.tipo === 'perforar');
        oponente.hp = Math.max(0, oponente.hp - dano);
        log = `💥 ¡${activo.nombre} usa ${hab.nombre}${hab.tipo === 'perforar' ? ' (PERFORA)' : ''} e inflige ${dano} de daño!`;
        log += verificarDespertar(oponente);
        efecto = { tipo: 'ataque', texto: `-${dano} HP` };
    } else if (hab.tipo === 'robo_vida') {
        const dano = calcularDano(activo, oponente, hab.dañoTipo, hab.mult);
        oponente.hp = Math.max(0, oponente.hp - dano);
        const curado = Math.min(activo.hpMax - activo.hp, Math.round(dano * 0.55));
        activo.hp += curado;
        log = `🩸 ¡${activo.nombre} usa ${hab.nombre}: ${dano} daño y absorbe +${curado} HP!`;
        log += verificarDespertar(oponente);
        efecto = { tipo: 'ataque', texto: `-${dano} / +${curado}` };
    } else if (hab.tipo === 'buff_atk') {
        activo.buffAtk = true;
        log = `⚡ ¡${activo.nombre} activa ${hab.nombre}! (+40% daño próx. golpe).`;
        efecto = { tipo: 'buff', texto: '⚡ ATK +40%' };
    } else if (hab.tipo === 'buff_def') {
        activo.buffDefTurnos = 2;
        log = `🛡️ ¡${activo.nombre} levanta ${hab.nombre}! (-40% daño recibido, 2T).`;
        efecto = { tipo: 'buff', texto: '🛡️ DEF +40%' };
    } else if (hab.tipo === 'cura') {
        const curado = Math.min(activo.hpMax - activo.hp, hab.cura);
        activo.hp += curado;
        log = `💚 ¡${activo.nombre} usa ${hab.nombre} y recupera ${curado} HP!`;
        efecto = { tipo: 'cura', texto: `+${curado} HP` };
    } else if (hab.tipo === 'cura_def') {
        const curado = Math.min(activo.hpMax - activo.hp, hab.cura);
        activo.hp += curado;
        activo.buffDefTurnos = 2;
        log = `🛡️ ¡${activo.nombre} usa ${hab.nombre}: +${curado} HP y Escudo (-40% daño)!`;
        efecto = { tipo: 'cura', texto: `+${curado} HP 🛡️` };
    } else if (hab.tipo === 'cura_buff') {
        const curado = Math.min(activo.hpMax - activo.hp, hab.cura);
        activo.hp += curado;
        activo.buffAtk = true;
        log = `✨ ¡${activo.nombre} usa ${hab.nombre}: +${curado} HP y +40% próx. ataque!`;
        efecto = { tipo: 'cura', texto: `+${curado} HP ⚡` };
    } else if (hab.tipo === 'debuff_atk') {
        oponente.debuffAtkTurnos = 2;
        log = `🌀 ¡${activo.nombre} aplica ${hab.nombre}! Ataque rival -35% (2T).`;
        efecto = { tipo: 'debuff', texto: '🌀 ATK -35%' };
    } else if (hab.tipo === 'debuff_def') {
        oponente.debuffDefTurnos = 2;
        log = `🔻 ¡${activo.nombre} aplica ${hab.nombre}! Defensas rivales -40% (2T).`;
        efecto = { tipo: 'debuff', texto: '🔻 DEF -40%' };
    } else if (hab.tipo === 'debuff_vuln') {
        oponente.debuffVulnTurnos = 2;
        log = `🎯 ¡${activo.nombre} aplica ${hab.nombre}! Rival vulnerable (+25% daño, 2T).`;
        efecto = { tipo: 'debuff', texto: '🎯 VULNERABLE' };
    } else if (hab.tipo === 'veneno') {
        oponente.venenoTurnos = 3;
        log = `☠️ ¡${activo.nombre} aplica ${hab.nombre}! Rival pierde 9 HP por 3 turnos.`;
        efecto = { tipo: 'debuff', texto: '☠️ VENENO (3T)' };
    } else if (hab.tipo === 'purgar') {
        oponente.buffAtk = false;
        oponente.buffDefTurnos = 0;
        oponente.sobrevoltaje = false;
        oponente.escudoCuantico = false;
        log = `✨ ¡${activo.nombre} usa ${hab.nombre} y PURGA todos los buffs de ${oponente.nombre}!`;
        efecto = { tipo: 'debuff', texto: '✨ PURGADO' };
    }

    log += aplicarEfectoAleatorio(activo, oponente);
    finalizarTurnoSala(sala, log, sala.preguntaActual.explicacion, efecto);
}

setInterval(() => {
    const lista = Object.values(jugadoresMundo).map(j => ({
        id: j.id,
        nombre: j.nombre,
        faccion: j.faccion,
        rol: j.rol,
        rolNombre: j.rolNombre,
        rama: j.rama,
        icono: j.icono,
        color: j.color,
        x: j.x,
        y: j.y,
        zonaId: j.zonaId,
        hp: j.hp,
        hpMax: j.hpMax,
        enCombate: j.enCombate
    }));
    io.emit('estadoMundo', lista);
}, 50);

io.on('connection', (socket) => {
    socket.emit('catalogoRoles', ROLES);

    socket.on('entrarMundo', async ({ nombre, faccion, rol }) => {
        let rolValido = (ROLES[rol] && !ROLES[rol].oculta) ? rol : 'paladin_divino';
        let esClaseOculta = false;

        if (Math.random() < 0.01) {
            rolValido = 'sabio_fuente_unica';
            esClaseOculta = true;
        }

        const r = ROLES[rolValido];
        const facValida = faccion === 'RENEGADOS' ? 'RENEGADOS' : 'ALIANZA';
        const nombreLimpio = (nombre || '').trim().substring(0, 12) || `Heroe${Math.floor(Math.random() * 99)}`;

        await asegurarUsuarioEnBD(nombreLimpio);

        const jugador = {
            id: socket.id,
            nombre: nombreLimpio,
            faccion: facValida,
            rol: rolValido,
            rolNombre: r.nombre,
            rama: r.rama,
            icono: r.icono,
            color: r.color,
            color2: r.color2,
            hpMax: r.hpMax,
            hp: r.hpMax,
            stats: { ...r.stats },
            menu: r.menu,
            pasivaInfo: r.pasiva,
            x: 80 + Math.floor(Math.random() * 140),
            y: 120 + Math.floor(Math.random() * 200),
            zonaId: 1,
            enCombate: false,
            salaCombate: null
        };
        resetearEstadosCombate(jugador);
        jugadoresMundo[socket.id] = jugador;

        socket.emit('ingresoExitoso', jugador);

        if (esClaseOculta) {
            io.emit('avisoMundo', `👑 ¡EVENTO 1%! ${jugador.nombre} ha despertado la Clase Oculta: SABIO DE LA FUENTE ÚNICA!`);
        }
    });

    socket.on('mover', ({ dx, dy }) => {
        const j = jugadoresMundo[socket.id];
        if (!j || j.enCombate) return;

        const vel = 6;
        const nx = Math.max(24, Math.min(776, j.x + (Math.sign(dx) * vel)));
        const ny = Math.max(30, Math.min(410, j.y + (Math.sign(dy) * vel)));
        j.x = nx;
        j.y = ny;
        j.zonaId = obtenerZona(nx);
    });

    socket.on('descansar', () => {
        const j = jugadoresMundo[socket.id];
        if (!j || j.enCombate || j.zonaId !== 1) return;
        j.hp = j.hpMax;
        socket.emit('avisoMundo', '💚 Has descansado en Ciudad Alianza. HP restaurado al 100%.');
    });

    socket.on('retarJugador', (objetivoId) => {
        const retador = jugadoresMundo[socket.id];
        const objetivo = jugadoresMundo[objetivoId];
        if (!retador || !objetivo || retador.id === objetivo.id) return;
        if (retador.enCombate || objetivo.enCombate) {
            socket.emit('avisoMundo', '⚠️ Ese jugador ya está en combate.');
            return;
        }
        if (retador.zonaId === 1 || objetivo.zonaId === 1) {
            socket.emit('avisoMundo', '🛡️ Ciudad Alianza es Zona Segura (PvP desactivado).');
            return;
        }
        if (retador.zonaId === 2 && retador.faccion === objetivo.faccion) {
            socket.emit('avisoMundo', '🤝 En Territorio Belicista solo puedes retar a la facción rival.');
            return;
        }

        const dist = Math.hypot(retador.x - objetivo.x, retador.y - objetivo.y);
        if (dist > 95) {
            socket.emit('avisoMundo', '⚠️ Acércate más para iniciar el combate.');
            return;
        }

        crearInstanciaCombate(retador, objetivo, retador.zonaId);
    });

    socket.on('reaccion', (mensaje) => {
        const j = jugadoresMundo[socket.id];
        if (!j || !j.salaCombate) return;
        io.to(j.salaCombate).emit('mostrarReaccion', {
            autor: j.nombre,
            texto: String(mensaje || '').substring(0, 24)
        });
    });

    socket.on('decisionPasiva', (aceptar) => {
        const j = jugadoresMundo[socket.id];
        if (!j || !j.salaCombate) return;
        const sala = salasCombate[j.salaCombate];
        if (!sala || sala.estado !== 'evento_pasiva') return;
        const activo = sala.jugadores[sala.turnoIndex];
        if (activo.id !== socket.id) return;

        if (!aceptar) {
            sala.estado = 'eligiendo';
            emitirEstadoSala(sala, `${activo.nombre} saltó el reto del Oráculo. Elige tu acción.`);
            return;
        }

        sala.accionPendiente = { tipo: 'pasiva', nivel: 'medio' };
        sala.preguntaActual = randomPregunta(sala, 'medio');
        sala.estado = 'respondiendo';

        socket.emit('mostrarPregunta', {
            titulo: `🌟 PASIVA (${ROLES[activo.rol].pasiva.nombre})`,
            dificultad: 'MEDIO',
            pregunta: sala.preguntaActual.pregunta,
            opciones: sala.preguntaActual.opciones,
            conTiempo: true
        });
        socket.to(sala.salaId).emit('oponenteOcupado', `${activo.nombre} aceptó el Reto de Pasiva (10s)...`);
        iniciarTimer10sSala(sala, () => procesarRespuestaSala(sala, -1, true));
    });

    socket.on('ejecutarOpcion', ({ categoria, indice }) => {
        const j = jugadoresMundo[socket.id];
        if (!j || !j.salaCombate) return;
        const sala = salasCombate[j.salaCombate];
        if (!sala || sala.estado !== 'eligiendo') return;
        const activo = sala.jugadores[sala.turnoIndex];
        const oponente = sala.jugadores[1 - sala.turnoIndex];
        if (activo.id !== socket.id) return;

        const lista = ROLES[activo.rol].menu[categoria];
        if (!lista || !lista[indice]) return;
        const hab = lista[indice];

        if (hab.libre) {
            const dano = calcularDano(activo, oponente, hab.dañoTipo, hab.mult);
            oponente.hp = Math.max(0, oponente.hp - dano);
            let log = `⚔️ ${activo.nombre} usa ${hab.nombre} (${hab.dañoTipo}) e inflige ${dano} de daño.`;
            log += verificarDespertar(oponente);
            finalizarTurnoSala(sala, log, null, { tipo: 'ataque', texto: `-${dano} HP` });
            return;
        }

        sala.accionPendiente = { tipo: 'habilidad', categoria, hab };
        sala.preguntaActual = randomPregunta(sala, hab.dificultad);
        sala.estado = 'respondiendo';

        socket.emit('mostrarPregunta', {
            titulo: hab.nombre,
            dificultad: hab.dificultad.toUpperCase(),
            pregunta: sala.preguntaActual.pregunta,
            opciones: sala.preguntaActual.opciones,
            conTiempo: !!hab.esBuffDebuff
        });
        socket.to(sala.salaId).emit('oponenteOcupado', `${activo.nombre} prepara ${hab.nombre} [${hab.dificultad.toUpperCase()}]...`);

        if (hab.esBuffDebuff) iniciarTimer10sSala(sala, () => procesarRespuestaSala(sala, -1, true));
    });

    socket.on('responder', (idx) => {
        const j = jugadoresMundo[socket.id];
        if (!j || !j.salaCombate) return;
        const sala = salasCombate[j.salaCombate];
        if (!sala) return;

        if (sala.estado === 'contraataque' && sala.contraataqueInfo) {
            const defensor = sala.jugadores[sala.contraataqueInfo.defensorIdx];
            if (defensor.id === socket.id) procesarContraataqueSala(sala, idx, false);
            return;
        }

        const activo = sala.jugadores[sala.turnoIndex];
        if (activo.id === socket.id) procesarRespuestaSala(sala, idx, false);
    });

    socket.on('disconnect', () => {
        const j = jugadoresMundo[socket.id];
        if (!j) return;

        if (j.salaCombate && salasCombate[j.salaCombate]) {
            const sala = salasCombate[j.salaCombate];
            const rival = sala.jugadores.find(p => p.id !== socket.id);
            if (rival) cerrarCombate(sala, rival, j, `${j.nombre} se desconectó del duelo.`);
        }
        delete jugadoresMundo[socket.id];
    });
});

cargarPreguntasDesdeBD().finally(() => {
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`🐉 KERNEL QUEST v2.0 activo en http://localhost:${PORT}`);
    });
});