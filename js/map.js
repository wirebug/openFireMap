//LAYERS

var map = new L.map('map').setView(new L.LatLng(51.3619, 7.3719), 16);

var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	mbUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png',
	osmAttr = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

var streets = L.tileLayer(mbUrl, {
	id: 'lokalhorst.i4pa35h8',
	attribution: mbAttr
});
var terrain = L.tileLayer(mbUrl, {
	id: 'lokalhorst.i4p9onln',
	attribution: mbAttr
});
var mapq = L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg');

var layerOsm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: osmAttr,
	subdomains: ["a", "b", "c"],
	maxZoom: 19
}).addTo(map);

var fire = L.tileLayer('http://openfiremap.org/hytiles/{z}/{x}/{y}.png', {
	/*attribution: '© OpenFireMap contributors - © OpenStreetMap contributors',*/
	continuousWorld: true
});

var hydrantIcon = L.icon({
	iconUrl: 'http://wiredeck.canis.uberspace.de/openfiremap/images/hydrant.png',
	iconSize: [32,37],
	iconAnchor: [16, 37],
	popupAnchor: [0,-15]
});

//CONTROLS

map.attributionControl.setPrefix('');
//L.control.attributtion({postion: 'bottomright', prefix: '.'}).addTo(map);

L.control.fullscreen().addTo(map);
map.addControl(new L.Control.ScaleCustom({
	metric: true,
	imperial: false
}));

L.Control.geocoder({
	placeholder: "Adresse suchen",
	errorMessage: "Adresse nicht gefunden :-(",
	position: 'topleft'
}).addTo(map);

L.easyPrint().addTo(map)
//adress show up
map.on('click', function (e) {
	control.options.geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), function (results) {
		var r = results[0];
		if (r) {
			if (marker) {
				marker.
				setLatLng(r.center).
				setPopupContent(r.name).
				openPopup();
			} else {
				marker = L.marker(r.center).bindPopup(r.name).addTo(map).openPopup();
			}
		}
	});
});

//AJAX MAGIC



function popUp(f, l) {
	var out = [];
	if (f.properties) {
		for (var key in f.properties) {
			out.push(key + ": " + f.properties[key]);
		}
		l.bindPopup(out.join("<br />"));
		l.setIcon(hydrantIcon);
	}
	//add every geo data to cluster
	cluster.addLayer(l);
}

//Create ClusterGroup

var cluster = L.markerClusterGroup({
	disableClusteringAtZoom: 18
});

var hydrants = L.geoJson.ajax("hydrants-min.geojson", {
	onEachFeature: popUp
});

map.addLayer(cluster);

var baseLayers = {
	"OSM": layerOsm,
	"Mapbox": streets,
	"Terrain": terrain,
	"Mapquest": mapq
};
var overlays = {
	"Hydranten": cluster,
	"Firemap": fire
};


L.control.layers(baseLayers, overlays).addTo(map);
