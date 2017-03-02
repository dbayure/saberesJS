(function () {
  'use strict';

  angular
    .module('tareas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tareas', {
        abstract: true,
        url: '/tareas',
        template: '<ui-view/>'
      })
      .state('tareas.list', {
        url: '',
        templateUrl: 'modules/tareas/views/list-tareas.client.view.html',
        controller: 'TareasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tareas List'
        }
      })
      .state('tareas.create', {
        url: '/create',
        templateUrl: 'modules/tareas/views/form-tarea.client.view.html',
        controller: 'TareasController',
        controllerAs: 'vm',
        resolve: {
          tareaResolve: newTarea
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Tareas Create'
        }
      })
      .state('tareas.edit', {
        url: '/:tareaId/edit',
        templateUrl: 'modules/tareas/views/form-tarea.client.view.html',
        controller: 'TareasController',
        controllerAs: 'vm',
        resolve: {
          tareaResolve: getTarea
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Tarea {{ tareaResolve.name }}'
        }
      })
      .state('tareas.view', {
        url: '/:tareaId',
        templateUrl: 'modules/tareas/views/view-tarea.client.view.html',
        controller: 'TareasController',
        controllerAs: 'vm',
        resolve: {
          tareaResolve: getTarea
        },
        data: {
          pageTitle: 'Tarea {{ tareaResolve.name }}'
        }
      });
  }

  getTarea.$inject = ['$stateParams', 'TareasService'];

  function getTarea($stateParams, TareasService) {
    return TareasService.get({
      tareaId: $stateParams.tareaId
    }).$promise;
  }

  newTarea.$inject = ['TareasService'];

  function newTarea(TareasService) {
    return new TareasService();
  }
}());
