const locationFixture = () => {
  return {
    user_id: 'foo',
    name: 'Mezzaluna Farms',
    email: 'test@example.com',
    description: 'Foo',
    street: '16464 Williams Highway',
    is_public: true,
    zipcode: 97544,
    state: 'OR',
    city: 'Williams',
    available: true,
    price: 5,
    latitude: 42.2163097,
    longitude: -123.3672834,
    free_range: false,
    organic: false,
    drive_up: false
  }
}

module.exports = locationFixture
