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

ymaps.ready(() => {
  let placemark;

  httpGet('https://freegeoip.net/json/')
    .then(
      (res) => {
        console.log(res);
        const {latitude, longitude, city} = JSON.parse(res);
        console.log(city);
        return httpGet(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${config.owmid}`)
      },
      (err) => {console.log(err);}
    ).then((res) => {console.log(res);});

  const myMap = new ymaps.Map('map', {
    center: [55.76, 99.64],
    zoom: 7,
  });

  myMap.events.add('click', (e) => {
    const coords = e.get('coords');
    if (placemark) {
      placemark.geometry.setCoordinates(coords);
    } else {
      placemark = new ymaps.Placemark(coords, {});
      myMap.geoObjects.add(placemark);
    }
  });
});
