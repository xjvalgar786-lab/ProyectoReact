const { Op } = require("sequelize");
const initModels = require("../models/init-models");
const sequelize = require("../config/sequelize");
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger");

class PartidosController {
  async getAllPartidos(req, res) {
    try {
      const { jugador } = req.query;
      const { partidos, torneos, users } = initModels(sequelize);

      const where = {};
      if (jugador) {
        const terms = jugador.toLowerCase().split(' ').filter(Boolean);
        where[Op.and] = terms.map((term) => ({
          [Op.or]: [
            sequelize.where(sequelize.fn('LOWER', sequelize.col('jugador1.nombre')), { [Op.like]: `%${term}%` }),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('jugador1.apellido')), { [Op.like]: `%${term}%` }),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('jugador2.nombre')), { [Op.like]: `%${term}%` }),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('jugador2.apellido')), { [Op.like]: `%${term}%` })
          ]
        }));
      }

      const data = await partidos.findAll({
        where,
        include: [
          { model: users, as: 'jugador1', attributes: ['id', 'nombre', 'apellido'] },
          { model: users, as: 'jugador2', attributes: ['id', 'nombre', 'apellido'] },
          { model: users, as: 'ganador', attributes: ['id', 'nombre', 'apellido'] },
          { model: torneos, as: 'torneo', attributes: ['id', 'nombre', 'fecha_fin'] }
        ],
        order: [['fecha_partido', 'DESC']]
      });

      return res.status(200).json(Respuesta.exito(data, "Partidos obtenidos correctamente"));
    } catch (error) {
      logMensaje("Error en getAllPartidos: " + error);
      return res.status(500).json(Respuesta.error(null, "Error al obtener partidos"));
    }
  }

  async getPartidosByTorneo(req, res) {
    try {
      const { torneo_id } = req.params;
      const { partidos } = initModels(sequelize);

      const data = await partidos.findAll({
        where: { torneo_id },
        include: ['jugador1', 'jugador2', 'ganador'],
        order: [['ronda', 'ASC']]
      });

      return res.status(200).json(Respuesta.exito(data, "Partidos del torneo obtenidos"));
    } catch (error) {
      logMensaje("Error en getPartidosByTorneo: " + error);
      return res.status(500).json(Respuesta.error(null, "Error al obtener partidos del torneo"));
    }
  }

  async getPartidosByJugador(req, res) {
    try {
      const usuarioId = req.user.id;
      const { fecha_desde } = req.query;
      const { partidos, torneos } = initModels(sequelize);

      const where = {
        [Op.or]: [
          { jugador1_id: usuarioId },
          { jugador2_id: usuarioId }
        ]
      };

      if (fecha_desde) {
        const fecha = new Date(fecha_desde);
        if (!Number.isNaN(fecha.getTime())) {
          where.fecha_partido = { [Op.gte]: fecha };
        }
      }

      const data = await partidos.findAll({
        where,
        include: [
          'jugador1',
          'jugador2',
          'ganador',
          { model: torneos, as: 'torneo', attributes: ['id', 'nombre', 'fecha_fin'] }
        ],
        order: [['fecha_partido', 'DESC']]
      });

      return res.status(200).json(Respuesta.exito(data, "Partidos del jugador obtenidos"));
    } catch (error) {
      logMensaje("Error en getPartidosByJugador: " + error);
      return res.status(500).json(Respuesta.error(null, "Error al obtener partidos del jugador"));
    }
  }

  async createPartido(req, res) {
    try {
      const { torneo_id, jugador1_id, jugador2_id, ronda } = req.body;
      const { partidos } = initModels(sequelize);

      if (!torneo_id || !jugador1_id || !jugador2_id || !ronda) {
        return res.status(400).json(Respuesta.error(null, "Todos los campos son obligatorios"));
      }

      const newPartido = await partidos.create({
        torneo_id,
        jugador1_id,
        jugador2_id,
        ronda,
        estado: 'pendiente'
      });

      return res.status(201).json(Respuesta.exito(newPartido, "Partido creado correctamente"));
    } catch (error) {
      logMensaje("Error en createPartido: " + error);
      return res.status(500).json(Respuesta.error(null, "Error al crear el partido"));
    }
  }

  async updatePartido(req, res) {
    try {
      const { id } = req.params;
      const { resultado_jugador1, resultado_jugador2, ganador_id, estado, fecha_partido } = req.body;
      const { partidos } = initModels(sequelize);

      const partido = await partidos.findByPk(id);
      if (!partido) {
        return res.status(404).json(Respuesta.error(null, "Partido no encontrado"));
      }

      await partido.update({
        resultado_jugador1: resultado_jugador1 !== undefined ? resultado_jugador1 : partido.resultado_jugador1,
        resultado_jugador2: resultado_jugador2 !== undefined ? resultado_jugador2 : partido.resultado_jugador2,
        ganador_id: ganador_id || partido.ganador_id,
        estado: estado || partido.estado,
        fecha_partido: fecha_partido || partido.fecha_partido
      });

      return res.status(200).json(Respuesta.exito(partido, "Partido actualizado correctamente"));
    } catch (error) {
      logMensaje("Error en updatePartido: " + error);
      return res.status(500).json(Respuesta.error(null, "Error al actualizar el partido"));
    }
  }

  async deletePartido(req, res) {
    try {
      const { id } = req.params;
      const { partidos } = initModels(sequelize);

      const partido = await partidos.findByPk(id);
      if (!partido) {
        return res.status(404).json(Respuesta.error(null, "Partido no encontrado"));
      }

      await partido.destroy();

      return res.status(200).json(Respuesta.exito(null, "Partido eliminado correctamente"));
    } catch (error) {
      logMensaje("Error en deletePartido: " + error);
      return res.status(500).json(Respuesta.error(null, "Error al eliminar el partido"));
    }
  }
}

module.exports = new PartidosController();