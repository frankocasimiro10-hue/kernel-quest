const socket = io();

// Generador de sprites pixel-art SVG por rama + Clase Oculta
function generarSpriteSVG(rama, c1 = '#adb5bd', c2 = '#ffd166') {
    if (rama === 'oculta') {
        return `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="1" width="8" height="2" fill="#ffd700"/>
            <rect x="5" y="3" width="6" height="4" fill="#ffffff"/>
            <rect x="6" y="4" width="1" height="1" fill="#66fcf1"/><rect x="9" y="4" width="1" height="1" fill="#66fcf1"/>
            <rect x="3" y="7" width="10" height="6" fill="#ffd700"/>
            <rect x="6" y="8" width="4" height="4" fill="#66fcf1"/>
            <rect x="1" y="5" width="2" height="7" fill="#66fcf1"/><rect x="13" y="5" width="2" height="7" fill="#66fcf1"/>
            <rect x="5" y="13" width="2" height="2" fill="#fff"/><rect x="9" y="13" width="2" height="2" fill="#fff"/>
        </svg>`;
    }
    if (rama === 'arcana') {
        return `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="1" width="4" height="2" fill="${c1}"/><rect x="4" y="3" width="8" height="2" fill="${c1}"/>
            <rect x="3" y="5" width="10" height="1" fill="${c2}"/><rect x="5" y="6" width="6" height="3" fill="#1d1e2c"/>
            <rect x="6" y="7" width="1" height="1" fill="${c2}"/><rect x="9" y="7" width="1" height="1" fill="${c2}"/>
            <rect x="4" y="9" width="8" height="5" fill="${c1}"/><rect x="7" y="9" width="2" height="5" fill="${c2}"/>
            <rect x="13" y="4" width="1" height="10" fill="#8d5524"/><rect x="12" y="2" width="3" height="2" fill="${c2}"/>
        </svg>`;
    }
    if (rama === 'sigilo') {
        return `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="2" width="6" height="4" fill="${c1}"/><rect x="6" y="4" width="4" height="1" fill="${c2}"/>
            <rect x="4" y="6" width="8" height="6" fill="${c1}"/><rect x="5" y="7" width="6" height="2" fill="${c2}"/>
            <rect x="1" y="8" width="3" height="1" fill="#e0e1dd"/><rect x="12" y="8" width="3" height="1" fill="#e0e1dd"/>
            <rect x="5" y="12" width="2" height="3" fill="#222"/><rect x="9" y="12" width="2" height="3" fill="#222"/>
        </svg>`;
    }
    if (rama === 'sagrada') {
        return `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="1" width="6" height="1" fill="${c2}"/><rect x="5" y="3" width="6" height="4" fill="${c1}"/>
            <rect x="6" y="4" width="1" height="1" fill="#111"/><rect x="9" y="4" width="1" height="1" fill="#111"/>
            <rect x="4" y="7" width="8" height="6" fill="${c1}"/><rect x="7" y="8" width="2" height="4" fill="${c2}"/>
            <rect x="6" y="9" width="4" height="2" fill="${c2}"/><rect x="13" y="3" width="1" height="11" fill="${c2}"/>
            <rect x="5" y="13" width="2" height="2" fill="#333"/><rect x="9" y="13" width="2" height="2" fill="#333"/>
        </svg>`;
    }
    if (rama === 'hibrida') {
        return `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="2" width="6" height="4" fill="${c1}"/><rect x="6" y="3" width="4" height="1" fill="${c2}"/>
            <rect x="4" y="6" width="8" height="6" fill="${c1}"/><rect x="6" y="7" width="4" height="3" fill="${c2}"/>
            <rect x="12" y="6" width="3" height="2" fill="${c2}"/><rect x="2" y="7" width="2" height="4" fill="#555"/>
            <rect x="5" y="12" width="2" height="3" fill="#222"/><rect x="9" y="12" width="2" height="3" fill="#222"/>
        </svg>`;
    }
    return `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="1" width="4" height="2" fill="${c2}"/><rect x="5" y="3" width="6" height="4" fill="${c1}"/>
        <rect x="6" y="4" width="4" height="1" fill="#111"/><rect x="4" y="7" width="8" height="5" fill="${c1}"/>
        <rect x="6" y="8" width="4" height="3" fill="${c2}"/><rect x="12" y="4" width="2" height="7" fill="#f1faee"/>
        <rect x="11" y="10" width="4" height="1" fill="${c2}"/><rect x="5" y="12" width="2" height="3" fill="#222"/>
        <rect x="9" y="12" width="2" height="3" fill="#222"/>
    </svg>`;
}

const pantallas = {
    login: document.getElementById('pantalla-login'),
    mundo: document.getElementById('pantalla-mundo'),
    combate: document.getElementById('pantalla-combate')
};

let CATALOGO_ROLES = {};
let ramaActual = 'marcial';
let rolSeleccionado = 'cuerpo_vajra';
let faccionSeleccionada = 'ALIANZA';
let miMenu = null;
let jugadoresEnMapa = [];
let objetivoCercano = null;
let enMapaActivo = false;

// ================= PANTALLA DE ACCESO (20 ROLES + LORE) =================
function mostrarPantalla(nombre) {
    Object.values(pantallas).forEach(p => p.classList.remove('activa'));
    pantallas[nombre].classList.add('activa');
    enMapaActivo = (nombre === 'mundo');
}

function actualizarPanelLore(rolId) {
    const r = CATALOGO_ROLES[rolId];
    if (!r) return;
    document.getElementById('lore-titulo').textContent = `${r.icono} ${r.nombre.toUpperCase()}`;
    document.getElementById('lore-arquetipo').textContent = r.arquetipo.toUpperCase();
    document.getElementById('lore-texto').textContent = r.lore;
    document.getElementById('lore-pasiva').textContent =
        `★ Pasiva: ${r.pasiva.nombre} (${r.pasiva.desc}) · Despertar <25% HP: +20% ${r.posturaDespertar}`;
}

function renderizarGridRoles(rama) {
    const grid = document.getElementById('grid-roles');
    grid.innerHTML = '';
    const filtrados = Object.values(CATALOGO_ROLES).filter(r => r.rama === rama && !r.oculta);

    filtrados.forEach((r, idx) => {
        if (idx === 0 && !filtrados.some(x => x.id === rolSeleccionado)) {
            rolSeleccionado = r.id;
        }
        const btn = document.createElement('button');
        btn.className = `btn-rol ${r.id === rolSeleccionado ? 'activo' : ''}`;
        btn.innerHTML = `
            <div class="rol-sprite">${generarSpriteSVG(r.rama, r.color, r.color2)}</div>
            <strong>${r.nombre}</strong>
            <small>HP:${r.hpMax}<br>AF:${r.stats.atkFis} AM:${r.stats.atkMag}<br>DF:${r.stats.defFis} DM:${r.stats.defMag}</small>
        `;
        btn.onclick = () => {
            rolSeleccionado = r.id;
            renderizarGridRoles(rama);
            actualizarPanelLore(r.id);
        };
        grid.appendChild(btn);
    });
    actualizarPanelLore(rolSeleccionado);
}

document.querySelectorAll('.btn-fac').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-fac').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        faccionSeleccionada = btn.dataset.faccion;
    });
});

document.querySelectorAll('.tab-rama').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab-rama').forEach(t => t.classList.remove('activo'));
        tab.classList.add('activo');
        ramaActual = tab.dataset.rama;
        renderizarGridRoles(ramaActual);
    });
});

document.getElementById('btn-unirse').addEventListener('click', () => {
    const nombre = document.getElementById('input-nombre').value.trim();
    if (!nombre) {
        document.getElementById('error-login').textContent = 'INGRESA UN ALIAS';
        return;
    }
    document.getElementById('error-login').textContent = '';
    socket.emit('entrarMundo', { nombre, faccion: faccionSeleccionada, rol: rolSeleccionado });
});

socket.on('catalogoRoles', (roles) => {
    CATALOGO_ROLES = roles;
    renderizarGridRoles(ramaActual);
});

socket.on('ingresoExitoso', (jugador) => {
    miMenu = jugador.menu;
    mostrarPantalla('mundo');
    if (jugador.rol === 'sabio_fuente_unica') {
        mostrarAvisoMundo(`👑 ¡SUERTE 1%! Despertaste la Clase Oculta: ${jugador.rolNombre.toUpperCase()}!`);
    } else {
        mostrarAvisoMundo(`Bienvenido a la Era del Caos, ${jugador.nombre}.`);
    }
});

// ================= MUNDO ABIERTO 2D (INDIE PIXEL-ART) =================
const canvas = document.getElementById('mapa-canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const teclas = {};
const spriteCache = {};
const posAnteriores = {};

// Convertir el SVG de cada rol en una imagen cacheada para dibujarla en el Canvas
function obtenerSpriteImagen(p) {
    const clave = p.rol || p.rama;
    if (spriteCache[clave]) return spriteCache[clave];

    const infoRol = CATALOGO_ROLES[p.rol];
    const c1 = (infoRol && infoRol.color) || p.color || '#adb5bd';
    const c2 = (infoRol && infoRol.color2) || '#ffd166';
    const svgStr = generarSpriteSVG(p.rama, c1, c2);

    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
    spriteCache[clave] = img;
    return img;
}

// Generar el mapa base estático una sola vez en un canvas oculto (60 FPS constantes)
const mapaBaseCanvas = document.createElement('canvas');
mapaBaseCanvas.width = 800;
mapaBaseCanvas.height = 440;
const bCtx = mapaBaseCanvas.getContext('2d');

function generarMapaBase() {
    const T = 16;
    const hash = (x, y) => Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;

    // 1. Suelo base por bioma (Tiles 16x16)
    for (let y = 0; y < 440; y += T) {
        for (let x = 0; x < 800; x += T) {
            const r = hash(x, y);
            if (x < 266) {
                bCtx.fillStyle = r > 0.7 ? '#1f4d36' : (r > 0.35 ? '#1a422e' : '#163827');
                bCtx.fillRect(x, y, T, T);
                if (r > 0.85) {
                    bCtx.fillStyle = r > 0.93 ? '#ffd166' : '#2d6a4f';
                    bCtx.fillRect(x + 4, y + 6, 3, 3);
                }
            } else if (x < 534) {
                bCtx.fillStyle = r > 0.7 ? '#342c3d' : (r > 0.35 ? '#2c2536' : '#251f2e');
                bCtx.fillRect(x, y, T, T);
                if (r > 0.82) {
                    bCtx.fillStyle = '#453b52';
                    bCtx.fillRect(x + 6, y + 5, 4, 2);
                }
            } else {
                bCtx.fillStyle = r > 0.7 ? '#2b1318' : (r > 0.35 ? '#220e13' : '#1a0a0e');
                bCtx.fillRect(x, y, T, T);
                if (r > 0.88) {
                    bCtx.fillStyle = '#5c1926';
                    bCtx.fillRect(x + 3, y + 8, 6, 2);
                }
            }
        }
    }

    // 2. Camino principal conectando las 3 zonas
    for (let x = 30; x < 760; x += 12) {
        const yCamino = 215 + Math.sin(x * 0.015) * 14;
        bCtx.fillStyle = x < 266 ? '#4a5568' : (x < 534 ? '#4a3f35' : '#3a232b');
        bCtx.fillRect(x, yCamino - 18, 11, 36);
        bCtx.fillStyle = x < 266 ? '#718096' : (x < 534 ? '#5c4d42' : '#4f2c38');
        bCtx.fillRect(x + 2, yCamino - 14, 7, 10);
        bCtx.fillRect(x + 1, yCamino + 2, 8, 11);
    }

    // 3. Plaza de Ciudad Alianza + Casas + Árboles
    bCtx.fillStyle = '#3b4252';
    bCtx.fillRect(80, 170, 100, 100);
    bCtx.strokeStyle = '#6272a4';
    bCtx.lineWidth = 2;
    bCtx.strokeRect(80, 170, 100, 100);

    const dibujarCasa = (cx, cy) => {
        bCtx.fillStyle = 'rgba(0,0,0,0.4)'; bCtx.fillRect(cx + 4, cy + 34, 48, 8);
        bCtx.fillStyle = '#d8dee9'; bCtx.fillRect(cx, cy + 14, 48, 24);
        bCtx.fillStyle = '#3b82f6'; bCtx.fillRect(cx - 4, cy, 56, 16);
        bCtx.fillStyle = '#1d4ed8'; bCtx.fillRect(cx - 4, cy + 12, 56, 4);
        bCtx.fillStyle = '#7c2d12'; bCtx.fillRect(cx + 18, cy + 24, 12, 14);
        bCtx.fillStyle = '#fde047'; bCtx.fillRect(cx + 6, cy + 20, 8, 8);
        bCtx.fillRect(cx + 34, cy + 20, 8, 8);
    };
    dibujarCasa(36, 56);
    dibujarCasa(154, 56);
    dibujarCasa(44, 340);

    const dibujarArbol = (ax, ay, muerto = false) => {
        bCtx.fillStyle = 'rgba(0,0,0,0.35)'; bCtx.fillRect(ax - 8, ay + 10, 18, 6);
        bCtx.fillStyle = muerto ? '#3b2828' : '#5c3a21'; bCtx.fillRect(ax - 3, ay, 6, 14);
        if (!muerto) {
            bCtx.fillStyle = '#1b4332'; bCtx.fillRect(ax - 12, ay - 14, 24, 16);
            bCtx.fillStyle = '#2d6a4f'; bCtx.fillRect(ax - 10, ay - 18, 20, 12);
            bCtx.fillStyle = '#40916c'; bCtx.fillRect(ax - 6, ay - 20, 12, 6);
        } else {
            bCtx.fillStyle = '#4a2525';
            bCtx.fillRect(ax - 10, ay - 8, 8, 3);
            bCtx.fillRect(ax + 2, ay - 12, 8, 3);
        }
    };
    [[22, 160], [28, 280], [210, 130], [215, 320], [150, 385]].forEach(([x, y]) => dibujarArbol(x, y, false));
    [[575, 85], [610, 360], [740, 100], [750, 340]].forEach(([x, y]) => dibujarArbol(x, y, true));

    // Muralla divisoria entre Ciudad Alianza y Territorio Belicista
    for (let y = 36; y < 440; y += 16) {
        if (y > 180 && y < 250) continue;
        bCtx.fillStyle = '#64748b'; bCtx.fillRect(260, y, 12, 15);
        bCtx.fillStyle = '#94a3b8'; bCtx.fillRect(262, y + 2, 4, 5);
    }

    // 4. Ruinas en Territorio Belicista
    const dibujarPilar = (px, py) => {
        bCtx.fillStyle = 'rgba(0,0,0,0.45)'; bCtx.fillRect(px + 2, py + 20, 18, 6);
        bCtx.fillStyle = '#6b7280'; bCtx.fillRect(px, py, 16, 22);
        bCtx.fillStyle = '#9ca3af'; bCtx.fillRect(px + 2, py + 2, 5, 16);
    };
    dibujarPilar(320, 90);
    dibujarPilar(450, 105);
    dibujarPilar(340, 325);
    dibujarPilar(475, 310);

    // Grietas de energía en Zona Gris
    bCtx.strokeStyle = '#ff0055';
    bCtx.lineWidth = 2;
    bCtx.beginPath();
    bCtx.moveTo(560, 140); bCtx.lineTo(595, 160); bCtx.lineTo(615, 145);
    bCtx.moveTo(640, 320); bCtx.lineTo(675, 295); bCtx.lineTo(710, 310);
    bCtx.stroke();

    // Frontera Zona Gris
    bCtx.strokeStyle = 'rgba(255, 77, 109, 0.35)';
    bCtx.setLineDash([6, 6]);
    bCtx.beginPath(); bCtx.moveTo(534, 36); bCtx.lineTo(534, 440); bCtx.stroke();
    bCtx.setLineDash([]);
}
generarMapaBase();

// Partículas ambientales por bioma
const particulas = Array.from({ length: 45 }, () => ({
    x: Math.random() * 800,
    y: 40 + Math.random() * 390,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -0.2 - Math.random() * 0.4,
    size: Math.random() > 0.5 ? 3 : 2,
    alpha: Math.random()
}));

window.addEventListener('keydown', (e) => {
    if (!enMapaActivo) return;
    const k = e.key.toLowerCase();
    teclas[k] = true;
    if (k === 'e' && objetivoCercano) {
        socket.emit('retarJugador', objetivoCercano.id);
    }
});

window.addEventListener('keyup', (e) => {
    teclas[e.key.toLowerCase()] = false;
});

setInterval(() => {
    if (!enMapaActivo) return;
    let dx = 0, dy = 0;
    if (teclas['w'] || teclas['arrowup']) dy -= 1;
    if (teclas['s'] || teclas['arrowdown']) dy += 1;
    if (teclas['a'] || teclas['arrowleft']) dx -= 1;
    if (teclas['d'] || teclas['arrowright']) dx += 1;
    if (dx !== 0 || dy !== 0) socket.emit('mover', { dx, dy });
}, 45);

window.descansarZonaSegura = () => socket.emit('descansar');
window.retarCercano = () => {
    if (objetivoCercano) socket.emit('retarJugador', objetivoCercano.id);
};

let avisoTimeout = null;
function mostrarAvisoMundo(txt) {
    const el = document.getElementById('aviso-mundo');
    el.textContent = txt;
    el.classList.remove('oculto');
    clearTimeout(avisoTimeout);
    avisoTimeout = setTimeout(() => el.classList.add('oculto'), 3800);
}

socket.on('avisoMundo', mostrarAvisoMundo);
socket.on('volverAlMapa', (msg) => {
    mostrarPantalla('mundo');
    mostrarAvisoMundo(msg);
});

function dibujarMapa(tiempo = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Dibujar mapa pixel-art cacheado
    ctx.drawImage(mapaBaseCanvas, 0, 0);

    const pulso = Math.sin(tiempo * 0.004);

    // 2. Elementos animados del escenario
    const gradFuente = ctx.createRadialGradient(130, 220, 4, 130, 220, 32 + pulso * 4);
    gradFuente.addColorStop(0, 'rgba(102, 252, 241, 0.55)');
    gradFuente.addColorStop(1, 'rgba(102, 252, 241, 0)');
    ctx.fillStyle = gradFuente;
    ctx.beginPath(); ctx.arc(130, 220, 36, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#94a3b8'; ctx.fillRect(116, 208, 28, 24);
    ctx.fillStyle = '#38bdf8'; ctx.fillRect(120, 212, 20, 16);
    ctx.fillStyle = '#e0f2fe'; ctx.fillRect(126, 214 + Math.round(pulso * 2), 8, 6);

    const antorchas = [[286, 175], [286, 260], [400, 140], [400, 300]];
    antorchas.forEach(([tx, ty], i) => {
        const flama = Math.sin(tiempo * 0.012 + i) * 3;
        const g = ctx.createRadialGradient(tx, ty, 2, tx, ty, 26 + flama);
        g.addColorStop(0, 'rgba(255, 160, 40, 0.55)');
        g.addColorStop(1, 'rgba(255, 100, 0, 0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(tx, ty, 28, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#5c3a21'; ctx.fillRect(tx - 2, ty, 4, 10);
        ctx.fillStyle = '#ff6b00'; ctx.fillRect(tx - 3, ty - 5, 6, 6);
        ctx.fillStyle = '#ffd166'; ctx.fillRect(tx - 1, ty - 4, 3, 4);
    });

    const gPortal = ctx.createRadialGradient(735, 220, 6, 735, 220, 42 + pulso * 6);
    gPortal.addColorStop(0, 'rgba(180, 40, 255, 0.85)');
    gPortal.addColorStop(0.5, 'rgba(255, 0, 85, 0.4)');
    gPortal.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gPortal;
    ctx.beginPath(); ctx.arc(735, 220, 48, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#e0aaff';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(735, 220, 14, 24, 0, 0, Math.PI * 2); ctx.stroke();

    // 3. Dibujar jugadores ordenados por eje Y (profundidad 2.5D)
    const yo = jugadoresEnMapa.find(p => p.id === socket.id);
    objetivoCercano = null;
    const ordenados = [...jugadoresEnMapa].sort((a, b) => a.y - b.y);

    ordenados.forEach(p => {
        const prev = posAnteriores[p.id] || { x: p.x, y: p.y };
        const moviendo = Math.hypot(p.x - prev.x, p.y - prev.y) > 0.5;
        posAnteriores[p.id] = { x: p.x, y: p.y };
        const bob = moviendo ? Math.abs(Math.sin(tiempo * 0.02)) * 4 : Math.sin(tiempo * 0.005) * 1.2;

        // Sombra en el suelo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + 16, 13, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Aura de facción en los pies
        ctx.strokeStyle = p.faccion === 'ALIANZA' ? 'rgba(76, 201, 240, 0.85)' : 'rgba(255, 77, 109, 0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + 15, 16, 6, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Sprite Pixel-Art real del personaje
        const img = obtenerSpriteImagen(p);
        if (img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, p.x - 18, p.y - 22 - bob, 36, 36);
        } else {
            ctx.fillStyle = p.color || '#66fcf1';
            ctx.fillRect(p.x - 10, p.y - 10, 20, 20);
        }

        // Mini barra de HP
        const hpPct = Math.max(0, p.hp / p.hpMax);
        ctx.fillStyle = '#000';
        ctx.fillRect(p.x - 16, p.y - 28 - bob, 32, 4);
        ctx.fillStyle = hpPct <= 0.25 ? '#ff3333' : (hpPct <= 0.55 ? '#ffd700' : '#00ff66');
        ctx.fillRect(p.x - 15, p.y - 27 - bob, Math.round(30 * hpPct), 2);

        // Nombre con sombra retro
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        const etiqueta = `${p.enCombate ? '⚔️ ' : ''}${p.nombre}`;
        ctx.fillStyle = '#000';
        ctx.fillText(etiqueta, p.x + 1, p.y - 33 - bob);
        ctx.fillStyle = p.id === socket.id ? '#ffd700' : '#ffffff';
        ctx.fillText(etiqueta, p.x, p.y - 34 - bob);

        // Detectar rival cercano retable
        if (yo && p.id !== yo.id && !yo.enCombate && !p.enCombate && yo.zonaId !== 1 && p.zonaId !== 1) {
            const esValido = (yo.zonaId === 3) || (yo.zonaId === 2 && yo.faccion !== p.faccion);
            const dist = Math.hypot(yo.x - p.x, yo.y - p.y);
            if (esValido && dist <= 90) {
                objetivoCercano = p;
                ctx.strokeStyle = '#ff3333';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 26 + pulso * 3, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    });

    // 4. Partículas ambientales flotantes
    particulas.forEach(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.y < 36) { pt.y = 435; pt.x = Math.random() * 800; }
        if (pt.x < 0) pt.x = 800;
        if (pt.x > 800) pt.x = 0;

        if (pt.x < 266) ctx.fillStyle = 'rgba(150, 255, 180, 0.6)';
        else if (pt.x < 534) ctx.fillStyle = 'rgba(255, 170, 60, 0.55)';
        else ctx.fillStyle = 'rgba(220, 80, 255, 0.65)';
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
    });

    // 5. Etiquetas de zona con fondo oscuro legible
    const etiquetasZona = [
        { txt: 'CIUDAD ALIANZA', x: 133, col: '#00ff88' },
        { txt: 'TERRITORIO BELICISTA', x: 400, col: '#ffd700' },
        { txt: 'ZONA GRIS (PVP LIBRE)', x: 667, col: '#ff4d6d' }
    ];
    ctx.font = '9px "Press Start 2P"';
    ctx.textAlign = 'center';
    etiquetasZona.forEach(z => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(z.x - 105, 8, 210, 20);
        ctx.fillStyle = z.col;
        ctx.fillText(z.txt, z.x, 22);
    });

    // 6. Actualizar HUD y botones
    if (yo) {
        document.getElementById('hud-identidad').textContent = `${yo.icono} ${yo.nombre} (${yo.rolNombre})`;
        document.getElementById('hud-faccion').textContent = yo.faccion;
        const nombresZona = { 1: '🏰 CIUDAD ALIANZA (SEGURA)', 2: '⚔️ TERRITORIO BELICISTA', 3: '💀 ZONA GRIS (LIBRE)' };
        document.getElementById('hud-zona').textContent = nombresZona[yo.zonaId];
        document.getElementById('hud-hp').textContent = `HP: ${yo.hp}/${yo.hpMax}`;
        document.getElementById('hud-online').textContent = `👥 ${jugadoresEnMapa.length}`;

        document.getElementById('btn-descansar').classList.toggle('oculto', yo.zonaId !== 1);
        const btnRetar = document.getElementById('btn-retar');
        if (objetivoCercano) {
            btnRetar.classList.remove('oculto');
            btnRetar.textContent = `⚔️ RETAR A ${objetivoCercano.nombre} (E)`;
        } else {
            btnRetar.classList.add('oculto');
        }
    }

    requestAnimationFrame(dibujarMapa);
}
requestAnimationFrame(dibujarMapa);

socket.on('estadoMundo', (lista) => {
    jugadoresEnMapa = lista;
});

// ================= COMBATE POR TURNOS =================
const pregTimer = document.getElementById('preg-timer');
const escenarioBox = document.getElementById('escenario-box');
const escenarioNombre = document.getElementById('escenario-nombre');
const textoFlotante = document.getElementById('texto-flotante');
const globoReaccion = document.getElementById('globo-reaccion');
const menuComandos = document.getElementById('menu-comandos');
const submenuComandos = document.getElementById('submenu-comandos');
const tituloSubmenu = document.getElementById('titulo-submenu');
const gridSubmenu = document.getElementById('grid-submenu');
let timeoutReaccion = null;

function claseDificultad(dif) {
    if (dif === 'facil') return 'tag-facil';
    if (dif === 'dificil') return 'tag-dificil';
    return 'tag-medio';
}

window.abrirSubmenu = (categoria) => {
    if (!miMenu || !miMenu[categoria]) return;
    const titulos = { ataque: '⚔️ ATACAR', apoyo: '💚 CURAR / PROTEGER', debuff: '🌀 DEBUFF' };
    tituloSubmenu.textContent = titulos[categoria];
    gridSubmenu.innerHTML = '';

    miMenu[categoria].forEach((op, idx) => {
        const btn = document.createElement('button');
        btn.className = 'dq-cmd';
        let etiqueta = op.libre
            ? `<span class="tag-libre">LIBRE</span>`
            : `<span class="${claseDificultad(op.dificultad)}">${op.esBuffDebuff ? '10s · ' : ''}${op.dificultad.toUpperCase()}</span>`;
        btn.innerHTML = `▶ ${op.nombre} ${etiqueta}`;
        btn.onclick = () => {
            submenuComandos.classList.add('oculto');
            socket.emit('ejecutarOpcion', { categoria, indice: idx });
        };
        gridSubmenu.appendChild(btn);
    });

    menuComandos.classList.add('oculto');
    submenuComandos.classList.remove('oculto');
};

window.volverMenuPrincipal = () => {
    submenuComandos.classList.add('oculto');
    menuComandos.classList.remove('oculto');
};

window.responderPasiva = (aceptar) => {
    document.getElementById('panel-pasiva').classList.add('oculto');
    socket.emit('decisionPasiva', aceptar);
};

window.enviarReaccion = (texto) => socket.emit('reaccion', texto);

function reproducirEfecto(efecto) {
    if (!efecto) return;
    textoFlotante.className = 'texto-flotante';
    void textoFlotante.offsetWidth;
    textoFlotante.textContent = efecto.texto;
    textoFlotante.classList.add(`flotante-${efecto.tipo}`);

    const claseAnim = efecto.tipo === 'ataque' ? 'anim-hit' :
                      efecto.tipo === 'cura' ? 'anim-cura' :
                      efecto.tipo === 'buff' ? 'anim-buff' :
                      efecto.tipo === 'debuff' ? 'anim-debuff' : '';
    if (claseAnim) {
        escenarioBox.classList.remove('anim-hit', 'anim-cura', 'anim-buff', 'anim-debuff');
        void escenarioBox.offsetWidth;
        escenarioBox.classList.add(claseAnim);
        setTimeout(() => escenarioBox.classList.remove(claseAnim), 500);
    }
}

function renderizarEstadosCombate(jugadores, turnoDe) {
    jugadores.forEach((j, idx) => {
        const n = idx + 1;
        const esYo = j.id === socket.id;
        document.getElementById(`titulo-j${n}`).textContent = `${j.icono} ${j.nombre}${esYo ? ' (TÚ)' : ''}`;
        document.getElementById(`hp-j${n}`).textContent = `${j.hp}/${j.hpMax}`;

        const pct = (j.hp / j.hpMax) * 100;
        const bar = document.getElementById(`bar-j${n}`);
        bar.style.width = `${pct}%`;
        bar.style.background = pct <= 25 ? '#ff3333' : (pct <= 55 ? '#ffd700' : '#00ff66');

        const contraPct = j.contraataque || 0;
        document.getElementById(`contra-txt-j${n}`).textContent = `${contraPct}%`;
        document.getElementById(`contra-bar-j${n}`).style.width = `${contraPct}%`;

        document.getElementById(`stats-j${n}`).textContent =
            `AF:${j.stats.atkFis} AM:${j.stats.atkMag} DF:${j.stats.defFis} DM:${j.stats.defMag}`;
        document.getElementById(`box-j${n}`).classList.toggle('turno-activo', j.id === turnoDe);

        const tags = document.getElementById(`tags-j${n}`);
        tags.innerHTML = '';
        if (j.despertarTurnos > 0) tags.innerHTML += `<span class="mini-tag tag-despertar">🔥DESPERTAR(${j.despertarTurnos})</span>`;
        if (j.tienePasiva) tags.innerHTML += `<span class="mini-tag tag-pasiva">★ ${j.pasivaInfo.nombre}</span>`;
        if (j.buffAtk) tags.innerHTML += `<span class="mini-tag tag-buff">ATK+40%</span>`;
        if (j.sobrevoltaje) tags.innerHTML += `<span class="mini-tag tag-buff">⚡+20%</span>`;
        if (j.escudoCuantico) tags.innerHTML += `<span class="mini-tag tag-buff">🔷CUÁNTICO</span>`;
        if (j.buffDefTurnos > 0) tags.innerHTML += `<span class="mini-tag tag-buff">DEF+40%(${j.buffDefTurnos})</span>`;
        if (j.debuffAtkTurnos > 0) tags.innerHTML += `<span class="mini-tag tag-debuff">ATK-35%(${j.debuffAtkTurnos})</span>`;
        if (j.throttlingTurnos > 0) tags.innerHTML += `<span class="mini-tag tag-debuff">🌡️THROT(${j.throttlingTurnos})</span>`;
        if (j.debuffDefTurnos > 0) tags.innerHTML += `<span class="mini-tag tag-debuff">DEF-40%(${j.debuffDefTurnos})</span>`;
        if (j.debuffVulnTurnos > 0) tags.innerHTML += `<span class="mini-tag tag-debuff">VULN(${j.debuffVulnTurnos})</span>`;
        if (j.corrupcionTurnos > 0) tags.innerHTML += `<span class="mini-tag tag-debuff">👾CORR(${j.corrupcionTurnos})</span>`;
        if (j.venenoTurnos > 0) tags.innerHTML += `<span class="mini-tag tag-debuff">☠️(${j.venenoTurnos})</span>`;
        if (j.debuffRolTurnos > 0) tags.innerHTML += `<span class="mini-tag tag-debuff">DEBUFF(${j.debuffRolTurnos})</span>`;

        if (!esYo) {
            document.getElementById('sprite-rival').innerHTML = generarSpriteSVG(j.rama, j.color, j.color2);
            document.getElementById('nombre-rival').textContent = `${j.nombre} · ${j.rolNombre.toUpperCase()}`;
        } else {
            miMenu = j.menu;
        }
    });
}

socket.on('estadoCombate', (datos) => {
    mostrarPantalla('combate');
    if (datos.escenario) {
        escenarioBox.classList.remove('bg-bosque', 'bg-castillo', 'bg-volcan', 'bg-mazmorra');
        escenarioBox.classList.add(datos.escenario.id);
        escenarioNombre.textContent = datos.escenario.nombre;
    }
    renderizarEstadosCombate(datos.jugadores, datos.turnoDe);
    if (datos.log) document.getElementById('log-dq').textContent = datos.log;

    document.getElementById('panel-pregunta').classList.add('oculto');
    submenuComandos.classList.add('oculto');
    pregTimer.classList.add('oculto');

    if (datos.estado === 'eligiendo' && datos.turnoDe === socket.id) {
        menuComandos.classList.remove('oculto');
        document.getElementById('panel-pasiva').classList.add('oculto');
    } else if (datos.estado !== 'evento_pasiva') {
        menuComandos.classList.add('oculto');
        document.getElementById('panel-pasiva').classList.add('oculto');
    }
});

socket.on('eventoPasiva', (info) => {
    menuComandos.classList.add('oculto');
    submenuComandos.classList.add('oculto');
    document.getElementById('panel-pasiva').classList.remove('oculto');
    document.getElementById('desc-pasiva').textContent =
        `Si aciertas en 10s ganas [${info.pasiva.nombre}: ${info.pasiva.desc}]. Si fallas sufres [${info.debuff.nombre}].`;
});

socket.on('mostrarPregunta', (datos) => {
    document.getElementById('panel-pregunta').classList.remove('oculto');
    document.getElementById('preg-titulo').textContent = datos.titulo;
    document.getElementById('preg-dif').textContent = datos.dificultad;
    document.getElementById('preg-texto').textContent = datos.pregunta;

    if (datos.conTiempo) {
        pregTimer.classList.remove('oculto');
        pregTimer.textContent = '⏱️ 10s';
    } else {
        pregTimer.classList.add('oculto');
    }

    const cont = document.getElementById('preg-opciones');
    cont.innerHTML = '';
    datos.opciones.forEach((op, idx) => {
        const btn = document.createElement('button');
        btn.className = 'btn-opcion';
        btn.textContent = `${idx + 1}. ${op}`;
        btn.onclick = () => {
            document.querySelectorAll('.btn-opcion').forEach(b => b.disabled = true);
            socket.emit('responder', idx);
        };
        cont.appendChild(btn);
    });
});

socket.on('tickTiempo', (seg) => { pregTimer.textContent = `⏱️ ${seg}s`; });
socket.on('oponenteOcupado', (msg) => { document.getElementById('log-dq').textContent = msg; });
socket.on('efectoVisual', reproducirEfecto);

socket.on('mostrarReaccion', (datos) => {
    globoReaccion.textContent = `${datos.autor}: ${datos.texto}`;
    globoReaccion.classList.remove('oculto');
    clearTimeout(timeoutReaccion);
    timeoutReaccion = setTimeout(() => globoReaccion.classList.add('oculto'), 3000);
});

socket.on('resultadoAccion', (datos) => {
    document.getElementById('panel-pregunta').classList.add('oculto');
    menuComandos.classList.add('oculto');
    submenuComandos.classList.add('oculto');
    pregTimer.classList.add('oculto');
    renderizarEstadosCombate(datos.jugadores, null);
    reproducirEfecto(datos.efecto);

    let texto = datos.log;
    if (datos.explicacion) texto += ` | 💡 ${datos.explicacion}`;
    document.getElementById('log-dq').textContent = texto;
});

socket.on('finDuelo', (datos) => {
    document.getElementById('log-dq').textContent =
        `🏆 ¡${datos.ganador} (${datos.rol}) GANA EL DUELO! ${datos.motivo || ''} Volviendo al mapa...`;
});