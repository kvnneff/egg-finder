const choo = require('choo')
const sf = require('sheetify')
const Home = require('./pages/home')
const Create = require('./pages/create')
const UserModel = require('./models/user')
const LocationModel = require('./models/location')
const API = require('./models/api')
const storage = require('./storage')

sf('normalize.css')
sf('tachyons')
sf('./styles.css', { global: true })

const app = choo()

app.use({
  onStateChange: (action, state) => {
    storage.save(state)
  }
})

app.model(UserModel)
app.model(LocationModel)
app.model(API)

app.router(route => [
  route('/', Home),
  route('/create', Create)
])

const tree = app.start()
document.body.appendChild(tree)
