(function () {
  'use strict';

  angular
    .module('tareas')
    .controller('TareasListController', TareasListController);

  TareasListController.$inject = ['TareasService'];

  function TareasListController(TareasService) {
    var vm = this;

    vm.tareas = TareasService.query();
  }
}());
