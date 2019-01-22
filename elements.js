function wrapperCollapse () {
  $('.wrapper-switch').on('click', function() {
    $(this).closest('.wrapper').toggleClass('collapse')
  })
}

function genHtml(img, park) {
  const html = [];
  html.push(
    `<section id="description" class="wrapper">
      <div class="wrapper-top padding-5-10" checked>
        <label>Description</label>
        <div class="check">
          <input class="wrapper-switch" type="checkbox" id="check-2" checked>
          <label for="check-2">
        </div>
      </div>
      ${genCarousel(img)}
      ${genParkInfo(park)}
    </section>
    `,
    genMap(park),
    genFeesInfo(park),
    genWeather(park),
  );

  // append all
  $('main').append(html)

  // run controls
  carouselControls(img.length)
}

function genCarousel(img) {
  const html = [];

  if (!img.length) {
    console.log("No images");
  } else {
    html.push(`
    <div id="carousel" class="carousel">
        <ul class="indicators">
    `)
  }

  img.forEach((item, index) => {   // push indicators
    html.push(`
    <li id="dot-${index}">.</li>
  `)
  })

  html.push(   // push prev/next btns
    `</ul>
    <button id="prev" type="button"><</button> 
    <button id="next" type="button">></button>`
    )

  img.forEach((item, index) => {   // push imgs
    html.push(`
    <img id ="img-${index}" class="disabled" src="${item.url}" alt="${item.altText}">
  `)
  })

  html.push(   // push closing tag
    `</div>`
  )

  return html.join('')
}

function genParkInfo(park) {
  return `
    <div id="park-info" class="padding-5-10">
      <h3>${park.fullName}</h3>
      <p>${park.description}</p>
    </div>
    `
}

function genMap(park) {
  return `
    <section id="map-section" class="wrapper collapse">
      <div class="wrapper-top padding-5-10" >
        <label>Directions</label>
        <div class="check">
          <input class="wrapper-switch" type="checkbox" id="check-3">
          <label for="check-3">
        </div>
      </div>
      <div id="map"></div>
      <p class="padding-5-10">${park.directionsInfo}</p>
    </section>
  `
}

function genFeesInfo(park) {
  const html = [];

  if (!park.entranceFees) {
    html.push(`
      <p>No entrance fee</p>
    `)
  } else {
    html.push(`
    <section id="fees-section" class="wrapper collapse">
      <div class="wrapper-top padding-5-10">
        <label>Pricing</label>
        <div class="check">
          <input class="wrapper-switch" type="checkbox" id="check-4">
          <label for="check-4">
        </div>
      </div>
      <table id="fees-table" class="padding-5-10">
        <thead>
          <td>Title</td>
          <td>Description</td>
          <td>Cost</td>
        </thead>
        <tbody>
  `)
  }

  park.entranceFees.forEach(fee => {
    html.push(`
        <tr>
          <td>${fee.title}</td>
          <td>${fee.description}</td>
          <td>$${fee.cost}</td>
        </tr>
      `)
  })

  html.push(`
    </tbody>
      </table>
    </section>
  `)

  return html.join('')
}

function genWeather(park) {
  return `
    <section id="weather-section" class="wrapper collapse">
      <div class="wrapper-top padding-5-10">
        <label>Weather</label>
        <div class="check">
          <input class="wrapper-switch" type="checkbox" id="check-5">
          <label for="check-5">
        </div>
      </div>
      <div class="padding-5-10">
      <img src="http://icons.iconarchive.com/icons/papirus-team/papirus-apps/256/weather-icon.png" alt="weather icon">
        <p>${park.weatherInfo}</p>
      </div>
    </section>
  `
}

function genAlerts (obj) {
  const html = [
    `<section id="alerts" class="wrapper collapse">
    <div class="wrapper-top padding-5-10">
    <label>Alerts</label>
        <div class="check">
          <input class="wrapper-switch" type="checkbox" id="check-6">
          <label for="check-6">
        </div>
    </div>
    <table class="padding-5-10">`
  ];

  obj.data.forEach(alert => {
    html.push(`
    <tr>
      <td>ICON</td>
      <td>
        <p>${alert.title}</p>
        <p>${alert.description}</p>
        <p>${alert.url}</p>
      </td>
    </tr>`
    )
  })

  html.push(`
    </table>
    </section>
  `)

  $('main').append(html)
}

function carouselControls(length) {
  let index = 0;

  $(`#img-${index}`).removeClass('disabled').addClass('enabled')
  $(`#dot-${index}`).addClass(`enabled-dot`)

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
    return index < length - 1 ? index++ : index = 0
  }

  function decrIndex() {
    return index === 0 ? index = length - 1 : index--
  }
  switchImg()

  setInterval(function () {
    $('#next').trigger('click')
  }, 5000)

}



function genParksList(park, randomIndex) {
  $('#parks-list').append(`
  <li id="park-${park.parkCode}" class="inner padding-5-10">
    <h3>${park.fullName}</h3>
    <p>${park.description.substring(0, 100) + "..."}</p>
    <img src="${park.images[randomIndex].url}" alt="${park.name}"> 
    <button type="button" id="${park.parkCode}">View more</button>
  </li>
  `)
}