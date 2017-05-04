// FLICKR API INFO
const BASE_URL = 'https://api.flickr.com/services/rest/?jsoncallback=';
const API_KEY = '124b8d16a8cbdb38a9daa4eae472c89e';

// STATE
let state = {
	series: {
		standing: {
			padangusthasana: {
				name: 'Padangusthasana',
				photo: {},
				photoAttempt: 0
			},
			padahasthasana: {
				name: 'Padahasthasana',
				photo: {},
				photoAttempt: 0
			},
			utthitaTrikonasana : {
				name: 'Utthita Trikonasana',
				photo: {},
				photoAttempt: 0
			},
			parivrttaTrikonasana : {
				name: 'Parivrtta Trikonasana',
				photo: {},
				photoAttempt: 0
			}
		},
		seated: {},
		closing: {}
	}
};

// ADD PHOTO TO STATE
const addPhoto = function addPhotoToState(state, series, posture, photo){
	state.series[series][posture].photo = photo;
}

const getSeries = function getSeriesFromState(state, series){
	return state.series[series];
}

// SEARCH FLICKR API
const searchFlickr = function apiSearch(q, callBack) { 
	const query = {
		method: 'flickr.photos.search',
		format: 'json',
		api_key: API_KEY,
		tags: q,
		
		// DON'T FULLY UNDERSTAND WHY I HAD TO ADD THIS... 
		// IF I COULDN'T FIND THE ANSWER ON STACK OVERFLOW WHAT 
		// WOULD I HAVE DONE? HOW WOULD I HAVE FIGURED THIS OUT? 
		nojsoncallback: '1'
	};
	
	$.getJSON(BASE_URL, query, callBack);
	console.log('searched: ' + q);
};

// FLICKR CALLBACK
const processPhoto = function processPhoto(data) {
	console.log('CallBack: ');
	console.log(data);
	
	/*if ( data.photos.photo.length > 0 ){
		console.log(data.photos.photo[0]);
	}else{
		console.log('no results');
	}*/

	//addPhoto(state, "standing", data.photos.photo[0]);
};

// TRIGGERS ALL THE API SERCHES
const triggerSearch = function triggerFlickrSearch(series) {

	const seriesObj = getSeries(state,series);

	for (let key in seriesObj) {
		searchFlickr(seriesObj[key].name, processPhoto);
	};

};

$(function() {
	triggerSearch('standing');
});