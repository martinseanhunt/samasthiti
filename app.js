// FLICKR API INFO
const BASE_URL = 'https://api.flickr.com/services/rest/?jsoncallback=';
const API_KEY = '124b8d16a8cbdb38a9daa4eae472c89e';

// STATE
let state = {
	postures: {
		padangusthasana: {
			name: 'Padangusthasana',
			photos: [],
			photoPosition: 0
		},
		padahasthasana: {
			name: 'Padahasthasana',
			photos: [],
			photoPosition: 0
		},
		utthitaTrikonasana : {
			name: 'Utthita Trikonasana',
			photos: [],
			photoPosition: 0
		},
		parivrttaTrikonasana : {
			name: 'Parivrtta Trikonasana',
			photos: [],
			photoPosition: 0
		}
	},
	currentPosture: 'padangusthasana',
};

// Add photo array from flickr to state
const addPhotos = function addPhotoToState(state, posture, photos) {
	state.postures[posture].photos = photos;
}

// Return current posture which is the key for the object of the posture we're on 
const getCurrentPosture = function getCurrentPostureObj(state){
	return state.currentPosture;
}

//Get a posture object from state
const getPosture = function getPostureObj(state, postureId){
	// IS IT OK TO RETURN THE WHOLE POSTURE OBJECT HERE OR SHOULD I ONLY RETURN SPECIFIC THINGS FROM THE STATE, E.G. NAME
	return state.postures[postureId];
}

//Get a posture object from state
const getPostureName = function getPostureObj(state, postureId){
	// IS IT OK TO RETURN THE WHOLE POSTURE OBJECT HERE OR SHOULD I ONLY RETURN SPECIFIC THINGS FROM THE STATE, E.G. NAME
	return state.postures[postureId].name;
}

// Return current posture which is the key for the object of the posture we're on 
const getPosturePhotos = function getPostureImages(state, posture){
	return state.postures[posture].photos;
}

// Flickr json request
const searchFlickr = function searchFlickrForPhotos(q, callBack) { 
	const query = {
		method: 'flickr.photos.search',
		format: 'json',
		api_key: API_KEY,
		tags: q ,
		tag_mode: 'all',
		nojsoncallback: '1',
		extras: 'url_sq, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o'
	};
	
	$.getJSON(BASE_URL, query, callBack);
};

// Flickr callback for photo search
const processPhotos = function processPhotos(data) {
	// Sending photos array to be added to state
	const currentPostureId = getCurrentPosture(state);
	addPhotos(state, currentPostureId, data.photos.photo);

	// update the background image, needs to be triggered from here otherwise the photos might not have come back yet
	updateBackgroundImages();
};

// Find out what posture we're on and search flickr for it
const triggerSearch = function triggerFlickrSearch() {
	const currentPostureId = getCurrentPosture(state);
	const currentPostureName = getPostureName(state, currentPostureId);
	searchFlickr(currentPostureName, processPhotos);
};

const findBiggestImg = function returnBiggestAvailableImg(photo) {
	// checks for available images to see which is the biggeset and returns it
	/*if (photo.url_o){
		return photo.url_o;
	}else if (photo.url_k){
		return photo.url_k;
	}else if (photo.url_h){
		return photo.url_h;
	}else if (photo.url_b){
		return photo.url_b;
	}else if (photo.url_c){
		return photo.url_c;
	}else*/ if (photo.url_z){
		return photo.url_z;
	}else if (photo.url_n){
		return photo.url_n;
	}else if (photo.url_m){
		return photo.url_m;
	}else if (photo.url_q){
		return photo.url_q;
	}else if (photo.url_t){
		return photo.url_t;
	}else if (photo.url_s){
		return photo.url_s;
	}
}

// Set background image to current posture photos
const updateBackgroundImages = function setBgImg() {
	// get original size image
	const currentPostureId = getCurrentPosture(state);
	const currentPosturePhotos = getPosturePhotos(state, currentPostureId);

	let imagesHTML = "";

	currentPosturePhotos.forEach(function processPhotoArray(photo) {
		// finds the biggest available image
		const biggestImg = findBiggestImg(photo);
		imagesHTML += `<img src="${biggestImg}" alt="${photo.title}">`;
	});

	console.log(imagesHTML);

	$('.background-images').html(imagesHTML);
} 

$(function() {
	triggerSearch();
});