ymaps.ready(() => {
  let placemark;

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
