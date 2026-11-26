CREATE DATABASE IF NOT EXISTS kernel_quest
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kernel_quest;

-- 1. Tabla de usuarios (autenticación y ranking)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  puntos INT NOT NULL DEFAULT 0,
  victorias INT NOT NULL DEFAULT 0,
  derrotas INT NOT NULL DEFAULT 0,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de preguntas del juego
CREATE TABLE IF NOT EXISTS preguntas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  enunciado TEXT NOT NULL,
  opcion_a VARCHAR(255) NOT NULL,
  opcion_b VARCHAR(255) NOT NULL,
  opcion_c VARCHAR(255) NOT NULL,
  opcion_d VARCHAR(255) NOT NULL,
  respuesta_correcta CHAR(1) NOT NULL,
  dificultad ENUM('facil', 'medio', 'dificil') NOT NULL DEFAULT 'facil',
  categoria VARCHAR(50) NOT NULL DEFAULT 'Sistemas Operativos'
);

-- 3. Tabla de historial de combates
CREATE TABLE IF NOT EXISTS combates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jugador1_id INT NOT NULL,
  jugador2_id INT NULL,
  ganador_id INT NULL,
  puntos_ganados INT NOT NULL DEFAULT 0,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (jugador1_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (jugador2_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (ganador_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Preguntas iniciales de prueba
INSERT INTO preguntas (enunciado, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, dificultad, categoria) VALUES
('¿Cuál es la función principal del kernel en un sistema operativo?', 'Editar documentos de texto', 'Gestionar el hardware y los recursos del sistema', 'Compilar código JavaScript', 'Administrar únicamente la red Wi-Fi', 'B', 'facil', 'Kernel'),
('¿Qué comando de Linux muestra los procesos activos en tiempo real?', 'ls -la', 'mkdir', 'top', 'chmod', 'C', 'facil', 'Linux'),
('¿Qué algoritmo de planificación asigna un quantum de tiempo fijo a cada proceso?', 'FIFO', 'SJF', 'Round Robin', 'Prioridad estática', 'C', 'medio', 'Planificación'),
('¿Qué ocurre durante un deadlock (interbloqueo)?', 'La CPU entra en modo ahorro de energía', 'Dos o más procesos se bloquean esperando recursos entre sí', 'Se libera toda la memoria RAM', 'El sistema reinicia el kernel automáticamente', 'B', 'medio', 'Concurrencia'),
('¿Qué comando cambia los permisos de un archivo en Linux?', 'chown', 'chmod', 'grep', 'ps', 'B', 'facil', 'Linux');