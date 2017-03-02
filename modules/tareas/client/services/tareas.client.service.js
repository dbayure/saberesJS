// Tareas service used to communicate Tareas REST endpoints
(function () {
  'use strict';

  angular
    .module('tareas')
    .factory('TareasService', TareasService);

  TareasService.$inject = ['$resource'];

  function TareasService($resource) {
    return $resource('api/tareas/:tareaId', {
      tareaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
