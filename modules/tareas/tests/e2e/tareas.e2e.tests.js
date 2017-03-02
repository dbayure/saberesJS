'use strict';

describe('Tareas E2E Tests:', function () {
  describe('Test Tareas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/tareas');
      expect(element.all(by.repeater('tarea in tareas')).count()).toEqual(0);
    });
  });
});
