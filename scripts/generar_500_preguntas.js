const fs = require('fs');
const path = require('path');

const basePreguntas = [
  // FÁCIL
  {
    enunciado: "¿Qué comando de Linux lista los archivos y carpetas del directorio actual?",
    opciones: ["cd", "ls", "pwd", "mkdir"],
    correcta: "B",
    dificultad: "facil",
    categoria: "Linux CLI"
  },
  {
    enunciado: "¿Qué comando muestra la ruta absoluta del directorio de trabajo actual?",
    opciones: ["pwd", "whoami", "hostname", "uname"],
    correcta: "A",
    dificultad: "facil",
    categoria: "Linux CLI"
  },
  {
    enunciado: "¿Qué comando crea un nuevo directorio en sistemas tipo Unix/Linux?",
    opciones: ["touch", "mkdir", "rmdir", "stat"],
    correcta: "B",
    dificultad: "facil",
    categoria: "Sistema de Archivos"
  },
  {
    enunciado: "¿Cuál es la función principal del Kernel de un Sistema Operativo?",
    opciones: [
      "Editar hojas de cálculo",
      "Gestionar hardware, procesos, memoria y E/S",
      "Renderizar páginas HTML",
      "Configurar routers externos"
    ],
    correcta: "B",
    dificultad: "facil",
    categoria: "Kernel"
  },
  {
    enunciado: "¿Qué usuario cuenta con privilegios administrativos completos en Linux?",
    opciones: ["guest", "nobody", "root", "daemon"],
    correcta: "C",
    dificultad: "facil",
    categoria: "Seguridad y Usuarios"
  },

  // MEDIO
  {
    enunciado: "¿Qué comando muestra los procesos en ejecución y el uso de CPU en tiempo real?",
    opciones: ["top", "df -h", "lsblk", "blkid"],
    correcta: "A",
    dificultad: "medio",
    categoria: "Procesos"
  },
  {
    enunciado: "¿En qué directorio de Debian se almacenan principalmente los archivos de configuración?",
    opciones: ["/bin", "/etc", "/mnt", "/dev"],
    correcta: "B",
    dificultad: "medio",
    categoria: "Sistema de Archivos"
  },
  {
    enunciado: "¿Qué comando muestra el espacio libre y ocupado en los sistemas de archivos montados?",
    opciones: ["free -h", "df -h", "ps aux", "uptime"],
    correcta: "B",
    dificultad: "medio",
    categoria: "Almacenamiento"
  },
  {
    enunciado: "¿Qué comando busca coincidencias de texto dentro de archivos o flujos de entrada?",
    opciones: ["find", "grep", "tar", "ln"],
    correcta: "B",
    dificultad: "medio",
    categoria: "Linux CLI"
  },
  {
    enunciado: "¿Qué comando administra servicios en distribuciones modernas con systemd?",
    opciones: ["systemctl", "service", "chkconfig", "init"],
    correcta: "A",
    dificultad: "medio",
    categoria: "Servicios"
  },

  // DIFÍCIL
  {
    enunciado: "¿Qué ocurre en un escenario de Deadlock (interbloqueo) entre procesos?",
    opciones: [
      "La CPU libera toda la RAM automáticamente",
      "Dos o más procesos esperan indefinidamente recursos retenidos entre sí",
      "El disco duro cambia a solo lectura",
      "Se borra la tabla de particiones"
    ],
    correcta: "B",
    dificultad: "dificil",
    categoria: "Concurrencia"
  },
  {
    enunciado: "¿Qué característica define al algoritmo de planificación Round Robin?",
    opciones: [
      "Asigna un quantum de tiempo fijo en turno circular",
      "Ejecuta siempre el proceso con mayor tiempo de ráfaga",
      "No permite expropiación bajo ninguna circunstancia",
      "Ordena procesos únicamente por tamaño de archivo"
    ],
    correcta: "A",
    dificultad: "dificil",
    categoria: "Planificación CPU"
  },
  {
    enunciado: "¿Qué diferencia fundamental existe entre un proceso y un hilo (thread) del mismo proceso?",
    opciones: [
      "Los hilos comparten el mismo espacio de direcciones y memoria del proceso",
      "Un hilo no puede ejecutar instrucciones en CPU",
      "Los procesos comparten siempre el mismo contador de programa sin pila",
      "Un hilo requiere una máquina virtual distinta"
    ],
    correcta: "A",
    dificultad: "dificil",
    categoria: "Hilos y Procesos"
  },
  {
    enunciado: "¿Qué señal envía 'kill -9 <PID>' para terminar un proceso de forma inmediata?",
    opciones: ["SIGTERM", "SIGKILL", "SIGHUP", "SIGSTOP"],
    correcta: "B",
    dificultad: "dificil",
    categoria: "Señales"
  },
  {
    enunciado: "¿Qué es un Page Fault (fallo de página) en gestión de memoria virtual?",
    opciones: [
      "Un error físico irreparable en los módulos DIMM",
      "El acceso a una página virtual no cargada actualmente en memoria física",
      "La pérdida de conexión SSH con el servidor",
      "Un fallo de sintaxis en un script Bash"
    ],
    correcta: "B",
    dificultad: "dificil",
    categoria: "Memoria Virtual"
  }
];

const escenariosVariacion = [
  { contexto: "Al administrar un servidor Debian en producción", etiqueta: "Producción" },
  { contexto: "Durante una práctica de laboratorio de Sistemas Operativos", etiqueta: "Laboratorio" },
  { contexto: "Al diagnosticar el comportamiento del sistema desde la terminal", etiqueta: "Diagnóstico" },
  { contexto: "En una evaluación teórica-práctica de arquitectura y SO", etiqueta: "Evaluación" }
];

function escapeSql(str) {
  return String(str).replace(/'/g, "''");
}

function rotarOpciones(opciones, letraCorrecta) {
  const mapa = { A: 0, B: 1, C: 2, D: 3 };
  const idxCorrecta = mapa[letraCorrecta];
  const textoCorrecto = opciones[idxCorrecta];

  const shift = 1;
  const rotadas = opciones.map((_, i) => opciones[(i + shift) % 4]);
  const nuevoIdx = rotadas.indexOf(textoCorrecto);
  const letras = ["A", "B", "C", "D"];

  return {
    rotadas,
    nuevaLetra: letras[nuevoIdx]
  };
}

function construir500Preguntas() {
  const resultado = [];
  let i = 0;

  while (resultado.length < 500) {
    const base = basePreguntas[i % basePreguntas.length];
    const esc = escenariosVariacion[Math.floor(i / basePreguntas.length) % escenariosVariacion.length];
    const ronda = Math.floor(i / (basePreguntas.length * escenariosVariacion.length)) + 1;

    const esOriginal = i < basePreguntas.length;
    const { rotadas, nuevaLetra } = esOriginal
      ? { rotadas: base.opciones, nuevaLetra: base.correcta }
      : rotarOpciones(base.opciones, base.correcta);

    const enunciado = esOriginal
      ? base.enunciado
      : `${esc.contexto} (Caso #${ronda}): ${base.enunciado}`;

    resultado.push({
      enunciado,
      opcion_a: rotadas[0],
      opcion_b: rotadas[1],
      opcion_c: rotadas[2],
      opcion_d: rotadas[3],
      respuesta_correcta: nuevaLetra,
      dificultad: base.dificultad,
      categoria: `${base.categoria} · ${esc.etiqueta}`
    });

    i++;
  }

  return resultado;
}

const preguntas = construir500Preguntas();
const outDir = path.join(__dirname, '..', 'sql');
fs.mkdirSync(outDir, { recursive: true });

const lineasSql = [
  "USE kernel_quest;",
  "TRUNCATE TABLE preguntas;",
  ""
];

const tamanoLote = 100;
for (let inicio = 0; inicio < preguntas.length; inicio += tamanoLote) {
  const lote = preguntas.slice(inicio, inicio + tamanoLote);
  lineasSql.push(
    "INSERT INTO preguntas (enunciado, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, dificultad, categoria) VALUES"
  );

  const valores = lote.map((p, idx) => {
    const coma = idx === lote.length - 1 ? ";" : ",";
    return `  ('${escapeSql(p.enunciado)}', '${escapeSql(p.opcion_a)}', '${escapeSql(p.opcion_b)}', '${escapeSql(p.opcion_c)}', '${escapeSql(p.opcion_d)}', '${escapeSql(p.respuesta_correcta)}', '${escapeSql(p.dificultad)}', '${escapeSql(p.categoria)}')${coma}`;
  });

  lineasSql.push(...valores, "");
}

const destinoSql = path.join(outDir, 'seed_500_preguntas.sql');
fs.writeFileSync(destinoSql, lineasSql.join('\n'), 'utf8');
console.log(`✅ Generadas ${preguntas.length} preguntas en ${destinoSql}`);