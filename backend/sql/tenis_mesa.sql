-- Script SQL para crear la base de datos del proyecto Tenis de Mesa
-- Ejecutar este script en MySQL para crear la estructura inicial

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS tfgTT;
USE tfgTT;

-- Crear tabla de usuarios
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 08-06-2026 a las 09:03:11
-- Versión del servidor: 8.0.39
-- Versión de PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tfgTT`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--

CREATE TABLE `inscripciones` (
  `id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `torneo_id` int NOT NULL,
  `fecha_inscripcion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('activa','cancelada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activa',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`id`, `usuario_id`, `torneo_id`, `fecha_inscripcion`, `estado`, `createdAt`, `updatedAt`) VALUES
(19, 2, 8, '2026-06-04 15:10:57', 'activa', '2026-06-04 15:10:57', '2026-06-04 15:10:57'),
(20, 4, 8, '2026-06-04 15:11:37', 'activa', '2026-06-04 15:11:37', '2026-06-04 15:11:37'),
(21, 5, 8, '2026-06-04 15:11:51', 'activa', '2026-06-04 15:11:51', '2026-06-04 15:11:51'),
(22, 6, 8, '2026-06-04 15:12:03', 'activa', '2026-06-04 15:12:03', '2026-06-04 15:12:03'),
(23, 7, 8, '2026-06-04 15:12:15', 'activa', '2026-06-04 15:12:15', '2026-06-04 15:12:15'),
(24, 8, 8, '2026-06-04 15:12:28', 'activa', '2026-06-04 15:12:28', '2026-06-04 15:12:28'),
(25, 10, 8, '2026-06-04 15:12:40', 'activa', '2026-06-04 15:12:40', '2026-06-04 15:12:40'),
(26, 11, 8, '2026-06-04 15:12:52', 'activa', '2026-06-04 15:12:52', '2026-06-04 15:12:52'),
(27, 2, 9, '2026-06-04 15:20:20', 'activa', '2026-06-04 15:20:20', '2026-06-04 15:20:20'),
(28, 4, 9, '2026-06-04 15:20:35', 'activa', '2026-06-04 15:20:35', '2026-06-04 15:20:35'),
(29, 5, 9, '2026-06-04 15:21:51', 'activa', '2026-06-04 15:21:51', '2026-06-04 15:21:51'),
(30, 6, 9, '2026-06-04 15:22:07', 'activa', '2026-06-04 15:22:07', '2026-06-04 15:22:07'),
(31, 7, 9, '2026-06-04 15:22:18', 'activa', '2026-06-04 15:22:18', '2026-06-04 15:22:18'),
(32, 8, 9, '2026-06-04 15:22:28', 'activa', '2026-06-04 15:22:28', '2026-06-04 15:22:28'),
(33, 9, 9, '2026-06-04 15:22:38', 'activa', '2026-06-04 15:22:38', '2026-06-04 15:22:38'),
(34, 10, 9, '2026-06-04 15:22:49', 'activa', '2026-06-04 15:22:49', '2026-06-04 15:22:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias`
--

CREATE TABLE `noticias` (
  `id` int NOT NULL,
  `titulo` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contenido` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `autor_id` int DEFAULT NULL,
  `fecha_publicacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('borrador','publicada','archivada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'borrador',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidos`
--

CREATE TABLE `partidos` (
  `id` int NOT NULL,
  `torneo_id` int NOT NULL,
  `jugador1_id` int NOT NULL,
  `jugador2_id` int NOT NULL,
  `ronda` int NOT NULL,
  `resultado_jugador1` int DEFAULT NULL,
  `resultado_jugador2` int DEFAULT NULL,
  `ganador_id` int DEFAULT NULL,
  `fecha_partido` datetime DEFAULT NULL,
  `estado` enum('pendiente','jugado','cancelado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `partidos`
--

INSERT INTO `partidos` (`id`, `torneo_id`, `jugador1_id`, `jugador2_id`, `ronda`, `resultado_jugador1`, `resultado_jugador2`, `ganador_id`, `fecha_partido`, `estado`, `createdAt`, `updatedAt`) VALUES
(15, 8, 8, 7, 1, 2, 3, 7, NULL, 'pendiente', '2026-06-04 15:13:21', '2026-06-04 15:13:21'),
(16, 8, 4, 2, 1, 0, 3, 2, NULL, 'pendiente', '2026-06-04 15:13:21', '2026-06-04 15:13:21'),
(17, 8, 11, 10, 1, 1, 3, 10, NULL, 'pendiente', '2026-06-04 15:13:21', '2026-06-04 15:13:21'),
(18, 8, 6, 5, 1, 0, 3, 5, NULL, 'pendiente', '2026-06-04 15:13:21', '2026-06-04 15:13:21'),
(19, 8, 10, 7, 2, 2, 3, 7, NULL, 'pendiente', '2026-06-04 15:13:21', '2026-06-04 15:13:21'),
(20, 8, 5, 2, 2, 3, 0, 5, NULL, 'pendiente', '2026-06-04 15:13:21', '2026-06-04 15:13:21'),
(21, 8, 7, 5, 3, 0, 3, 5, NULL, 'pendiente', '2026-06-04 15:13:21', '2026-06-04 15:13:21'),
(22, 9, 8, 6, 1, 0, 3, 6, NULL, 'pendiente', '2026-06-04 15:23:27', '2026-06-04 15:23:27'),
(23, 9, 4, 5, 1, 0, 3, 5, NULL, 'pendiente', '2026-06-04 15:23:27', '2026-06-04 15:23:27'),
(24, 9, 7, 9, 1, 1, 3, 9, NULL, 'pendiente', '2026-06-04 15:23:27', '2026-06-04 15:23:27'),
(25, 9, 2, 10, 1, 3, 1, 2, NULL, 'pendiente', '2026-06-04 15:23:27', '2026-06-04 15:23:27'),
(26, 9, 6, 5, 2, 0, 3, 5, NULL, 'pendiente', '2026-06-04 15:23:27', '2026-06-04 15:23:27'),
(27, 9, 2, 9, 2, 0, 3, 9, NULL, 'pendiente', '2026-06-04 15:23:27', '2026-06-04 15:23:27'),
(28, 9, 5, 9, 3, 3, 0, 5, NULL, 'pendiente', '2026-06-04 15:23:28', '2026-06-04 15:23:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rankings`
--

CREATE TABLE `rankings` (
  `id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `posicion` int NOT NULL,
  `puntos_totales` int NOT NULL DEFAULT '0',
  `mes` int NOT NULL,
  `ano` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `torneos`
--

CREATE TABLE `torneos` (
  `id` int NOT NULL,
  `nombre` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `max_jugadores` int NOT NULL DEFAULT '16',
  `estado` enum('abierto','cerrado','en_curso','finalizado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'abierto',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `torneos`
--

INSERT INTO `torneos` (`id`, `nombre`, `descripcion`, `fecha_inicio`, `fecha_fin`, `max_jugadores`, `estado`, `createdAt`, `updatedAt`) VALUES
(8, 'Prueba para las relaciones entre entidades', 'tu ere una mardosa', '2026-06-05 00:00:00', '2026-06-05 00:00:00', 16, 'finalizado', '2026-06-04 15:10:42', '2026-06-04 15:13:21'),
(9, 'prueba final a ver', 'asfasdf', '2026-06-21 00:00:00', '2026-06-21 00:00:00', 16, 'finalizado', '2026-06-04 15:20:07', '2026-06-04 15:23:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nacionalidad` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `puntos` int NOT NULL DEFAULT '0',
  `rol` enum('jugador','administrador') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'jugador',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nombre`, `apellido`, `email`, `password`, `nacionalidad`, `puntos`, `rol`, `createdAt`, `updatedAt`) VALUES
(2, 'jesus', 'valdivia', 'jesus@gmail.com', '$2a$10$dFalJm3liTYwMZ1lHAcL1uYj1sGkO..T/MFwOXLv55Rxs7uUmGF2a', 'Española', 0, 'jugador', '2026-05-15 07:42:06', '2026-06-04 15:23:28'),
(3, 'Carmen', 'Roman', 'carmen@gmail.com', '$2a$10$tTVMQM9lMLLLV9sjE4XBLOQ2zOqYfDl3/9d/98.YMcOz/V3kEJpYG', 'Española', 0, 'administrador', '2026-05-15 07:42:39', '2026-06-04 07:57:55'),
(4, 'Herme', 'Sendra', 'herme@gmail.com', '$2a$10$N8cVrSjUg0M7/g6bI5G3GOcj6tvoJyuR3v1aUsvw2qmf52AOPpW92', 'Española', 0, 'jugador', '2026-05-15 07:44:16', '2026-06-04 15:23:28'),
(5, 'Daniel', 'Molina', 'daniel@gmail.com', '$2a$10$LgV56S3NkoPW7zxZL8ZDUeJ1JWvQxLIvXjZq91/fUwo3z5HQ11foO', 'Venezolana', 275, 'jugador', '2026-05-15 07:44:41', '2026-06-04 15:23:28'),
(6, 'Iker', 'Amores', 'iker@gmail.com', '$2a$10$MG7HDwYf2rxAmKAzkTyc0eCUyJIL7FMNgWHautZU7amGJ3UjTD9by', 'Marroqui', 0, 'jugador', '2026-05-15 07:45:11', '2026-06-04 15:23:28'),
(7, 'Jaime', 'Hernandez', 'jaime@gmail.com', '$2a$10$ni3EUny0f4j1/DSyOXFYNuxIO2b2KI5Vqkh89CMb6ZkoJCEWCJJNC', 'Española', 50, 'jugador', '2026-05-15 07:45:58', '2026-06-04 15:23:28'),
(8, 'Ruben', 'Barranco', 'ruben@gmail.com', '$2a$10$U/N6.CS6ZiOgQAk2EFHmJOmZroejAOrkCjo63hNWBoojwxt/1lhNm', 'Española', 0, 'jugador', '2026-05-15 07:46:31', '2026-06-04 15:23:28'),
(9, 'Lucia', 'Picon', 'lucia@gmail.com', '$2a$10$5VmLwRNr0P.5CBR80dD5uevjPskKEWib6HpHPL/OW.r.02EBdbcZi', 'Japonesa', 175, 'jugador', '2026-05-15 07:47:26', '2026-06-04 15:23:28'),
(10, 'Luis', 'Gonzalez', 'luis@gmail.com', '$2a$10$Qc8WxJZX670uRBZypybvX.Z/8Gb2uTJQruO7Vho5Kl7MU3AUfVTr6', 'Colombiana', 0, 'jugador', '2026-05-15 07:48:05', '2026-06-04 15:23:28'),
(11, 'Pedro ', 'Mata', 'pedro@gmail.com', '$2a$10$sqvAWm9BaqE/wo3ZNAZhQel6WRBLFW2t9EVZ/z2X5jQTJXy26ytBe', 'Española', 0, 'jugador', '2026-05-15 07:54:08', '2026-06-04 15:13:21');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `videos`
--

CREATE TABLE `videos` (
  `id` int NOT NULL,
  `titulo` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dificultad` enum('facil','medio','dificil') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'facil',
  `duracion` int DEFAULT NULL,
  `autor_id` int NOT NULL,
  `estado` enum('borrador','publicado','archivado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'borrador',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `videos`
--

INSERT INTO `videos` (`id`, `titulo`, `descripcion`, `url`, `dificultad`, `duracion`, `autor_id`, `estado`, `fecha_creacion`, `createdAt`, `updatedAt`) VALUES
(1, 'TopSpin', 'Técnica de top spin ', 'https://youtu.be/h-Qqe0Ty9KI', 'medio', 481, 3, 'publicado', '2026-05-15 08:18:57', '2026-05-15 08:18:57', '2026-05-15 08:21:13');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_inscripcion` (`usuario_id`,`torneo_id`),
  ADD KEY `torneo_id` (`torneo_id`);

--
-- Indices de la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor_id` (`autor_id`);

--
-- Indices de la tabla `partidos`
--
ALTER TABLE `partidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `torneo_id` (`torneo_id`),
  ADD KEY `jugador1_id` (`jugador1_id`),
  ADD KEY `jugador2_id` (`jugador2_id`),
  ADD KEY `ganador_id` (`ganador_id`);

--
-- Indices de la tabla `rankings`
--
ALTER TABLE `rankings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_ranking` (`usuario_id`,`mes`,`ano`);

--
-- Indices de la tabla `torneos`
--
ALTER TABLE `torneos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`);

--
-- Indices de la tabla `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor_id` (`autor_id`),
  ADD KEY `idx_dificultad` (`dificultad`),
  ADD KEY `idx_estado` (`estado`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `noticias`
--
ALTER TABLE `noticias`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `partidos`
--
ALTER TABLE `partidos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `rankings`
--
ALTER TABLE `rankings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `torneos`
--
ALTER TABLE `torneos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`torneo_id`) REFERENCES `torneos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD CONSTRAINT `noticias_ibfk_1` FOREIGN KEY (`autor_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `partidos`
--
ALTER TABLE `partidos`
  ADD CONSTRAINT `partidos_ibfk_1` FOREIGN KEY (`torneo_id`) REFERENCES `torneos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `partidos_ibfk_2` FOREIGN KEY (`jugador1_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `partidos_ibfk_3` FOREIGN KEY (`jugador2_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `partidos_ibfk_4` FOREIGN KEY (`ganador_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `rankings`
--
ALTER TABLE `rankings`
  ADD CONSTRAINT `rankings_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`autor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;



