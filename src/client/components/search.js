const h = require('choo/html')

const defaultCriteria = {
  type: 'address',
  search_text: '',
  organic: false,
  freerange: false
}

const Search = (state = {}) => {
  const onSubmit = state.onSubmit
  const searchCriteria = Object.assign(defaultCriteria, state.searchCriteria)
  const {
    type,
    search_text,
    organic,
    freerange
  } = searchCriteria

  return h`<form onsubmit=${onSubmit} class="Search tl">
    <div class="mb3">
      <label class="db" for="type">
        <span class="db b">Search By</span>
        <select class="w-100" name="type">
          <option value="address" selected="${type === 'address'}">Address</option>
          <option value="name" selected="${type === 'name'}">Farm Name</option>
        </select>
      </label>
    </div>
    <div class="mb3">
      <label class="db" for="input">
        <span class="db b">Search For</span>
        <input class="w-100" type="text" name="search_text" id="search_text" value="${search_text}">
      </label>
    </div>
    <div class="mb3">
      <label for="organic">
        <input type="checkbox" id="organic" name="organic" checked="${organic}">
        <span class="b">Organic</span>
      </label>
    </div>
    <div class="mb3">
      <label for="freerange">
        <input type="checkbox" id="freerange" name="freerange" checked="${freerange}">
        <span class="b">Free Range</span>
      </label>
    </div>
    <button class="b--white w-100 pa3 b" type="submit">Search</button>
  </form>`
}

module.exports = Search
