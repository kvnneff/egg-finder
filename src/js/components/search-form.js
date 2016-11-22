const searchTypeAddressRadio = document.getElementById('type-address')
const searchTypeNameRadio = document.getElementById('type-name')
const searchInput = document.getElementById('input')

let addressValue = ''
let nameValue = ''

const mdlElement = document.body.querySelector('.mdl-js-textfield')

const searchForm = () => {  
  searchInput.addEventListener('change', (e) => {
    if (searchTypeAddressRadio.checked) {
      addressValue = e.target.value
    } else {
      nameValue = e.target.value
    }
      return
  })

  searchTypeAddressRadio.addEventListener('click', (e) => {
    searchInput.value = addressValue
    mdlElement.MaterialTextfield.checkDirty()
    document.querySelector('.mdl-textfield__label').innerText = 'Address'
    return
  })

  searchTypeNameRadio.addEventListener('click', (e) => {
    searchInput.value = nameValue
    mdlElement.MaterialTextfield.checkDirty()
    document.querySelector('.mdl-textfield__label').innerText = 'Farm Name'
    return
  })

  // Get initial value
  if (searchInput.value !== '') {
    if (searchTypeAddressRadio.checked) {
      addressValue = searchInput.value
    } else {
      nameValue = searchInput.value
    }
  }
}

module.exports = searchForm
