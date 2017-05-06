// FLICKR API INFO
const BASE_URL = 'https://api.flickr.com/services/rest/?jsoncallback=';
const API_KEY = '124b8d16a8cbdb38a9daa4eae472c89e';

// STATE
let state = {
	postures: {
		padangusthasana: {
			name: 'Padangusthasana, Tadasana',
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
		extras: 'tags, url_o'
	};
	
	$.getJSON(BASE_URL, query, callBack);
};

// Flickr callback for photo search
const processPhotos = function processPhotos(data) {
	// Sending photos array to be added to state
	const currentPostureId = getCurrentPosture(state);
	addPhotos(state, currentPostureId, data.photos.photo);

	console.log(data);

	// update the background image, needs to be triggered from here otherwise the photos might not have come back yet
	updateBackgroundImage();
};

// Find out what posture we're on and search flickr for it
const triggerSearch = function triggerFlickrSearch() {
	const currentPostureId = getCurrentPosture(state);
	const currentPostureName = getPostureName(state, currentPostureId);
	searchFlickr(currentPostureName, processPhotos);
};

// Return original size image if available
const lookForBigImg = function returnBigImage(photo) {
	if (photo.url_o){
		return photo.url_o;
	}else{
		return null;
	}
}

// Show default background and message when there are no suitable results
const showDefaultBackground = function showDefaultBg() {
	//
}

// Set background image to current posture photos
const updateBackgroundImage = function setBgImg() {
	// get original size image
	const currentPostureId = getCurrentPosture(state);
	const currentPosturePhotos = getPosturePhotos(state, currentPostureId);

	let bgImg = "";

	currentPosturePhotos.forEach(function processPhotoArray(photo) {
		// if the original size (big) image is available, use it
		if (bgImg === "" && photo.url_o){
			bgImg = photo.url_o;
		}
	});

	if (bgImg !== "") {
		$('body').css('background-image', `url("${bgImg}"`);
	} else {
		showDefaultBackground();
	}
} 

$(function() {
	triggerSearch();

	$('.js-next').click(function nextClick() {
		//update current posture
	});
});



