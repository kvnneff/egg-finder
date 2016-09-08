/*global describe, it, afterEach, beforeEach*/
import assert from 'assert'
import utils from 'deku-testutils'
import clone from 'component-clone'
import ProfileForm from '../../../client/components/profile/form'

const assertElement = utils.assert

var location = {
  name: 'Mezzaluna Farms',
  isPublic: true,
  available: true,
  price: 5,
  address1: 'address1',
  address2: 'address2',
  city: 'Williams',
  state: 'OR',
  zipcode: 90210,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
}

function handleSubmit () {

}

describe('Profile Form', function () {
  var locationObject = {}

  beforeEach(function (done) {
    locationObject = clone(location)
    done()
  })

  describe('render()', function () {
    it('renders the form', () => {
      const props = { handleSubmit: handleSubmit, location: locationObject }
      const component = ProfileForm.render({ props: props })
      console.log(component)
      assertElement.hasClass(component, 'Form')
    })
  })
})
