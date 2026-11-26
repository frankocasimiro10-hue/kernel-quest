// Catálogo de los 20 Roles en 5 Ramas + 1 Clase Oculta (1% probabilidad)

function crearMenu(cfg) {
    return {
        ataque: [
            { nombre: cfg.a0, libre: true, tipo: 'ataque', dañoTipo: cfg.t, mult: 1.0 },
            { nombre: cfg.a1, dificultad: 'facil', tipo: 'ataque', dañoTipo: cfg.dt1 || cfg.t, mult: 1.2 },
            { nombre: cfg.a2, dificultad: 'medio', tipo: cfg.t2 || 'ataque', dañoTipo: cfg.dt2 || cfg.t, mult: 1.45 },
            { nombre: cfg.a3, dificultad: 'dificil', tipo: cfg.t3 || 'ataque', dañoTipo: cfg.dt3 || cfg.t, mult: 1.72 }
        ],
        apoyo: [
            { nombre: cfg.p0, dificultad: 'facil', tipo: 'cura', cura: cfg.cura1 || 20, esBuffDebuff: true },
            { nombre: cfg.p1, dificultad: 'facil', tipo: 'buff_def', esBuffDebuff: true },
            { nombre: cfg.p2, dificultad: 'medio', tipo: 'buff_atk', esBuffDebuff: true },
            { nombre: cfg.p3, dificultad: 'dificil', tipo: cfg.p3Tipo || 'cura_buff', cura: cfg.cura2 || 26, esBuffDebuff: true }
        ],
        debuff: [
            { nombre: cfg.d0, dificultad: 'facil', tipo: 'debuff_atk', esBuffDebuff: true },
            { nombre: cfg.d1, dificultad: 'medio', tipo: 'debuff_def', esBuffDebuff: true },
            { nombre: cfg.d2, dificultad: 'medio', tipo: 'debuff_vuln', esBuffDebuff: true },
            { nombre: cfg.d3, dificultad: 'dificil', tipo: cfg.d3Tipo || 'veneno', esBuffDebuff: true }
        ]
    };
}

const ROLES = {
    // ================= 1. RAMA MARCIAL (QI) =================
    cuerpo_vajra: {
        id: 'cuerpo_vajra', nombre: 'Cuerpo Vajra', rama: 'marcial', arquetipo: 'Tanque Puro',
        icono: '🛡️', color: '#8d99ae', color2: '#ffb703',
        lore: 'Artista marcial que refina su Qi celular hasta volver su piel y huesos más duros que el acero rúnico.',
        hpMax: 185, stats: { atkFis: 15, atkMag: 4, defFis: 23, defMag: 18 },
        tipoBasico: 'fisico', posturaDespertar: 'DEFENSA',
        pasiva: { nombre: 'Piel de Acero', desc: '+4 DF y +4 DM permanente' },
        debuffFallo: { nombre: 'Meridiano Roto', desc: 'Recibes +6 daño extra (2T)' },
        menu: crearMenu({
            t: 'fisico', a0: 'Golpe de Escudo', a1: 'Palma Pesada', a2: 'Embestida Swap', a3: 'Impacto Vajra',
            p0: 'Respiración Qi', p1: 'Muro Firewall', p2: 'Postura Férrea', p3: 'Fortaleza RAID', p3Tipo: 'cura_def', cura1: 22, cura2: 30,
            d0: 'Aturdir CPU', d1: 'Aplastar Coraza', d2: 'Provocar', d3: 'Saturación DDoS'
        })
    },
    berserker_carmesi: {
        id: 'berserker_carmesi', nombre: 'Berserker Carmesí', rama: 'marcial', arquetipo: 'Furia / Riesgo',
        icono: '🔥', color: '#d90429', color2: '#ffbe0b',
        lore: 'Sobrevivió al borde de la muerte liberando Qi crudo; conserva lucidez fría dentro del frenesí.',
        hpMax: 145, stats: { atkFis: 25, atkMag: 4, defFis: 12, defMag: 9 },
        tipoBasico: 'fisico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Frenesí Lúcido', desc: '+5 AF permanente' },
        debuffFallo: { nombre: 'Desgaste Muscular', desc: '-30% ataque (2T)' },
        menu: crearMenu({
            t: 'fisico', a0: 'Tajo Salvaje', a1: 'Corte de Sangre', a2: 'Furia Carmesí', a3: 'Aniquilación -9',
            p0: 'Adrenalina', p1: 'Ignorar Dolor', p2: 'Hervir Qi', p3: 'Sed de Batalla', cura1: 18, cura2: 24,
            d0: 'Grito de Guerra', d1: 'Romper Huesos', d2: 'Acorralar', d3: 'Hemorragia'
        })
    },
    maestro_evasion: {
        id: 'maestro_evasion', nombre: 'Maestro Evasión', rama: 'marcial', arquetipo: 'Contraataque',
        icono: '💨', color: '#4cc9f0', color2: '#f72585',
        lore: 'Alcanzó lectura espacial absoluta ("efecto Shedinja"), esquivando golpes por milímetros para contraatacar.',
        hpMax: 125, stats: { atkFis: 21, atkMag: 6, defFis: 15, defMag: 13 },
        tipoBasico: 'fisico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Efecto Shedinja', desc: '+10% carga de contraataque extra' },
        debuffFallo: { nombre: 'Paso en Falso', desc: 'Recibes +20% daño (2T)' },
        menu: crearMenu({
            t: 'fisico', a0: 'Estocada Veloz', a1: 'Paso Fantasma', a2: 'Corte Reflejo', a3: 'Danza del Vacío',
            p0: 'Aliento Sereno', p1: 'Lectura Espacial', p2: 'Foco Absoluto', p3: 'Flujo Perfecto', cura1: 18, cura2: 22,
            d0: 'Desviar Arma', d1: 'Punto Ciego', d2: 'Desequilibrar', d3: 'Corte Nervioso'
        })
    },
    santo_espada: {
        id: 'santo_espada', nombre: 'Santo Espada', rama: 'marcial', arquetipo: 'Daño Físico',
        icono: '⚔️', color: '#e0e1dd', color2: '#3a86ff',
        lore: 'Cúspide del cultivo físico; proyecta intención cortante pura que perfora defensas ordinarias.',
        hpMax: 135, stats: { atkFis: 24, atkMag: 5, defFis: 15, defMag: 10 },
        tipoBasico: 'fisico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Filo Root', desc: '+5 AF permanente' },
        debuffFallo: { nombre: 'Desarmado', desc: '-35% daño infligido (2T)' },
        menu: crearMenu({
            t: 'fisico', a0: 'Estocada Básica', a1: 'Corte Bash', a2: 'Tajo Sudo', t2: 'perforar', a3: 'Intención Pura', t3: 'perforar',
            p0: 'Vendar Herida', p1: 'Guardia de Acero', p2: 'Afilar Script', p3: 'Espíritu Marcial', cura1: 16, cura2: 22,
            d0: 'Desarmar', d1: 'Rompe-Escudo', d2: 'Marcar Objetivo', d3: 'Tajo Profundo'
        })
    },

    // ================= 2. RAMA ARCANA (MANÁ) =================
    mago_elemental: {
        id: 'mago_elemental', nombre: 'Mago Elemental', rama: 'arcana', arquetipo: 'Daño Mágico',
        icono: '🔮', color: '#7209b7', color2: '#4cc9f0',
        lore: 'Humano con canales mágicos despertados tras sobrevivir a una mazmorra; gran poder pero cuerpo frágil.',
        hpMax: 105, stats: { atkFis: 4, atkMag: 25, defFis: 7, defMag: 16 },
        tipoBasico: 'magico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Sobrecarga Bash', desc: '+5 AM permanente' },
        debuffFallo: { nombre: 'Fuga de Memoria', desc: 'Recibes +25% daño (2T)' },
        menu: crearMenu({
            t: 'magico', a0: 'Chispa Arcana', a1: 'Rayo Apt', a2: 'Bola de Fuego', a3: 'Tormenta Kernel',
            p0: 'Poción de Éter', p1: 'Barrera de Maná', p2: 'Canalizar Maná', p3: 'Sobrecarga Total', cura1: 18, cura2: 22,
            d0: 'Maldición Lag', d1: 'Romper Sello', d2: 'Ojo del Vacío', d3: 'Quemadura Arcana'
        })
    },
    tejedor_vacio: {
        id: 'tejedor_vacio', nombre: 'Tejedor Vacío', rama: 'arcana', arquetipo: 'Riesgo / Purga',
        icono: '🌌', color: '#3a0ca3', color2: '#f72585',
        lore: 'Mago de herencia inestable que creó hechizos de desvanecimiento para purgar el exceso de maná.',
        hpMax: 110, stats: { atkFis: 5, atkMag: 24, defFis: 8, defMag: 15 },
        tipoBasico: 'magico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Purga Vital', desc: '+5 AM permanente' },
        debuffFallo: { nombre: 'Choque Elemental', desc: 'Pierdes 6 HP al turno (2T)' },
        menu: crearMenu({
            t: 'magico', a0: 'Pulso Nulo', a1: 'Grieta Menor', a2: 'Desvanecimiento', t2: 'perforar', a3: 'Colapso del Vacío',
            p0: 'Purgar Canales', p1: 'Velo Nulo', p2: 'Condensar Vacío', p3: 'Estabilizar Alma', cura1: 22, cura2: 28,
            d0: 'Drenar Fuerza', d1: 'Disolver Escudo', d2: 'Fisura Espacial', d3: 'Corrupción Nula'
        })
    },
    disruptor_arcano: {
        id: 'disruptor_arcano', nombre: 'Disruptor Arcano', rama: 'arcana', arquetipo: 'Anti-Magia',
        icono: '⚡', color: '#00b4d8', color2: '#ffd166',
        lore: 'Especialista entrenado en duelos para leer y cortar el flujo de maná y los buffs del oponente.',
        hpMax: 120, stats: { atkFis: 10, atkMag: 20, defFis: 10, defMag: 19 },
        tipoBasico: 'magico', posturaDespertar: 'DEFENSA',
        pasiva: { nombre: 'Manto Anti-Maná', desc: '+5 DM permanente' },
        debuffFallo: { nombre: 'Interferencia', desc: '-30% daño infligido (2T)' },
        menu: crearMenu({
            t: 'magico', a0: 'Choque Estático', a1: 'Corte de Flujo', a2: 'Pulso Disruptor', a3: 'Anulación Total',
            p0: 'Absorber Éter', p1: 'Escudo Rúnico', p2: 'Sobrecarga', p3: 'Sello Protector', p3Tipo: 'cura_def', cura1: 18, cura2: 24,
            d0: 'Silenciar Flujo', d1: 'Quiebre Mágico', d2: 'Exponer Núcleo', d3: 'Purgar Buffs', d3Tipo: 'purgar'
        })
    },
    ilusionista_psionico: {
        id: 'ilusionista_psionico', nombre: 'Ilusionista', rama: 'arcana', arquetipo: 'Control Mental',
        icono: '👁️', color: '#9d4edd', color2: '#ff9e00',
        lore: 'Manipula los sentidos y ondas mentales del rival con mente fría, aplicando debuffs constantes.',
        hpMax: 112, stats: { atkFis: 5, atkMag: 22, defFis: 9, defMag: 17 },
        tipoBasico: 'magico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Mente Fría', desc: '+4 AM y +3 DM permanente' },
        debuffFallo: { nombre: 'Jaqueca Neuronal', desc: 'Recibes +20% daño (2T)' },
        menu: crearMenu({
            t: 'magico', a0: 'Onda Mental', a1: 'Espejismo', a2: 'Lanza Psiónica', a3: 'Pesadilla Root',
            p0: 'Calma Mental', p1: 'Doble Ilusorio', p2: 'Enfoque Psíquico', p3: 'Trance Lucidez', cura1: 18, cura2: 24,
            d0: 'Confusión', d1: 'Miedo Inducido', d2: 'Alucinación', d3: 'Trauma Continuo'
        })
    },

    // ================= 3. RAMA SAGRADA / UMBRAL =================
    paladin_divino: {
        id: 'paladin_divino', nombre: 'Paladín Divino', rama: 'sagrada', arquetipo: 'Caballero Santo',
        icono: '⚜️', color: '#ffd166', color2: '#ffffff',
        lore: 'Guerrero que selló un juramento inquebrantable; usa la fe como filtro para proyectar auras protectoras.',
        hpMax: 155, stats: { atkFis: 19, atkMag: 10, defFis: 17, defMag: 15 },
        tipoBasico: 'fisico', posturaDespertar: 'DEFENSA',
        pasiva: { nombre: 'Juramento Sacro', desc: '+4 DF y +3 AF permanente' },
        debuffFallo: { nombre: 'Duda de Fe', desc: '-30% daño infligido (2T)' },
        menu: crearMenu({
            t: 'fisico', a0: 'Golpe Justo', a1: 'Espada de Luz', a2: 'Martillo Sagrado', a3: 'Juicio Divino', dt3: 'magico',
            p0: 'Imponer Manos', p1: 'Aura de Fe', p2: 'Fervor Sagrado', p3: 'Bastión de Luz', p3Tipo: 'cura_def', cura1: 22, cura2: 28,
            d0: 'Cegar Maldad', d1: 'Sello de Culpa', d2: 'Condenar', d3: 'Purgar Oscuridad', d3Tipo: 'purgar'
        })
    },
    clerigo_purificador: {
        id: 'clerigo_purificador', nombre: 'Clérigo', rama: 'sagrada', arquetipo: 'Sanador',
        icono: '✨', color: '#06d6a0', color2: '#ffd166',
        lore: 'Sintonizado con un Semidiós de la Luz; estabiliza heridas críticas y disuelve maldiciones.',
        hpMax: 120, stats: { atkFis: 6, atkMag: 19, defFis: 8, defMag: 16 },
        tipoBasico: 'magico', posturaDespertar: 'DEFENSA',
        pasiva: { nombre: 'Regeneración Cron', desc: '+8 HP al inicio de cada turno' },
        debuffFallo: { nombre: 'Proceso Zombi', desc: 'Pierdes 6 HP al turno (2T)' },
        menu: crearMenu({
            t: 'magico', a0: 'Destello Menor', a1: 'Pulso de Luz', a2: 'Pulso Sagrado', a3: 'Purificación',
            p0: 'Parche Rápido', p1: 'Aura Protectora', p2: 'Bendición Sudo', p3: 'Restaurar Backup', p3Tipo: 'cura_def', cura1: 26, cura2: 38,
            d0: 'Debilitar Núcleo', d1: 'Purgar Defensa', d2: 'Sello Vulnerable', d3: 'Exorcismo', d3Tipo: 'purgar'
        })
    },
    caballero_no_muerto: {
        id: 'caballero_no_muerto', nombre: 'Cab. No Muerto', rama: 'sagrada', arquetipo: 'Caballero Oscuro',
        icono: '💀', color: '#495057', color2: '#e63946',
        lore: 'Cruzó el umbral de la muerte real (<0.1%) por pura voluntad y rencor; domina el aura de cripta.',
        hpMax: 145, stats: { atkFis: 23, atkMag: 8, defFis: 15, defMag: 11 },
        tipoBasico: 'fisico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Voluntad Rencor', desc: '+5 AF permanente' },
        debuffFallo: { nombre: 'Fractura Ósea', desc: 'Recibes +20% daño (2T)' },
        menu: crearMenu({
            t: 'fisico', a0: 'Corte Sombrío', a1: 'Hoja de Cripta', a2: 'Segadora Oscura', t2: 'robo_vida', a3: 'Trono Pálido',
            p0: 'Absorber Esencia', p1: 'Coraza de Hueso', p2: 'Aura de Rencor', p3: 'Pacto Exánime', cura1: 18, cura2: 24,
            d0: 'Terror Mortal', d1: 'Corroer Acero', d2: 'Marca Fúnebre', d3: 'Plaga de Cripta'
        })
    },
    nigromante_cripta: {
        id: 'nigromante_cripta', nombre: 'Nigromante', rama: 'sagrada', arquetipo: 'Desgaste',
        icono: '☠️', color: '#5a189a', color2: '#80ed99',
        lore: 'Erudito analítico de la energía negativa que debilita el alma con venenos y procesos zombis.',
        hpMax: 115, stats: { atkFis: 5, atkMag: 22, defFis: 9, defMag: 16 },
        tipoBasico: 'magico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Cosecha de Almas', desc: '+5 AM permanente' },
        debuffFallo: { nombre: 'Rebote Oscuro', desc: 'Pierdes 6 HP al turno (2T)' },
        menu: crearMenu({
            t: 'magico', a0: 'Dardo Necrótico', a1: 'Garra Espectral', a2: 'Drenar Alma', t2: 'robo_vida', a3: 'Legión Exánime',
            p0: 'Sifón Vital', p1: 'Muro de Huesos', p2: 'Ritual Oscuro', p3: 'Filacteria', cura1: 20, cura2: 26,
            d0: 'Debilidad Senil', d1: 'Putrefacción', d2: 'Maldición Mortal', d3: 'Veneno de Alma'
        })
    },

    // ================= 4. RAMA SIGILO Y PRECISIÓN =================
    asesino_sombras: {
        id: 'asesino_sombras', nombre: 'Asesino Sombras', rama: 'sigilo', arquetipo: 'Crítico / Veneno',
        icono: '🗡️', color: '#2b2d42', color2: '#ef233c',
        lore: 'Borra su flujo de Energía Única para atacar desde las sombras con toxinas alquímicas.',
        hpMax: 110, stats: { atkFis: 25, atkMag: 5, defFis: 9, defMag: 11 },
        tipoBasico: 'fisico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Sigilo Absoluto', desc: '+5 AF permanente' },
        debuffFallo: { nombre: 'Descubierto', desc: 'Recibes +25% daño (2T)' },
        menu: crearMenu({
            t: 'fisico', a0: 'Puñalada Rápida', a1: 'Corte Oculto', a2: 'Ataque Vital', t2: 'perforar', a3: 'Ejecución Letal',
            p0: 'Ungüento Rápido', p1: 'Bomba de Humo', p2: 'Afilar Daga', p3: 'Sombra Curativa', cura1: 16, cura2: 20,
            d0: 'Cortar Tendón', d1: 'Toxina Ácida', d2: 'Punto Débil', d3: 'Veneno Letal'
        })
    },
    francotirador_espiritual: {
        id: 'francotirador_espiritual', nombre: 'Francotirador', rama: 'sigilo', arquetipo: 'Perforación',
        icono: '🏹', color: '#2a9d8f', color2: '#e9c46a',
        lore: 'Lleva la puntería al nivel instintivo ("como respirar"), disparando Qi que atraviesa armaduras.',
        hpMax: 112, stats: { atkFis: 24, atkMag: 7, defFis: 9, defMag: 11 },
        tipoBasico: 'fisico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Ojo de Halcón', desc: '+5 AF permanente' },
        debuffFallo: { nombre: 'Mira Descalibrada', desc: '-30% daño infligido (2T)' },
        menu: crearMenu({
            t: 'fisico', a0: 'Disparo Rápido', a1: 'Flecha de Qi', a2: 'Tiro Perforante', t2: 'perforar', a3: 'Ojo del Destino', t3: 'perforar',
            p0: 'Botiquín Campo', p1: 'Camuflaje', p2: 'Apuntar Respirar', p3: 'Recarga Táctica', cura1: 16, cura2: 22,
            d0: 'Disparo a Brazos', d1: 'Flecha Rompe-Placas', d2: 'Rastreador', d3: 'Dardo Tóxico'
        })
    },
    cazador_sangre: {
        id: 'cazador_sangre', nombre: 'Cazador Sangre', rama: 'sigilo', arquetipo: 'Robo de Vida',
        icono: '🐺', color: '#9b2226', color2: '#ee9b00',
        lore: 'Humano aliado con manadas Laykan; combina sentidos hiperagudos y recuperación en combate.',
        hpMax: 132, stats: { atkFis: 21, atkMag: 5, defFis: 13, defMag: 10 },
        tipoBasico: 'fisico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Instinto Laykan', desc: '+4 AF y +3 DF permanente' },
        debuffFallo: { nombre: 'Frenesí Fallido', desc: 'Recibes +20% daño (2T)' },
        menu: crearMenu({
            t: 'fisico', a0: 'Garra Rápida', a1: 'Mordida Feroz', a2: 'Desgarro Vital', t2: 'robo_vida', a3: 'Caza Primordial', t3: 'robo_vida',
            p0: 'Lamer Heridas', p1: 'Piel de Bestia', p2: 'Aullido Alfa', p3: 'Regenerar Sangre', cura1: 20, cura2: 26,
            d0: 'Intimidar', d1: 'Desgarrar Armadura', d2: 'Olor a Sangre', d3: 'Herida Abierta'
        })
    },
    fantasma_sin_nombre: {
        id: 'fantasma_sin_nombre', nombre: 'Fantasma', rama: 'sigilo', arquetipo: 'Ejecución',
        icono: '👤', color: '#6c757d', color2: '#66fcf1',
        lore: 'Asesino conceptual armado con minerales raros, especializado en rematar objetivos heridos.',
        hpMax: 108, stats: { atkFis: 23, atkMag: 10, defFis: 8, defMag: 12 },
        tipoBasico: 'fisico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Corta-Almas', desc: '+5 AF permanente' },
        debuffFallo: { nombre: 'Eco Revelado', desc: 'Recibes +25% daño (2T)' },
        menu: crearMenu({
            t: 'fisico', a0: 'Corte Silencioso', a1: 'Filo Meteórico', a2: 'Corta-Vínculos', t2: 'perforar', a3: 'Borrado Existencial',
            p0: 'Desvanecer', p1: 'Intangibilidad', p2: 'Presencia Cero', p3: 'Reconstruir Eco', cura1: 16, cura2: 20,
            d0: 'Cortar Impulso', d1: 'Anular Defensa', d2: 'Sentencia', d3: 'Purgar Protección', d3Tipo: 'purgar'
        })
    },

    // ================= 5. RAMA HÍBRIDA / CIENCIA =================
    tecnomante: {
        id: 'tecnomante', nombre: 'Tecnomante', rama: 'hibrida', arquetipo: 'Híbrido Técnico',
        icono: '⚙️', color: '#0096c7', color2: '#ffd166',
        lore: 'Ingeniero urbano que fusiona electricidad y micro-runas para crear escudos de éter y armas reactivas.',
        hpMax: 130, stats: { atkFis: 15, atkMag: 18, defFis: 12, defMag: 13 },
        tipoBasico: 'magico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Overclock Rúnico', desc: '+4 AM y +3 AF permanente' },
        debuffFallo: { nombre: 'Cortocircuito', desc: 'Pierdes 6 HP al turno (2T)' },
        menu: crearMenu({
            t: 'magico', a0: 'Disparo Rúnico', a1: 'Descarga Voltaica', a2: 'Rifle de Éter', dt2: 'fisico', a3: 'Cañón Orbital',
            p0: 'Nanobots', p1: 'Escudo de Energía', p2: 'Overclock', p3: 'Batería Auxiliar', p3Tipo: 'cura_def', cura1: 20, cura2: 26,
            d0: 'Pulso EMP', d1: 'Hackear Armadura', d2: 'Escáner Debilidad', d3: 'Virus Kernel'
        })
    },
    ciborg_runico: {
        id: 'ciborg_runico', nombre: 'Ciborg Rúnico', rama: 'hibrida', arquetipo: 'Tanque Híbrido',
        icono: '🤖', color: '#457b9d', color2: '#e63946',
        lore: 'Reemplazó extremidades con prótesis tecnomágicas para romper el muro biológico humano.',
        hpMax: 170, stats: { atkFis: 17, atkMag: 8, defFis: 20, defMag: 16 },
        tipoBasico: 'fisico', posturaDespertar: 'DEFENSA',
        pasiva: { nombre: 'Chasis Titanio', desc: '+4 DF y +4 DM permanente' },
        debuffFallo: { nombre: 'Sobrecalentado', desc: 'Recibes +6 daño extra (2T)' },
        menu: crearMenu({
            t: 'fisico', a0: 'Puño Hidráulico', a1: 'Impacto Rúnico', a2: 'Rayo de Pecho', dt2: 'magico', a3: 'Sobrecarga Ciborg',
            p0: 'Autorreparar', p1: 'Blindaje Reactivo', p2: 'Modo Turbo', p3: 'Núcleo Reserva', p3Tipo: 'cura_def', cura1: 22, cura2: 28,
            d0: 'Red de Choque', d1: 'Triturar Placas', d2: 'Fijar Blanco', d3: 'Radiación Éter'
        })
    },
    caballero_runico: {
        id: 'caballero_runico', nombre: 'Cab. Rúnico', rama: 'hibrida', arquetipo: 'Marcial + Arcano',
        icono: '💠', color: '#3f37c9', color2: '#4895ef',
        lore: 'Espadachín que graba runas en su acero para canalizar Qi y Maná a la vez sin sobrecargarlo.',
        hpMax: 140, stats: { atkFis: 19, atkMag: 16, defFis: 14, defMag: 13 },
        tipoBasico: 'fisico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Acero Grabado', desc: '+3 AF y +3 AM permanente' },
        debuffFallo: { nombre: 'Runa Saturada', desc: '-30% daño infligido (2T)' },
        menu: crearMenu({
            t: 'fisico', a0: 'Corte Rúnico', a1: 'Hoja Elemental', dt1: 'magico', a2: 'Onda Arcana', dt2: 'magico', a3: 'Sinfonía Qi-Maná',
            p0: 'Runa de Alivio', p1: 'Égida Grabada', p2: 'Encantar Hoja', p3: 'Resonancia Dual', cura1: 18, cura2: 24,
            d0: 'Runa de Peso', d1: 'Quebrar Runas', d2: 'Sello de Impacto', d3: 'Fuego Rúnico'
        })
    },
    inquisidor_crepuscular: {
        id: 'inquisidor_crepuscular', nombre: 'Inquisidor', rama: 'hibrida', arquetipo: 'Luz + Sombra',
        icono: '⚖️', color: '#7b2cbf', color2: '#ffd166',
        lore: 'Cazador de sectas que combina purificación divina con energía oscura sin dejarse corromper.',
        hpMax: 132, stats: { atkFis: 15, atkMag: 19, defFis: 12, defMag: 15 },
        tipoBasico: 'magico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Voluntad Hierro', desc: '+4 AM y +3 DM permanente' },
        debuffFallo: { nombre: 'Erosión Dual', desc: 'Recibes +20% daño (2T)' },
        menu: crearMenu({
            t: 'magico', a0: 'Llamarada Gris', a1: 'Lanza Crepuscular', dt1: 'fisico', a2: 'Sifón Sagrado', t2: 'robo_vida', a3: 'Juicio del Eclipse',
            p0: 'Cauterizar', p1: 'Manto Crepúsculo', p2: 'Equilibrio Dual', p3: 'Redención', cura1: 20, cura2: 26,
            d0: 'Cadenas de Fe', d1: 'Anatema', d2: 'Veredicto', d3: 'Purgar Herejía', d3Tipo: 'purgar'
        })
    },

    // ================= CLASE OCULTA (1% PROBABILIDAD) =================
    sabio_fuente_unica: {
        id: 'sabio_fuente_unica', nombre: 'Sabio Fuente Única', rama: 'oculta', oculta: true,
        arquetipo: 'CLASE OCULTA · UR',
        icono: '👑', color: '#ffd700', color2: '#66fcf1',
        lore: 'Descubrió la Verdad de la Fuente Única: cerró el circuito entre Magia (Maná) y Cultivo Marcial (Qi), proyectando energía primordial sin desgaste.',
        hpMax: 210, stats: { atkFis: 28, atkMag: 28, defFis: 22, defMag: 22 },
        tipoBasico: 'magico', posturaDespertar: 'ATAQUE',
        pasiva: { nombre: 'Circuito Cerrado', desc: '+6 AF y +6 AM permanente' },
        debuffFallo: { nombre: 'Sobrecarga Planar', desc: 'Recibes +10% daño (2T)' },
        menu: crearMenu({
            t: 'magico',
            a0: 'Pulso Primordial',
            a1: 'Filo Qi-Maná', dt1: 'fisico',
            a2: 'Ruptura de Leyes', t2: 'perforar', dt2: 'fisico',
            a3: 'Génesis Absoluto', t3: 'robo_vida', dt3: 'magico',
            p0: 'Armonía Total',
            p1: 'Égida Conceptual',
            p2: 'Trascendencia',
            p3: 'Renacimiento', p3Tipo: 'cura_def', cura1: 35, cura2: 50,
            d0: 'Anular Voluntad',
            d1: 'Fracturar Ley',
            d2: 'Juicio Planar',
            d3: 'Disolver Existencia', d3Tipo: 'purgar'
        })
    }
};

module.exports = { ROLES };