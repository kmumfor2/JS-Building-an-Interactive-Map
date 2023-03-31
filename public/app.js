//Note: You do NOT need to create an external JS file for this project despite any instructions you may see in Canvas. This file, app.js, is the only external JS file you need.
/*
//Map object

const myMap ={
    coordinates:[],
    businesses:[],
    map:{},
    markers:{},
}

 //Create map                                                     
buildMap() ;{
    this.map = L.map('map', {
    center: this.coordinates,
    zoom: 11,
    });

// Add openstreetmap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

// Create and add a geolocation marker
const marker = L.marker(this.coordinates)
		marker
		.addTo(this.map)
		.bindPopup('<p1><b>You are here</b><br></p1>')
		.openPopup()
	}

  
  function showPosition(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    console.log(`Latitude: ${lat}, Longitude: ${long}`);
  }
  
  //add marker to the map
  marker.on('click', function() {
// show the business label
    const label = document.getElementById('business-label');
    label.classList.remove('hidden');
  
// position the label above the marker
const markerPos = marker.getLatLng();
const labelPos = map.latLngToLayerPoint(markerPos);
label.style.left = `${labelPos.x}px`;
label.style.top = `${labelPos.y - 30}px`;
});

// hide the business label when the map is clicked
map.on('click', function() {
    const label = document.getElementById('business-label');
    label.classList.add('hidden');
  });

//foursquare businesses 
async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3YosbxGQkeegxeczPlqWkfh07mkI4mhAU3CVUt+OF+ZI='
		}
	}
	let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}
*/

// map object
const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},

	// myMap Build
	buildMap() {
		this.map = L.map('map', {
            center: this.coordinates,
            zoom: 11,
		});
		// add openstreetmap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '18',
		}).addTo(this.map)
		// create and add geolocation marker
		const marker = L.marker(this.coordinates)
		marker
            .addTo(this.map)
            .bindPopup('<p1><b>You are here!</b><br></p1>')
            .openPopup()
        },

	// business markers
	addMarkers() {
		for (var i = 0; i < this.businesses.length; i++) {
		this.markers = L.marker([
			this.businesses[i].lat,
			this.businesses[i].long,
		])
			.bindPopup(`<p1>${this.businesses[i].name}</p1>`)
			.addTo(this.map)
		}
	},
}

//  geolocation coordinates
async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

// foursquare businesses
async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3YosbxGQkeegxeczPlqWkfh07mkI4mhAU3CVUt+OF+ZI='
		}
	}
	let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch(`https://api.foursquare.com/v3/places/search?query=burgers`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}
// foursquare array
function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}


// event handlers


// window load
window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.buildMap()
}

// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await getFoursquare(business)
	myMap.businesses = processBusinesses(data)
	myMap.addMarkers()
})

