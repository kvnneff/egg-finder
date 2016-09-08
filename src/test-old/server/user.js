// /*global describe, it, afterEach, beforeEach*/
// import assert from 'assert'
// import User from '../models/user'
// import { insert } from '../models/user'
//
// // afterEach((done) => {
// //   dropTables(() => { done() })
// // })
// //
// // beforeEach((done) => {
// //   createTables(() => {
// //     done()
// //   })
// // })
//
// const data = {
//   id: 'foo',
//   displayName: 'bar',
//   email: 'foo@bar.com'
// }
//
// describe('create(data)', () => {
//   it('returns a user object', () => {
//     const user = User.create(data)
//     assert.equal(user.id, 'foo')
//     assert.equal(user.displayName, 'bar')
//     assert.equal(user.email, 'foo@bar.com')
//   })
// })
//
// describe('save(user, cb)', () => {
//   it('writes a user to the database', (done) => {
//     const user = User.create(data)
//     User.save(user, (err, user) => {
//       assert.equal(err, null)
//       User.findById(user.id, (err, foundUser) => {
//         assert.equal(err, null)
//         assert.equal(user.id, foundUser.id)
//         done()
//       })
//     })
//   })
// })
//
// describe('findById(id, cb)', () => {
//   it('finds a user by their id', (done) => {
//     const user = User.create(data)
//     User.save(user, (err, user) => {
//       assert.equal(err, null)
//       User.findById(user.id, (err, foundUser) => {
//         assert.equal(err, null)
//         assert.equal(user.id, foundUser.id)
//         done()
//       })
//     })
//   })
// })
//
// describe('insertUser(user, cb)', () => {
//   it('inserts a user into the data store', (done) => {
//     const user = User.create(data)
//     insert(user, (err, user) => {
//       assert.equal(err, null)
//       User.findById(user.id, (err, foundUser) => {
//         assert.equal(err, null)
//         assert.equal(user.id, foundUser.id)
//         done()
//       })
//     })
//   })
// })
//
// describe('updateUser(user, cb)', () => {
//   it('updates an existing user in the data store', (done) => {
//     const user = User.create(data)
//     insert(user, (err, user) => {
//       assert.equal(err, null)
//       user.displayName = 'qux'
//       User.update(user, (err, user) => {
//         assert.equal(err, null)
//         User.findById(user.id, (err, foundUser) => {
//           assert.equal(err, null)
//           assert.equal('qux', foundUser.displayName)
//           done()
//         })
//       })
//     })
//   })
// })
//
// describe('removeUser(user, cb)', () => {
//   it('removes a user from the data store', (done) => {
//     const user = User.create(data)
//     User.save(user, (err, user) => {
//       assert.equal(err, null)
//       User.findById(user.id, (err, user) => {
//         assert.equal(err, null)
//         User.remove(user, (err, result) => {
//           assert.equal(err, null)
//           assert(result)
//           User.findById(user.id, (err, user) => {
//             assert.equal(err, null)
//             assert.equal(user, null)
//             done()
//           })
//         })
//       })
//     })
//   })
// })
