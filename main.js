function parkDetails(parkCode) {
  $(`#${parkCode}`).on('click', event => {
    $('#parks-list').addClass('away')
    callNps({
      parkCode
    })
  })
}

function renderSection(obj) {
  console.log(obj);
  $('#parks-list').empty();
  const images = [];
  if (obj.data.length > 1) {
    obj.data.forEach(park => {
      $('#parks-list').append(`
                <li id="park-${park.parkCode}" class="inner">
                    <h3>${park.fullName}</h3>
                    <input type="checkbox">
                    <p>${park.description.substring(0, 100) + "..."}</p>
                    <img src="${park.images[0].url}" alt="${park.name}"> 
                    <button type="checkbox" id="${park.parkCode}">View more</button>
                </li>
                `)
      parkDetails(park.parkCode);
    })
  } else if (obj.data.length === 1) {
    const park = obj.data[0];
    images.push(...park.images);
    createCarousel(images);
    $('#parks-list').append(`
            <li>
                <h3>${park.fullName}</h3>
                <input type="checkbox">
                <p>${park.description}</p>
                <p>${park.directionsInfo}</p>
            </li> 
        `)
  } else {
    $('#parks-list').append(`
            <p>Not found</p>
        `)
  }

  $('#results').removeClass('hidden')
  $('#parks-list').removeClass('away')

}


function generateParams(obj) {
  return Object.keys(obj)
    .map(key =>
      `${encodeURI(key)}=${encodeURI(obj[key])}`
    )
    .join("&")
}

function callNps(args) {
  const npsUrl = 'https://api.nps.gov/api/v1/parks';

  const params = {
    api_key: 'V6am0sq9z5Ryh4HuzfxaSDqWaicvMH1aL9kjh9sC',
    q: '',
    stateCode: '',
    limit: 3,
    start: 0,
    parkCode: '',
    fields: 'images,contacts'
  }

  args = Object.assign(params, args)

  let endpoint = npsUrl + "?" + generateParams(params)
  console.log(endpoint);

  fetch(endpoint)
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      throw new Error(res.statusText)
    })
    .then(res => renderSection(res))
    .catch(err => console.log(err));
}

$('#js-form').on('submit', event => {
  event.preventDefault();
  let keyword = $('#keyword')
  let state = $('#state')
  let limit = $('#limit')
  if (!keyword.val().trim().length) keyword.val('')
  if (!state.val().trim().length) state.val('');
  const args = {}
  if (keyword.val()) args.q = keyword.val()
  if (state.val()) args.stateCode = state.val()
  if (limit.val()) args.limit = limit.val()

  callNps(args)
  $('#parks-list').removeClass('away')
})