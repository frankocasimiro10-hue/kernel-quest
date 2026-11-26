# 🐉 KERNEL QUEST v2.0 — Mundo 2D & Combate de Sistemas Operativos

Videojuego multijugador en tiempo real con mundo 2D y duelos PvP por turnos impulsados por preguntas de **Sistemas Operativos y Linux**, desplegado sobre **Debian** con **Node.js**, **Socket.io** y **MariaDB**.

---

## 📑 Tabla de contenidos
1. [Descripción del proyecto](#descripción-del-proyecto)
2. [Características principales](#características-principales)
3. [Tecnologías utilizadas](#tecnologías-utilizadas)
4. [Requisitos previos](#requisitos-previos)
5. [Guía de instalación paso a paso](#guía-de-instalación-paso-a-paso)
6. [Credenciales de acceso](#credenciales-de-acceso)
7. [Configuración del sistema](#configuración-del-sistema)
8. [Roles y módulos](#roles-y-módulos)
9. [Estructura del proyecto](#estructura-del-proyecto)
10. [Base de datos](#base-de-datos)
11. [Reglas de negocio](#reglas-de-negocio)
12. [Solución de problemas](#solución-de-problemas)
13. [Autores](#autores)

---

## 📝 Descripción del proyecto
**Kernel Quest** es una aplicación web interactiva diseñada para el curso de **Fundamentos de Sistemas Operativos**. Los jugadores ingresan a un mundo 2D dividido por zonas, eligen una facción y un rol de combate, y se enfrentan en duelos estratégicos donde cada habilidad especial requiere responder correctamente preguntas sobre Linux, gestión de procesos, memoria, concurrencia y administración de sistemas.

---

## ✨ Características principales
- **Mundo 2D multijugador en tiempo real** sincronizado a 20 FPS mediante WebSockets (`Socket.io`).
- **20 roles jugables** distribuidos en 5 ramas (Marcial, Arcana, Sagrada, Sigilo e Híbrida) más **1 clase oculta** con 1% de probabilidad de aparición (*Sabio de la Fuente Única*).
- **Sistema de combate táctico por turnos** con 4 escenarios aleatorios, ataques físicos/mágicos, buffs, debuffs, pasivas del Oráculo, despertar al borde de la muerte (<25% HP) y barra de contraataque.
- **Banco de 500 preguntas** de Sistemas Operativos almacenadas en MariaDB y clasificadas por dificultad (`facil`, `medio`, `dificil`), con respaldo local automático.
- **Persistencia y Ranking** de usuarios, victorias, derrotas y combates mediante API REST (`/api/ranking`).

---

## 🛠️ Tecnologías utilizadas
- **Sistema Operativo / Servidor:** Debian Linux (VirtualBox, SSH en puerto `2222`).
- **Backend:** Node.js, Express, Socket.io, `dotenv`, `cors`.
- **Base de Datos:** MariaDB Server + conector `mysql2/promise` (Pool de conexiones).
- **Frontend:** HTML5, CSS3 y JavaScript (cliente 2D en carpeta `public/`).
- **Herramientas de despliegue y control:** Git, GitHub, PuTTY y WinSCP.

---

## 📋 Requisitos previos
Antes de instalar el proyecto, asegúrate de contar con:
- **Node.js** (v18 o superior) y **npm**.
- **MariaDB Server** instalado y en ejecución.
- **Git** instalado.
- Acceso al puerto **3000** (o reenvío de puertos configurado en VirtualBox: anfitrión `3000` → invitado `3000`).

---

## 🚀 Guía de instalación paso a paso

### 1. Clonar el repositorio
```bash
git clone [https://github.com/frankocasimiro10-hue/kernel-quest.git](https://github.com/frankocasimiro10-hue/kernel-quest.git)
cd kernel-quest
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Crear la base de datos y el usuario en MariaDB
```bash
sudo mariadb -e "CREATE DATABASE IF NOT EXISTS kernel_quest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER IF NOT EXISTS 'kernel_user'@'localhost' IDENTIFIED BY 'tu_password_aqui'; GRANT ALL PRIVILEGES ON kernel_quest.* TO 'kernel_user'@'localhost'; FLUSH PRIVILEGES;"
```

### 4. Importar el esquema y las 500 preguntas
```bash
mariadb -u kernel_user -p kernel_quest < sql/database.sql
mariadb -u kernel_user -p kernel_quest < sql/seed_500_preguntas.sql
```
*(Opcional: si deseas regenerar el archivo de 500 preguntas, ejecuta `node scripts/generar_500_preguntas.js` antes de importar).*

### 5. Configurar variables de entorno
Copia la plantilla `.env.example` a `.env` y coloca tus credenciales reales:
```bash
cp .env.example .env
nano .env
```

### 6. Iniciar el servidor
```bash
node server.js
```
Abre tu navegador en **`http://localhost:3000`**.

---

## 🔐 Credenciales de acceso
Por seguridad, las contraseñas reales no se suben al repositorio (`.env` está excluido en `.gitignore`). Referencia de acceso local en el entorno de pruebas:

- **Aplicación web:** `http://localhost:3000` (acceso libre eligiendo Alias, Facción y Rol).
- **API de Ranking:** `http://localhost:3000/api/ranking`
- **Base de datos (plantilla `.env.example`):**
  - Host: `localhost`
  - Base de datos: `kernel_quest`
  - Usuario de pruebas: `kernel_user` *(configurar contraseña en `.env`)*
- **Servidor Debian (entorno VM):** Usuario `sistema` vía SSH (puerto `2222`).

---

## ⚙️ Configuración del sistema
El proyecto utiliza un archivo `.env` en la raíz con las siguientes variables:

```env
DB_HOST=localhost
DB_USER=kernel_user
DB_PASS=tu_password_aqui
DB_NAME=kernel_quest
PORT=3000
```

Para dejar el servidor ejecutándose en segundo plano en Debian:
```bash
nohup node server.js > app.log 2>&1 &
```

---

## 🧩 Roles y módulos
- **Módulo de Mundo 2D (`server.js` + `public/`):** Control de movimiento, detección de zonas (Zona 1 Segura, Zona 2 Belicista, Zona 3 Caos), descanso y retos PvP por proximidad.
- **Módulo de Roles (`roles.js`):** Definición de estadísticas base (HP, ataque físico/mágico, defensa física/mágica), habilidades por dificultad, pasivas y debuffs de las 20 clases + clase oculta.
- **Módulo de Combate y Preguntas (`server.js`):** Gestión de salas de duelo, temporizador de 10 segundos, cálculo de daño, contraataques, efectos aleatorios y baraja sin repetición.
- **Módulo de Persistencia (`db.js` + `sql/`):** Pool de conexiones a MariaDB, carga inicial de preguntas, registro automático de jugadores y actualización de estadísticas tras cada duelo.

---

## 📁 Estructura del proyecto
```text
kernel-quest/
├── docs/                          # Documentación adicional del proyecto
├── public/                        # Frontend del juego (HTML, CSS, JS 2D)
├── scripts/
│   └── generar_500_preguntas.js   # Generador del seed SQL de 500 preguntas
├── sql/
│   ├── database.sql               # Esquema de tablas (usuarios, preguntas, combates)
│   └── seed_500_preguntas.sql     # Carga masiva de 500 preguntas de SO
├── .env.example                   # Plantilla de variables de entorno
├── .gitignore                     # Exclusión de node_modules, .env y logs
├── db.js                          # Pool de conexión a MariaDB
├── package.json                   # Dependencias y metadatos de Node.js
├── roles.js                       # Catálogo de clases y habilidades
├── server.js                      # Servidor Express + Socket.io + lógica del juego
└── README.md                      # Documentación principal
```

---

## 🗄️ Base de datos
La base de datos **`kernel_quest`** en MariaDB está compuesta por 3 tablas principales:

| Tabla | Descripción | Campos clave |
| :--- | :--- | :--- |
| **`usuarios`** | Registro de jugadores y estadísticas globales | `id`, `username`, `password_hash`, `puntos`, `victorias`, `derrotas` |
| **`preguntas`** | Banco de 500 preguntas de Sistemas Operativos | `id`, `enunciado`, `opcion_a..d`, `respuesta_correcta`, `dificultad`, `categoria` |
| **`combates`** | Historial de duelos finalizados | `id`, `jugador1_id`, `jugador2_id`, `ganador_id`, `puntos_ganados` |

---

## 📜 Reglas de negocio
1. **Zonas del mapa:**
   - **Zona 1 (Ciudad Alianza):** Zona segura; el PvP está desactivado y los jugadores pueden descansar para restaurar el 100% de su HP.
   - **Zona 2 (Territorio Belicista):** Solo se permite retar a jugadores de la facción contraria (*La Alianza* vs *Renegados*).
   - **Zona 3 (Zona de Caos):** PvP libre entre cualquier jugador y mayor probabilidad de aparición del Oráculo (65%).
2. **Duelos y preguntas:** Las habilidades especiales requieren responder correctamente una pregunta acorde a su dificultad (`facil`, `medio` o `dificil`). Fallar carga la barra de contraataque del rival.
3. **Puntuación:** Al finalizar un combate, el ganador suma **+25 puntos** y **+1 victoria** en MariaDB; el perdedor registra **+1 derrota** y reaparece en Ciudad Alianza con el 50% de HP.
4. **Clase Oculta:** Al ingresar al mundo existe un **1% de probabilidad** de despertar automáticamente la clase *Sabio de la Fuente Única*.

---

## 🔧 Solución de problemas
- **`Error: Access denied for user 'root'@'localhost'`:** Verifica que el archivo `.env` exista y tenga configurado `DB_USER=kernel_user` y la contraseña correcta de MariaDB.
- **El navegador no carga `http://localhost:3000`:** Confirma que `node server.js` esté activo en Debian y que el reenvío de puertos en VirtualBox (`3000 -> 3000`) esté habilitado.
- **No se cargan las 500 preguntas:** Comprueba el conteo en MariaDB con:
  ```bash
  mariadb -u kernel_user -p kernel_quest -e "SELECT COUNT(*) FROM preguntas;"
  ```
- **Puerto 3000 ocupado:** Detén instancias previas con `pkill -f "node server.js"` o cambia `PORT` en `.env`.

---

## 👥 Autores
- **Franco Antony Casimiro Coronado** — Desarrollo, integración de base de datos y despliegue en Debian ([@frankocasimiro10-hue](https://github.com/frankocasimiro10-hue))
- **Ramos Arzapalo Josepth Cesar** — Diseño de lore, narrativa y personajes