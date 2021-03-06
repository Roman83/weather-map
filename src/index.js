import hb from 'handlebars';

const template = hb.compile(document.getElementById('weather-template').innerHTML);
const weather = document.getElementById('weather');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
      if (this.status === 200) {
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
  return httpGet(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.owmid}&units=metric`);
}

function renderWeather(dataStr) {
  const data = JSON.parse(dataStr);
  weather.innerHTML = template({
    city: data.name,
    country: data.sys.country,
    temp: data.main.temp,
    humidity: data.main.humidity,
    pressure: Math.round(data.main.pressure / 1.333224),
    alt: data.weather[0].description,
    src: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
    desc: data.weather[0].description,
    windspeed: data.wind.speed,
    winddirection: data.wind.deg,
  });
}

ymaps.ready(() => {
  let placemark;
  const myMap = new ymaps.Map('map', {
    center: [55.76, 37.64],
    zoom: 7,
  });

  ymaps.geolocation.get().then((res) => {
    const coords = res.geoObjects.position;
    myMap.setCenter(coords);
    return getWeather(...coords);
  }).then(renderWeather);

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
