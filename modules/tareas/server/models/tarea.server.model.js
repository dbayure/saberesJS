'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tarea Schema
 */
var TareaSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Tarea name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Tarea', TareaSchema);
