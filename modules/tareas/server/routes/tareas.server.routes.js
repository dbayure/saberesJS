'use strict';

/**
 * Module dependencies
 */
var tareasPolicy = require('../policies/tareas.server.policy'),
  tareas = require('../controllers/tareas.server.controller');

module.exports = function(app) {
  // Tareas Routes
  app.route('/api/tareas').all(tareasPolicy.isAllowed)
    .get(tareas.list)
    .post(tareas.create);

  app.route('/api/tareas/:tareaId').all(tareasPolicy.isAllowed)
    .get(tareas.read)
    .put(tareas.update)
    .delete(tareas.delete);

  // Finish by binding the Tarea middleware
  app.param('tareaId', tareas.tareaByID);
};
