function getParkDetails(parkCode) {
  $(`#${parkCode}`).on('click', event => {
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
      
      // generate list
      genParksList(park)
      getParkDetails(park.parkCode)
    })
  } else if (obj.data.length === 1) {
    hideForm();
    const park = obj.data[0];
    images.push(...park.images);

    getLatLng(park.fullName)


    // generate all elements
    genCarousel(images);
    genParkInfo(park)
    genMap();

  } else {
    $('#parks-list').append(`
      <p>Not found</p>
    `)
  }

  setTimeout(function () {
    $('#results').removeClass('hidden')
  }, 1000)

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
    fields: 'images,contacts,entranceFees,entrancePasses'
  }

  args = Object.assign(params, args)

  let endpoint = npsUrl + "?" + generateParams(params)
  console.log(endpoint);
  console.log(params.limit);
  
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




async function getLatLng(name) {
  const api2 = 'AIzaSyCBAsHTwIuM21X08GF99aMvf7y0kuiOZ90';
  const baseUrl2 = 'https://maps.googleapis.com/maps/api/geocode/json';

  const params2 = {
    key: api2,
  }
  const url2 = baseUrl2 + "?" + generateParams(params2)

  let response2 = await fetch(url2 + "&address=" + name);
  let json2 = await response2.json();

  console.log(json2.results[0].geometry.location);
  const loc = json2.results[0].geometry.location

  initMap(loc)
  $('#map').removeClass('hidden')
}

function initMap(location) {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 12,
    disableDefaultUI: true
    // mapTypeControl: true,
    // mapTypeControlOptions: {
    //   style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    //   mapTypeIds: ['roadmap', 'terrain']
    // }
  });

  const marker = new google.maps.Marker({
    position: location,
    map: map
  });

}

function hideForm() {
  $('header').toggleClass('collapse-form')
}

$('#hide-form').change(function () {
  hideForm()
})


$('#js-form').on('submit', event => {
  event.preventDefault();
  $('.wrapper').empty().addClass('hidden');
  $('.carousel').remove();
  
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
})