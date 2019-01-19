function genCarousel(img) {

  if (!img.length) {
    console.log("No images");
  } else {
    $('#results').prepend(`
    <div class="carousel inner">
        <ul class="indicators"></ul>
        <button id="prev" type="button">P</button> 
        <button id="next" type="button">N</button>
    </div>
    `)
  }

  const html = [];
  const indicators = [];
  let index = 0;

  img.forEach((item, index) => {
    html.push(`
    <img id ="img-${index}" class="disabled" src="${item.url}" alt="${item.altText}">
  `)
    indicators.push(`
    <li id="dot-${index}">.</li>
  `)
  })

  $('.carousel').append(html)
  $('.indicators').append(indicators)
  $(`#img-${index}`).removeClass('disabled').addClass('enabled')
  $(`#dot-${index}`).addClass(`enabled-dot`)
  // setTimeout(function(){
  //   $('.carousel').removeClass('hidden')

  // }, 1000)

  function switchImg() {
    $('#next').on('click', function () {
      $(`#img-${index}`).removeClass('enabled').addClass('disabled')
      $(`#dot-${index}`).removeClass(`enabled-dot`)
      incIndex()
      $(`#img-${index}`).removeClass('disabled').addClass('enabled')
      $(`#dot-${index}`).addClass(`enabled-dot`)
    })
    $('#prev').on('click', function () {
      $(`#img-${index}`).removeClass('enabled').addClass('disabled')
      $(`#dot-${index}`).removeClass(`enabled-dot`)
      decrIndex()
      $(`#img-${index}`).removeClass('disabled').addClass('enabled')
      $(`#dot-${index}`).addClass(`enabled-dot`)

    })
  }

  function incIndex() {
    return index < html.length - 1 ? index++ : index = 0
  }

  function decrIndex() {
    return index === 0 ? index = html.length - 1 : index--
  }
  switchImg()

  setInterval(function(){
    $('#next').trigger('click')
  }, 5000)
}

function genMap () {
  $('#results').append(`
    <div class="wrapper">
      <div class="wrapper-top">
        <label>Directions</label>
        <input class="wrapper-switch" type="checkbox">
      </div>
      <div id="map"></div>
    </div>
  `)
  $('.wrapper-switch').change(function(){
    $('.wrapper-switch').closest('.wrapper').toggleClass('collapse')
  })
  
}

function genParkInfo(park) {
  $('#parks-list').append(`
  <li>
    <h3>${park.fullName}</h3>
    <p>${park.description}</p>
    <p>${park.directionsInfo}</p>
  </li> 
`)
}

function genParksList (park) {
  $('#parks-list').append(`
  <li id="park-${park.parkCode}" class="inner">
    <h3>${park.fullName}</h3>
    <p>${park.description.substring(0, 100) + "..."}</p>
    <img src="${park.images[0].url}" alt="${park.name}"> 
    <button type="checkbox" id="${park.parkCode}">View more</button>
  </li>
  `)

}