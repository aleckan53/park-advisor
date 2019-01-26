// mobile swipes
!function(t,e){"use strict";"initCustomEvent"in e.createEvent("CustomEvent")&&(t.CustomEvent=function(t,n){n=n||{bubbles:!1,cancelable:!1,detail:void 0};var u=e.createEvent("CustomEvent");return u.initCustomEvent(t,n.bubbles,n.cancelable,n.detail),u},t.CustomEvent.prototype=t.Event.prototype),e.addEventListener("touchstart",function(t){if("true"===t.target.getAttribute("data-swipe-ignore"))return;s=t.target,l=Date.now(),n=t.touches[0].clientX,u=t.touches[0].clientY,a=0,i=0},!1),e.addEventListener("touchmove",function(t){if(!n||!u)return;var e=t.touches[0].clientX,l=t.touches[0].clientY;a=n-e,i=u-l},!1),e.addEventListener("touchend",function(t){if(s!==t.target)return;var e=parseInt(s.getAttribute("data-swipe-threshold")||"20",10),o=parseInt(s.getAttribute("data-swipe-timeout")||"500",10),r=Date.now()-l,c="";Math.abs(a)>Math.abs(i)?Math.abs(a)>e&&r<o&&(c=a>0?"swiped-left":"swiped-right"):Math.abs(i)>e&&r<o&&(c=i>0?"swiped-up":"swiped-down");""!==c&&s.dispatchEvent(new CustomEvent(c,{bubbles:!0,cancelable:!0}));n=null,u=null,l=null},!1);var n=null,u=null,a=null,i=null,l=null,s=null}(window,document);

$('.logo').on('click', function(){location.reload()});

function renderSection(obj) {
  $('.error').remove();
  $('main').empty();
  $('#app-description').remove();
  $('#quick-search').remove();

  const images = [];
  // renders list of parks
  if (obj.data.length > 1) {
    genParksList(obj.data);
    $('#results button').on('click', e => {
      callNps({parkCode: e.target.id}, "parks");  
    });
  // renders one park
  } else if (obj.data.length === 1) {
    const park = obj.data[0];
    images.push(...park.images);
    window.scrollTo(1,130);
    $('#results .switch').removeClass('hidden');

    getLatLng(park.fullName);
    genHtml(images, park);

    $('#check-1').trigger('click');
    $('#check-3').trigger('click');
    $('#check-4').trigger('click');
    $('#check-5').trigger('click');
  // err if not found
  } else {
    genErrMsg();
  }
  // hide sections
  $('.switch input[type="checkbox"]').off().on('change', e => {
    let body = e.target.parentElement.parentElement.nextElementSibling;
    $(body).toggleClass('hidden');
  });    
}   

// params obj to valid api params
function generateParams(obj) {
  return Object.keys(obj)
    .map(key =>
      `${encodeURI(key)}=${encodeURI(obj[key])}`
    )
    .join("&");
}

// request park data
function callNps(args, info) {
  const npsUrl = `https://api.nps.gov/api/v1/${info}`;
  const api = 'V6am0sq9z5Ryh4HuzfxaSDqWaicvMH1aL9kjh9sC';
  const params = {
    q: '',
    stateCode: '',
    limit: 4,
    start: 0,
    parkCode: '',
    fields: 'images,contacts,entranceFees'
  };
  
  args = Object.assign(params, args);
  let endpoint = npsUrl + "?" + generateParams(params);
  
  fetch(endpoint, {api_key: api})
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.statusText);
    })
    .then(res => {
      renderSection(res);
    })
    .catch(err => console.log(err));
}

// async request for park latlng
async function getLatLng(name) {
  const api = 'AIzaSyCBAsHTwIuM21X08GF99aMvf7y0kuiOZ90';
  const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  const params = {
    key: api,
    address: name
  };
  const url = baseUrl + "?" + generateParams(params);

  let response = await fetch(url);
  let json = await response.json();

  const loc = json.results[0].geometry.location;
  
  initMap(loc);
}

// new ggl map
function initMap(location) {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 6,
    disableDefaultUI: true
  });

  const marker = new google.maps.Marker({
    position: location,
    map: map
  });
}


// watch form submit, quick-search btns
$('form').on('submit', event => {
  event.preventDefault();

  const args = {};
  let keyword = $('#search-park');

  if (keyword.val()) args.q = keyword.val();
  callNps(args, "parks");
})

$('#slideshow').on('click', e => {
  console.log(e);
  callNps({parkCode: e.target.id}, 'parks');
})

// slideshow

$("#slideshow > img:gt(0)").hide();

setInterval(function() {
  $('#slideshow > img:first')
    .fadeOut(1000)
    .next()
    .fadeIn(1000)
    .end()
    .appendTo('#slideshow');
  $('#app-description > label').html($('#slideshow > img:first').attr('alt'))
}, 5000);