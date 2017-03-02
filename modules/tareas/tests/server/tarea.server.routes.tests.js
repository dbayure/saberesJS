'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tarea = mongoose.model('Tarea'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  tarea;

/**
 * Tarea routes tests
 */
describe('Tarea CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Tarea
    user.save(function () {
      tarea = {
        name: 'Tarea name'
      };

      done();
    });
  });

  it('should be able to save a Tarea if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tarea
        agent.post('/api/tareas')
          .send(tarea)
          .expect(200)
          .end(function (tareaSaveErr, tareaSaveRes) {
            // Handle Tarea save error
            if (tareaSaveErr) {
              return done(tareaSaveErr);
            }

            // Get a list of Tareas
            agent.get('/api/tareas')
              .end(function (tareasGetErr, tareasGetRes) {
                // Handle Tareas save error
                if (tareasGetErr) {
                  return done(tareasGetErr);
                }

                // Get Tareas list
                var tareas = tareasGetRes.body;

                // Set assertions
                (tareas[0].user._id).should.equal(userId);
                (tareas[0].name).should.match('Tarea name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Tarea if not logged in', function (done) {
    agent.post('/api/tareas')
      .send(tarea)
      .expect(403)
      .end(function (tareaSaveErr, tareaSaveRes) {
        // Call the assertion callback
        done(tareaSaveErr);
      });
  });

  it('should not be able to save an Tarea if no name is provided', function (done) {
    // Invalidate name field
    tarea.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tarea
        agent.post('/api/tareas')
          .send(tarea)
          .expect(400)
          .end(function (tareaSaveErr, tareaSaveRes) {
            // Set message assertion
            (tareaSaveRes.body.message).should.match('Please fill Tarea name');

            // Handle Tarea save error
            done(tareaSaveErr);
          });
      });
  });

  it('should be able to update an Tarea if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tarea
        agent.post('/api/tareas')
          .send(tarea)
          .expect(200)
          .end(function (tareaSaveErr, tareaSaveRes) {
            // Handle Tarea save error
            if (tareaSaveErr) {
              return done(tareaSaveErr);
            }

            // Update Tarea name
            tarea.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Tarea
            agent.put('/api/tareas/' + tareaSaveRes.body._id)
              .send(tarea)
              .expect(200)
              .end(function (tareaUpdateErr, tareaUpdateRes) {
                // Handle Tarea update error
                if (tareaUpdateErr) {
                  return done(tareaUpdateErr);
                }

                // Set assertions
                (tareaUpdateRes.body._id).should.equal(tareaSaveRes.body._id);
                (tareaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Tareas if not signed in', function (done) {
    // Create new Tarea model instance
    var tareaObj = new Tarea(tarea);

    // Save the tarea
    tareaObj.save(function () {
      // Request Tareas
      request(app).get('/api/tareas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Tarea if not signed in', function (done) {
    // Create new Tarea model instance
    var tareaObj = new Tarea(tarea);

    // Save the Tarea
    tareaObj.save(function () {
      request(app).get('/api/tareas/' + tareaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', tarea.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Tarea with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tareas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Tarea is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Tarea which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Tarea
    request(app).get('/api/tareas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Tarea with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Tarea if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tarea
        agent.post('/api/tareas')
          .send(tarea)
          .expect(200)
          .end(function (tareaSaveErr, tareaSaveRes) {
            // Handle Tarea save error
            if (tareaSaveErr) {
              return done(tareaSaveErr);
            }

            // Delete an existing Tarea
            agent.delete('/api/tareas/' + tareaSaveRes.body._id)
              .send(tarea)
              .expect(200)
              .end(function (tareaDeleteErr, tareaDeleteRes) {
                // Handle tarea error error
                if (tareaDeleteErr) {
                  return done(tareaDeleteErr);
                }

                // Set assertions
                (tareaDeleteRes.body._id).should.equal(tareaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Tarea if not signed in', function (done) {
    // Set Tarea user
    tarea.user = user;

    // Create new Tarea model instance
    var tareaObj = new Tarea(tarea);

    // Save the Tarea
    tareaObj.save(function () {
      // Try deleting Tarea
      request(app).delete('/api/tareas/' + tareaObj._id)
        .expect(403)
        .end(function (tareaDeleteErr, tareaDeleteRes) {
          // Set message assertion
          (tareaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Tarea error error
          done(tareaDeleteErr);
        });

    });
  });

  it('should be able to get a single Tarea that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Tarea
          agent.post('/api/tareas')
            .send(tarea)
            .expect(200)
            .end(function (tareaSaveErr, tareaSaveRes) {
              // Handle Tarea save error
              if (tareaSaveErr) {
                return done(tareaSaveErr);
              }

              // Set assertions on new Tarea
              (tareaSaveRes.body.name).should.equal(tarea.name);
              should.exist(tareaSaveRes.body.user);
              should.equal(tareaSaveRes.body.user._id, orphanId);

              // force the Tarea to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Tarea
                    agent.get('/api/tareas/' + tareaSaveRes.body._id)
                      .expect(200)
                      .end(function (tareaInfoErr, tareaInfoRes) {
                        // Handle Tarea error
                        if (tareaInfoErr) {
                          return done(tareaInfoErr);
                        }

                        // Set assertions
                        (tareaInfoRes.body._id).should.equal(tareaSaveRes.body._id);
                        (tareaInfoRes.body.name).should.equal(tarea.name);
                        should.equal(tareaInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Tarea.remove().exec(done);
    });
  });
});
