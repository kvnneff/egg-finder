const massive = require('massive')
const Emitter = require('component-emitter')
let db = null

const init = (dbName = 'eggfinder') => {
  massive.connect({ db: dbName }, (err, connection) => {
    if (err) throw err
    db = connection
    db.emitter = new Emitter()
    db.emitter.emit('ready')
  })
}

module.exports = init
