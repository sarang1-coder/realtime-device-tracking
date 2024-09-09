const socket = io()

// check if browser supports geolocation
if (navigator.geolocation.watchPosition) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      socket.emit('send-location', { latitude, longitude })
    },
    (error) => {
      console.error(error)
    },

    // Set Options for high accuracy, a 5-second timeout, and no caching
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeOut: 2500,
    },
  )
}

// emit latitude & langtitude via socket with "send-location".log any error in console

// initialize map centered at coordinates (0,0) with zoom level of 15 using leaflet. add openstreetmap tiles to the map

const map = L.map('map').setView([0, 0], 10)

L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

// create empty object marker
const markers = {}

// when receiving location data via socket,extract id,latitude and longitude and center map on new coordinates
socket.on('receive-location', (data) => {
  const { id, latitude, longitude } = data
  map.setView([latitude, longitude], 15)
  if (markers[id]) {
    markers[id].setLatLong([latitude, longitude])
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map)
  }
})

// if marker for id exists,update its positions otherwise create
// new marker at given coordinates and add it to map
// when user disconnects remove marker from map and delete it from markers
