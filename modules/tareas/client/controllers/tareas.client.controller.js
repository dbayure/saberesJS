(function () {
  'use strict';

  // Tareas controller
  angular
    .module('tareas')
    .controller('TareasController', TareasController);

  TareasController.$inject = ['$scope', '$state', '$window', 'Authentication', 'tareaResolve'];

  function TareasController ($scope, $state, $window, Authentication, tarea) {
    var vm = this;

    vm.authentication = Authentication;
    vm.tarea = tarea;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Tarea
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.tarea.$remove($state.go('tareas.list'));
      }
    }

    // Save Tarea
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tareaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.tarea._id) {
        vm.tarea.$update(successCallback, errorCallback);
      } else {
        vm.tarea.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('tareas.view', {
          tareaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
