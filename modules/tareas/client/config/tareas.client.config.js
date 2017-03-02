(function () {
  'use strict';

  angular
    .module('tareas')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Tareas',
      state: 'tareas',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'tareas', {
      title: 'List Tareas',
      state: 'tareas.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'tareas', {
      title: 'Create Tarea',
      state: 'tareas.create',
      roles: ['user']
    });
  }
}());
