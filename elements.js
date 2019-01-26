// gen main html
function genHtml(img, park) {
  const html = [];
  html.push(
    `<section id="description">
      <div class="section-head" checked>
        <label>Description</label>
        <div class="switch">
          <input type="checkbox" id="check-2">
          <label for="check-2">
        </div>
      </div>
      <div class="section-body">
        ${genCarousel(img)}
        ${genParkInfo(park)}
      </div>
    </section>
    `,
    genMap(park),
    genFeesInfo(park),
    genWeather(park),
  );

  $('main').append(html);
  console.log(html.join());
  
  carouselControls(img.length);
}

function genCarousel(img) {
  const html = [];

  if (!img.length) {
    console.log("No images");
  } else {
    html.push(`
    <div id="carousel">
        <ul class="indicators">
    `)
  }

  img.forEach((item, index) => { // push indicators
    html.push(`
    <li id="dot-${index}">.</li>
  `);
  });

  html.push( // push prev/next btns
    `</ul>
    <button id="prev" type="button"><</button> 
    <button id="next" type="button">></button>`
  );

  img.forEach((item, index) => { // push imgs
    html.push(`
    <img id ="img-${index}" class="disabled" src="${item.url}" alt="${item.altText}">
  `);
  });

  html.push(`</div>`);  // push closing tag
  
  return html.join('');
}

function genParkInfo(park) {
  return `
    <div id="park-info">
      <h3>${park.fullName} ${park.states}</h3>
      <p>${park.description}</p>
    </div>
    `
}

function genMap(park) {
  return `
    <section id="map-section">
      <div class="section-head">
        <label>Directions</label>
        <div class="switch">
          <input type="checkbox" id="check-3">
          <label for="check-3">
        </div>
      </div>
      <div class="section-body hidden">
        <div id="map"></div>
        <p>${park.directionsInfo}</p>
      </div>
    </section>
  `
}

function genFeesInfo(park) {
  const html = [];

  if (!park.entranceFees) {
    html.push(`
      <p>No entrance fee</p>
    `);
  } else {
    html.push(`
    <section id="fees-section">
      <div class="section-head">
        <label>Entrance fees</label>
        <div class="switch">
          <input type="checkbox" id="check-4">
          <label for="check-4">
        </div>
      </div>
      <div class="section-body hidden">
        <table id="fees-table">
          <thead>
            <td>Title</td>
            <td>Description</td>
            <td>Cost</td>
          </thead>
          <tbody>
  `);
  }

  park.entranceFees.forEach(fee => {
    html.push(`
            <tr>
              <td>${fee.title}</td>
              <td>${fee.description}</td>
              <td>$${fee.cost}</td>
            </tr>
    `);
  });

  html.push(`
          </tbody>
        </table>
      </div>
    </section>
  `);

  return html.join('');
}

function genWeather(park) {
  return `
    <section id="weather-section">
      <div class="section-head">
        <label>Weather</label>
        <div class="switch">
          <input type="checkbox" id="check-5">
          <label for="check-5">
        </div>
      </div>
      <div class="section-body hidden">
        <img src="assets/${Math.floor(Math.random()*3)}.png" alt="weather icon">
        <p>${park.weatherInfo}</p>
      </div>
    </section>
  `
}

function carouselControls(length) {
  
  let index = 0;
  const rotate = function(){
    $('#next').trigger('click');
  }
  let rotateI = setInterval(rotate, 7000);

  $(`#img-${index}`).toggleClass('disabled');
  $(`#dot-${index}`).toggleClass(`enabled-dot`);

  function switchImg() {
    $('#next').on('click', function () {
      clearInterval(rotateI);
      rotateI = setInterval(rotate, 7000);
      $(`#img-${index}`).toggleClass('disabled');
      $(`#dot-${index}`).toggleClass(`enabled-dot`);
      incIndex();
      $(`#img-${index}`).toggleClass('disabled');
      $(`#dot-${index}`).toggleClass(`enabled-dot`);
    });
    $('#prev').on('click', function () {
      clearInterval(rotateI);
      rotateI = setInterval(rotate, 7000);

      $(`#img-${index}`).toggleClass('disabled');
      $(`#dot-${index}`).toggleClass(`enabled-dot`);
      decrIndex();
      $(`#img-${index}`).toggleClass('disabled');
      $(`#dot-${index}`).toggleClass(`enabled-dot`);

    });
  }

  function incIndex() {
    return index < length - 1 ? index++ : index = 0;
  }

  function decrIndex() {
    return index === 0 ? index = length - 1 : index--;
  }
  switchImg();


  $('#carousel').on('swiped-left', function (e) {
    $('#next').trigger('click');
  });

  $('#carousel').on('swiped-right', function (e) {
    $('#prev').trigger('click');
  });
}

function genParksList(data) {
  const html = [
    `<section id="results">
      <div class="section-head">
        <label>Results list</label>
        <div class="switch hidden">
          <input type="checkbox" id="check-1">
          <label for="check-1">
        </div>
      </div>
      <div class="section-body">
        <ul id="parks-list" role="list">`
  ];

  data.forEach(park => {
    let randomIndex = Math.floor(Math.random() * park.images.length)
    html.push(`
    <li id="park-${park.parkCode}" role="listitem">
      <h3>${park.fullName} ${park.states}</h3>
      <div class="img-container">
        <img src="${park.images[randomIndex].url}" alt="${park.name}">
      </div>
      <button type="button" id="${park.parkCode}">View more</button>
    </li>
    `);
  });

  html.push(`
        </ul>
      </div>
    </section>
  `);

  $('main').append(html.join(''));
}

function genErrMsg() {
  $('main').prepend(`
    <p class="error">Not found. Please check your spelling and try again.</p>
  `);
  console.log("Not found. Please check your spelling and try again.");
}