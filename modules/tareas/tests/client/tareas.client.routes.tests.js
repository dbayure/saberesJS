(function () {
  'use strict';

  describe('Tareas Route Tests', function () {
    // Initialize global variables
    var $scope,
      TareasService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TareasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TareasService = _TareasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('tareas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/tareas');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TareasController,
          mockTarea;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('tareas.view');
          $templateCache.put('modules/tareas/client/views/view-tarea.client.view.html', '');

          // create mock Tarea
          mockTarea = new TareasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Tarea Name'
          });

          // Initialize Controller
          TareasController = $controller('TareasController as vm', {
            $scope: $scope,
            tareaResolve: mockTarea
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:tareaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.tareaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            tareaId: 1
          })).toEqual('/tareas/1');
        }));

        it('should attach an Tarea to the controller scope', function () {
          expect($scope.vm.tarea._id).toBe(mockTarea._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/tareas/client/views/view-tarea.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TareasController,
          mockTarea;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('tareas.create');
          $templateCache.put('modules/tareas/client/views/form-tarea.client.view.html', '');

          // create mock Tarea
          mockTarea = new TareasService();

          // Initialize Controller
          TareasController = $controller('TareasController as vm', {
            $scope: $scope,
            tareaResolve: mockTarea
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.tareaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/tareas/create');
        }));

        it('should attach an Tarea to the controller scope', function () {
          expect($scope.vm.tarea._id).toBe(mockTarea._id);
          expect($scope.vm.tarea._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/tareas/client/views/form-tarea.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TareasController,
          mockTarea;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('tareas.edit');
          $templateCache.put('modules/tareas/client/views/form-tarea.client.view.html', '');

          // create mock Tarea
          mockTarea = new TareasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Tarea Name'
          });

          // Initialize Controller
          TareasController = $controller('TareasController as vm', {
            $scope: $scope,
            tareaResolve: mockTarea
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:tareaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.tareaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            tareaId: 1
          })).toEqual('/tareas/1/edit');
        }));

        it('should attach an Tarea to the controller scope', function () {
          expect($scope.vm.tarea._id).toBe(mockTarea._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/tareas/client/views/form-tarea.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
