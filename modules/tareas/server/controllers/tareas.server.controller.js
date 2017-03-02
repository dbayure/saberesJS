'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Tarea = mongoose.model('Tarea'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Tarea
 */
exports.create = function(req, res) {
  var tarea = new Tarea(req.body);
  tarea.user = req.user;

  tarea.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tarea);
    }
  });
};

/**
 * Show the current Tarea
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var tarea = req.tarea ? req.tarea.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  tarea.isCurrentUserOwner = req.user && tarea.user && tarea.user._id.toString() === req.user._id.toString();

  res.jsonp(tarea);
};

/**
 * Update a Tarea
 */
exports.update = function(req, res) {
  var tarea = req.tarea;

  tarea = _.extend(tarea, req.body);

  tarea.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tarea);
    }
  });
};

/**
 * Delete an Tarea
 */
exports.delete = function(req, res) {
  var tarea = req.tarea;

  tarea.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tarea);
    }
  });
};

/**
 * List of Tareas
 */
exports.list = function(req, res) {
  Tarea.find().sort('-created').populate('user', 'displayName').exec(function(err, tareas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tareas);
    }
  });
};

/**
 * Tarea middleware
 */
exports.tareaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tarea is invalid'
    });
  }

  Tarea.findById(id).populate('user', 'displayName').exec(function (err, tarea) {
    if (err) {
      return next(err);
    } else if (!tarea) {
      return res.status(404).send({
        message: 'No Tarea with that identifier has been found'
      });
    }
    req.tarea = tarea;
    next();
  });
};
