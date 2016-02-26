// /*global describe, it, before, afterEach*/
// import assert from 'assert'
// import request from 'supertest'
// import Loki from 'lokijs'
// import app from '../server'
// import * as geo from '../geo'
// import User from '../models/user'
// import auth0 from './utils/auth0'
// import users from './utils/users'
//
// const db = new Loki(__dirname + '/../../../db/db.json', { autoload: true })
// export const Users = db.addCollection('users', { indices: ['email'] })
//
// describe('API Routes', () => {
//   // let id_token
//
//   before((done) => {
//     users.forEach((user, index) => {
//       geo.validateAddress(user, (err, result) => {
//         if (err) return done(err)
//         User.save(result, (err) => {
//           if (err) return done(err)
//           if ((index + 1) === users.length) return done()
//         })
//       })
//     })
//
//     auth0((body) => {
//       // id_token = body.id_token
//       done()
//     })
//   })
//
//   afterEach((done) => {
//     geo.removeAll()
//     done()
//   })
//
//   describe('GET /api/locations', () => {
//     it('replies with a list of all locations', (done) => {
//       // req.set('Authorization', 'Bearer ' + id_token)
//       request(app).get('/api/locations')
//         .set('Accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .end((err, res) => {
//           if (err) return done(err)
//           assert.equal(res.body.locations.length, 5)
//           done()
//         })
//     })
//   })
//
//   // describe('GET /api/state', () => {
//   //   it('replies with user state', (done) => {
//   //     const req = request(app).get('/api/state')
//   //     agent.attachCookies(req)
//   //     req.set('Accept', 'application/json')
//   //       .expect('Content-Type', /json/)
//   //       .end((err, res) => {
//   //         if (err) return done(err)
//   //         assert.deepEqual(res.body, { user: {} })
//   //         done()
//   //       })
//   //   })
//   // })
// })
