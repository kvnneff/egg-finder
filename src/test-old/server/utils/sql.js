import Users from '../../schema/user'
import Locations from '../../schema/location'
import pg from 'pg'

const conString = process.env.PG_CONNECTION_STRING

export function dropTables (cb) {
  pg.connect(conString, (err, client, done) => {
    if (err) throw err
    client.query(Users.drop().toQuery(), (err) => {
      if (err) throw err
      client.query(Locations.drop().toQuery(), (err) => {
        if (err) throw err
        done()
        return cb()
      })
    })
  })
}

export function createTables (cb) {
  pg.connect(conString, (err, client, done) => {
    if (err) throw err
    client.query(Users.create().toQuery(), (err, res) => {
      if (err) throw err
      client.query(Locations.create().toQuery(), (err) => {
        if (err) throw err
        done()
        return cb()
      })
    })
  })
}

export default { dropTables, createTables }
