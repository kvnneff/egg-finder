const h = require('choo/html')

const Search = (state) => {
  const onSubmit = state.onSubmit

  return h`<form onsubmit=${onSubmit} class="tl">
    <div class="mb3">
      <label class="db" for="type">
        <span class="db b">Search By</span>
        <select class="w-100" name="type">
          <option value="name">Farm Name</option>
          <option value="address">Address</option>
        </select>
      </label>
    </div>
    <div class="mb3">
      <label class="db" for="input">
        <span class="db b">Search For</span>
        <input class="w-100" type="text" name="input" id="input" placeholder="">
      </label>
    </div>
    <div class="mb3">
      <label for="organic">
        <input type="checkbox" id="organic" name="organic">
        <span class="b">Organic</span>
      </label>
    </div>
    <div class="mb3">
      <label for="freerange">
        <input type="checkbox" id="freerange" name="freerange">
        <span class="b">Free Range</span>
      </label>
    </div>
    <button class="b--white w-100 pa3 b" type="submit">Search</button>
  </form>`
}

module.exports = Search
