const h = require('choo/html')
const serialize = require('form-serialize')

const Create = (state, prevState, dispatch) => {
  const errors = state.locations.formErrors

  return h`<div>
    <h1>Create A Profile</h1>
    <div>
      ${Form({ errors }, dispatch)}
    </div>`
}

const Form = (state, dispatch) => {
  const errors = state.errors

  const validateForm = (e) => {
    e.preventDefault()
    console.log(e.target)
    const data = serialize(e.target, { hash: true })
    const errors = {}
    console.log(data)

    if (!data.name) {
      errors.name = 'Required'
    } else if (data.name.length < 3) {
      errors.name = 'Must be at least 3 characters'
    }

    if (!data.city) errors.city = 'Required'
    if (!data.state) errors.state = 'Required'
    if (!data.zipcode) errors.zipcode = 'Required'

    if (Object.keys(errors).length === 0) {
      return dispatch('submit', data)
    }
    return dispatch('locations:formErrors', errors)
  }


  const el = h`<form method="post" onsubmit=${validateForm}>
    <div>
      <label for="name">
        Farm or Display Name
      </label>
      <input type="text" name="name" id="name" required="true">
      <div>${errors.name}</div>
    </div>
    <div>
      <label for="phone">
        Phone Number
      </label>
      <input type="tel" name="phone" id="phone">
      <div>${errors.phone}</div>
    </div>
    <div>
      <label for="email">
        Farm contact email
      </label>
      <input type="email" name="email" id="email">
      <div>${errors.email}</div>
    </div>
    <div>
      <label for="public">
        List profile publicly
      </label>
      <input type="checkbox" name="is_public" id="is_public" checked="" value="true">
      <div>${errors.is_public}</div>
    </div>
    <div>
      <label for="available">
        Eggs currently in stock
      </label>
      <input type="checkbox" name="available" id="available" checked="" value="true">
      <div>${errors.available}</div>
    </div>
    <div>
      <label for="free_range">
        Free-range
      </label>
      <input type="checkbox" name="free_range" id="free_range" checked="" value="true">
      <div>${errors.free_range}</div>
    </div>
    <div>
      <label for="organic">
        Organic
      </label>
      <input type="checkbox" name="organic" id="organic" checked="" value="true">
      <div>${errors.organic}</div>
    </div>
    <div>
      <label for="price">
        Price per dozen
      </label>
      <input type="number" name="price" id="price" required="true" step="0.50" min="0.50">
      <div>${errors.price}</div>
    </div>
    <div>
      <label for="street">
        Address or nearest intersection
      </label>
      <input type="text" name="street" id="street">
      <div>${errors.street}</div>
    </div>
    <div>
      <label for="city">
        City
      </label>
      <input type="text" name="city" id="city" required="true">
      <div>${errors.city}</div>
    </div>
    <div>
      <label for="state">
        State
      </label>
      <input type="text" name="state" id="state" required="true">
      <div>${errors.state}</div>
    </div>
    <div>
      <label for="zipcode">
        Zipcode
      </label>
      <input type="text" name="zipcode" id="zipcode" required="true">
      <div>${errors.zipcode}</div>
    </div>
    <div class="Form-group Form-textareaGroup">
      <label for="description">
        Description
      </label>
      <textarea name="description" id="description" required="true"></textarea>
      <div>${errors.description}</div>
    </div>
    <button type="submit">Submit</button>
  </form>`

  el.noValidate = true

  return el
}

module.exports = Create
