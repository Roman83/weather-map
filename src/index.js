import hb from 'handlebars';

const template = hb.compile(document.getElementById('weather-template').innerHTML);;
const weather = document.getElementById('weather');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
      if (this.status == 200) {
        resolve(this.response);
      } else {
        const err = new Error(this.statusText);
        err.code = this.status;
        reject(err);
      }
    };
    xhr.onerror = () => { reject(new Error('Network Error')); };
    xhr.send();
  });
}

function getWeather(lat, lon) {
  return httpGet(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.owmid}`);
};

function renderWeather(dataStr) {
  const data = JSON.parse(dataStr);
  console.log(data);
  weather.innerHTML = template({
    title: data.name,
    temp: data.main.temp,
  });
}

ymaps.ready(() => {
  let placemark;
  const myMap = new ymaps.Map('map', {
    center: [55.76, 99.64],
    zoom: 7,
  });

  httpGet('https://freegeoip.net/json/')
    .then(
      (res) => {
        const {latitude, longitude} = JSON.parse(res);
        myMap.setCenter([latitude, longitude]);
        return getWeather(latitude, longitude);
      },
      (err) => {console.log(err);}
    ).then( (res) => { return renderWeather(res); });

  myMap.events.add('click', (e) => {
    const coords = e.get('coords');
    if (placemark) {
      placemark.geometry.setCoordinates(coords);
    } else {
      placemark = new ymaps.Placemark(coords, {});
      myMap.geoObjects.add(placemark);
    }
    getWeather(...coords).then(renderWeather);
  });
});
