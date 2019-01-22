function clearSections() {
  $('#description').remove();
  $('#map-section').remove();
  $('#fees-section').remove();
  $('#weather-section').remove();
}

function watchParkDetails(parkCode) {
  $(`#${parkCode}`).on('click', event => {
    callNps({parkCode}, "parks");
  })
}

function renderSection(obj) {
  const images = [];
  if (obj.data.length > 1) {
    obj.data.forEach(park => {
      let randomIndex = Math.floor(Math.random() * park.images.length)
      genParksList(park, randomIndex)
      watchParkDetails(park.parkCode)

    })
  } else if (obj.data.length === 1) {

    $('#check-1').prop('checked', false)
    $('#hide-form').trigger('change').prop('checked', false)

    const park = obj.data[0];
    images.push(...park.images);

    $('#results').addClass("collapse")
    $('header').addClass("collapse-form")

    clearSections()

    getLatLng(park.fullName)
    genHtml(images, park);
    
  } else {
    $('#parks-list').append(`
      <p>Not found</p>
    `)
  }
  wrapperCollapse()
}


function generateParams(obj) {
  return Object.keys(obj)
    .map(key =>
      `${encodeURI(key)}=${encodeURI(obj[key])}`
    )
    .join("&")
}

function callNps(args, info) {
  const npsUrl = `https://api.nps.gov/api/v1/${info}`;
  const api = 'V6am0sq9z5Ryh4HuzfxaSDqWaicvMH1aL9kjh9sC';
  const params = {
    api_key: api,
    q: '',
    stateCode: '',
    limit: 5,
    start: 0,
    parkCode: '',
    fields: 'images,contacts,entranceFees'
  }
  

  args = Object.assign(params, args)

  let endpoint = "";
  if (info === "parks"){
    endpoint = npsUrl + "?" + generateParams(params);
  } else if (info === "alerts"){
    endpoint = npsUrl + "?api_key="+api+"&parkCode="+args.parkCode;
  }
  console.log(endpoint);
  
  fetch(endpoint)
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      throw new Error(res.statusText)
    })
    .then(res => {
      if (info === "parks"){
        renderSection(res);
      } else if (info === "alerts") {
        console.log(res);
      }
    })
    .catch(err => console.log(err));
}



async function getLatLng(name) {
  const api = 'AIzaSyCBAsHTwIuM21X08GF99aMvf7y0kuiOZ90';
  const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  const params = {
    key: api
  }
  const url = baseUrl + "?" + generateParams(params)

  let response = await fetch(url + "&address=" + name);
  let json = await response.json();

  const loc = json.results[0].geometry.location

  initMap(loc)
  $('#map').removeClass('hidden')
}

function initMap(location) {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 10,
    disableDefaultUI: true
  });

  const marker = new google.maps.Marker({
    position: location,
    map: map
  });
}


$('#hide-form').change(function () {
  $('header').toggleClass('collapse-form')
})

$('form').on('submit', event => {
  event.preventDefault();
  
  $('#results').removeClass('hidden').removeClass('collapse')
  $('#parks-list').empty();
  clearSections();

  const args = {}
  let keyword = $('#search-park')
  let maxResults = $('#max-results')

  if (keyword.val()) args.q = keyword.val()
  if (maxResults.val()) args.limit = maxResults.val()
  callNps(args, "parks")
})

$('.wrapper-switch-1').on('click', function() {
  $(this).closest('.wrapper').toggleClass('collapse')
})
// !CORS
// async function getWeather (coordinates) {
//   // accuweather
//   // 1 get location code to request weather info
//   // 2 get weather by location code
//   const codeUrl = "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search"
//   const api = "Zg63fNEFPoFyNtWNrygJYBCTbaGwbAdr";
//   const weatherUrl = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/"
//   const latlng = Object.values(coordinates).join(",")

//   const url = `${codeUrl}?apikey=${api}&q=${latlng}`
//   const url2 = `${weatherUrl}?apikey=${api}`

//   let res = await fetch(url);
//   let json = await res.json();
//   console.log(json);

//   let res2 = await fetch(url2 + json.Key)
//   let json2 = await res2.json();

//   console.log(json2);


// }

// async function getReviews (name) {
//   const api = 'AIzaSyCBAsHTwIuM21X08GF99aMvf7y0kuiOZ90';
//   const baseUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";
//   const params = {
//     key: api,
//     input: name,
//     inputtype: 'textquery'
//   }

//   let res = await fetch(baseUrl+generateParams(params), {dataType: 'jsonp'});
//   let json = await res.json();

//   const baseUrl2 = 'https://maps.googleapis.com/maps/api/place/details/json?';
//   const params2 = {
//     key: api,
//     fields: 'reviews',
//     placeid: json.candidates[0].place_id
//   }

//   let res2 = await fetch(baseUrl2+generateParams(params2));
//   let json2 = await res2.json();

//   console.log(json2);
  
// }

// $('input[type="radio"]').on('change', function () {

//   if (this.value === "q") {
//     $('#search-state').addClass('hidden')
//     $('#search-park').removeClass('hidden')

//   } else if (this.value === "state") {
//     $('#search-park').addClass('hidden')
//     $('#search-state').removeClass('hidden')

//   }
// })


