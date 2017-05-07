// FLICKR API INFO
const BASE_URL = 'https://api.flickr.com/services/rest/?jsoncallback=';
const API_KEY = '124b8d16a8cbdb38a9daa4eae472c89e';

// INNAPPROPRIATE PHOTOS TO EXCLUDE
const DISSALLOWED_PHOTOS = ['7294540910', '31367025712', '16365532406', '31367026172', '31367026382', '31142632900', '26523692991', '26563577466', '26523692941', '26316572830', '25984495244', '26497118422'];

// SANSKRIT NUMBERS 1 TO 17 FOR USE LATER **** IS THIS THE BEST PLACE FOR THESE? ****
const SANSKRIT_NUMBERS =['SAMASTHITI', 'EKHAM', 'DVE', 'TRINI', 'CATVARI', 'PANCHA', 'SAT', 'SAPTA', 'ASTAU', 'NAVA', 'DASA', 'EKADASA', 'DVADASA', 'TRAYODASA', 'CHATURDASA', 'PANCADASA', 'SODASA', 'SAPTADASA'];
const SANSKRIT_PRONUNCIATIONS =['sa-ma-stee-tee', 'A-kam', 'dway', 'tree-nee', 'chat-waaree', 'pan-cha', 'shat', 'sap-ta', 'ash-tau', 'na-va', 'day-sha', 'e-ka-da-sha', 'dwa-da-sha', 'try-yo-da-sha', 'chat-uhr-da-sha', 'pan-cha-da-sha', 'show-da-sha', 'sap-ta-da-sha'];

// STATE
let state = {
	postures: [
		{
			name: 'Surya Namaskar A',
			vinyasaCount: 9,
			vinyasaPhotos: ['anna.png','anna.png','anna.png','anna.png','anna.png','anna.png','surya-a-sat.png','anna.png','anna.png','anna.png',],
			search: 'samasthiti, surya+Namaskar+a, sun+salutation+a, Uttanasana, Ardha+Uttanasana, downward+facing+dog, aradho+mukha+svanasanadh, upward+facing+dog, urdhva+mukha+svanasanadh',
			photos: [],
		},
		{
			name: 'Surya Namaskar B',
			vinyasaCount: 17,
			vinyasaPhotos: ['anna.png','anna.png','anna.png','anna.png','anna.png','anna.png','surya-a-sat.png','anna.png','anna.png','anna.png','surya-a-sat.png','anna.png','anna.png','anna.png','surya-a-sat.png','anna.png','anna.png','anna.png',],
			search: 'samasthiti, surya+Namaskar+b, sun+salutation+b, Uttanasana, Ardha+Uttanasana, downward+facing+dog, aradho+mukha+svanasanadh, upward+facing+dog, urdhva+mukha+svanasanadh, virabhadrasana, virabhadrasanaa, virabhadrasana+a, warrior+1, warrior1',
			photos: [],
		}
	],
	currentPosture: 0,
}

// Add photo array from flickr to state
const addPhotos = (state, posture, photos) => {
	state.postures[posture].photos = photos;
}

// Return current posture which is the key for the object of the posture we're on 
const getCurrentPosture = (state) => {
	return state.currentPosture;
}

//Get all postures object from state
const getAllPostures = (state) => {
	// IS IT OK TO RETURN THE WHOLE POSTURES OBJECT HERE OR SHOULD I ONLY RETURN SPECIFIC THINGS FROM THE STATE, E.G. NAME
	return state.postures;
}

//Get all postures array length
const getPosturesArrayLength= (state) => {
	// DO I NEED TO DO THIS OR CAN I JUST USE THE FUNCTION ABOVE AND CALL LENGTH ON WHAT IT RETURNS
	return state.postures.length;
}

//Get a posture object from state
const getPosture = (state, postureId) => {
	// IS IT OK TO RETURN THE WHOLE POSTURE OBJECT HERE OR SHOULD I ONLY RETURN SPECIFIC THINGS FROM THE STATE, E.G. NAME
	return state.postures[postureId];
}

//Get a posture object from state
const getVinyasaCount = (state, postureId) => {
	// IS IT OK TO RETURN THE WHOLE POSTURE OBJECT HERE OR SHOULD I ONLY RETURN SPECIFIC THINGS FROM THE STATE, E.G. NAME
	return state.postures[postureId].vinyasaCount;
}

const getVinyasaImage = (state, postureId, plateCount) => {
	return state.postures[postureId].vinyasaPhotos[plateCount];
}

//Get a posture object from state
const getPostureString = (state, postureId) => {
	// IS IT OK TO RETURN THE WHOLE POSTURE OBJECT HERE OR SHOULD I ONLY RETURN SPECIFIC THINGS FROM THE STATE, E.G. NAME
	return state.postures[postureId].search;
}

// Return current posture which is the key for the object of the posture we're on 
const getPosturePhotos = (state, posture) => {
	return state.postures[posture].photos;
}

// Update current posture count
const updateCurentPostureCount = (state, count) => {
	return state.currentPosture = count;
}

// Reset current posture count
const resetCurentPostureCount = (state, count) => {
	state.currentPosture = 0;
}

// Flickr json request
const searchFlickr = (q, callBack) => { 
	const query = {
		method: 'flickr.photos.search',
		format: 'json',
		api_key: API_KEY,
		tags: q ,
		nojsoncallback: '1',
		extras: 'url_sq, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o, date_upload, date_taken, owner_name, tags, views'
	};
	
	$.getJSON(BASE_URL, query, callBack);
}

// Flickr callback for photo search
const processPhotos = (data) => {
	// Sending photos array to be added to state
	const currentPostureId = getCurrentPosture(state);
	addPhotos(state, currentPostureId, data.photos.photo);

	// update the background image, needs to be triggered from here otherwise the photos might not have come back yet
	updateBackgroundImages();
}

const findBiggestImg = (photo) => {
	// checks for available images to see which is the biggeset and returns it

	const lettersArray = ['z', 'n', 'm', 'q', 't', 's'];
	let letter = '';

	for (let i = 0; i < lettersArray.length; i++) {
		if(photo[`url_${lettersArray[i]}`]){
			letter = lettersArray[i]; 
			break;
		}
	}

	return photo[`url_${letter}`];

}

// Set background image to current posture photos
const updateBackgroundImages = () => {
	// get original size image
	const currentPostureId = getCurrentPosture(state);
	const currentPosturePhotos = getPosturePhotos(state, currentPostureId);

	// Shuffle array to randomize photo order  REDO THIS IN OWN STYLE
	let i = 0;
	let j = 0;
	let temp = null;

	for (i = currentPosturePhotos.length - 1; i > 0; i--) {
	    j = Math.floor(Math.random() * (i + 1));
	    temp = currentPosturePhotos[i];
	    currentPosturePhotos[i] = currentPosturePhotos[j];
	    currentPosturePhotos[j] = temp;
	};

	let imagesHTML = "";

	currentPosturePhotos.forEach(function(photo) { 
		// Skip over dissallowed photos
		if ($.inArray(photo.id, DISSALLOWED_PHOTOS) === -1) { 
			// finds the biggest available image
			const biggestImg = findBiggestImg(photo);
			imagesHTML += `<div class="image" data-lightbox-img-url="${biggestImg}">
								<img src="${biggestImg}" alt="${photo.title}">
								<div class="img-data hidden">
									<ul class="data-list">
										<li><b>Photo By: </b> <a href="https://www.flickr.com/people/${photo.owner}/">${photo.ownername}</a></li>
										<li><b>Taken: </b> ${photo.datetaken}</li>
										<li><b>id: </b> ${photo.id}</li>
									</ul>							
								</div>
							</div>`;
		}
	});

	$('.background-images').html(imagesHTML);
} 

// Find out what posture we're on and search flickr for it
const triggerSearch = () => {
	const currentPostureId = getCurrentPosture(state);
	const currentPostureString = getPostureString(state, currentPostureId);
	searchFlickr(currentPostureString, processPhotos);
}

// Add current posture information to info in html
const renderLeftCol = () => {
	const currentPostureId = getCurrentPosture(state);
	const currentPosture = getPosture(state, currentPostureId);
	const vinyasaCount = currentPosture.vinyasaCount;
	const postureHeading = currentPosture.name + ' - ' + currentPosture.vinyasaCount + ' Vinyasa';

	let infoHtml = $('.posture-info');

	// **** WHY IS THIS CHANGING THE DOM DIRECTLY WITHOUT HAVING TO CALL .HTML LIKE WE DID ON THE OTHER EXAMPLE ****

	// Clear out current vinyasa instructions
	infoHtml.find('.vinyasa').html('');

	// Looping for vinyasaCount + 1 because we always want to add a 'samasthiti' at the end
	for ( let i = 0; i <= vinyasaCount + 1 ; i++ ){
		
		let currentVinyasa = 0;
		let breath = '';
		let plateCount = '';

		// We always want the first and last item show "SAMASTHITI" otherwise show the sanskrit number that corresponds to the index
		if ( i === vinyasaCount + 1 || i === 0 ) {
			currentVinyasa = 'SAMASTHITI';
			plateCount = 0;
		} else {
			currentVinyasa = SANSKRIT_NUMBERS[i];
			plateCount = i;
			
			if (i % 2 === 0) {
				breath = 'exhale';
			} else {
				breath = 'inhale';
			}
		}

		const vinyasaImage = getVinyasaImage(state, currentPostureId, plateCount);
		const pronuncuation = SANSKRIT_PRONUNCIATIONS[plateCount];

		infoHtml.find('.vinyasa').append(
			`<li>
				<span class="count-num">${plateCount}</span>
				<img src="img/${vinyasaImage}" alt="${currentVinyasa}">
				<div class="vinyasa-info">
					<span class="vinyasa-count">${currentVinyasa}</span>
					<span>${breath}</span>
				</div>
				<div class="pronuncuation hidden">
					<span>${pronuncuation}</span>
				</div>
			</li>`
		);
	}

	$('.js-posture-name').text(postureHeading);

}

const selectCurrentNavLink = () =>{
	currentPostureIndex = getCurrentPosture(state);
	$('.js-nav-link').removeClass('selected');
	$(`.js-nav-link-${currentPostureIndex}`).addClass('selected');
}

const renderPosturePageClasses = () => {
	$('.home').addClass('hidden');
	$('.posture-info').removeClass('hidden');
	$('h1').removeClass('selected');
	$('.js-nav-link-0').addClass('selected');
}

const populateHomePage = () => {
	searchFlickr('pattabhi', processPhotos);
}

const goToTop = () => {
	// **** THIS ISN'T WORKING.... WHAT DO? **** //
	window.scrollTo(0, 0);
}


const loadFirstPosture = () => {
	renderPosturePageClasses();
	triggerSearch();
	renderLeftCol();
}

const renderHomeClasses = () =>{
	$('.home').removeClass('hidden');
	$('.posture-info').addClass('hidden');
	$('h1').addClass('selected');
	$('.js-nav-link').removeClass('selected');
}

const goHome = () => {
	renderHomeClasses();
	resetCurentPostureCount(state);
	populateHomePage();
}

const nextPosture = () => {
	let currentPosture = getCurrentPosture(state);
	const posturesArraylength = getPosturesArrayLength(state);
    currentPosture = updateCurentPostureCount(state, currentPosture + 1);

    if (currentPosture < posturesArraylength) {
		selectCurrentNavLink();
		goToTop();
		triggerSearch();
		renderLeftCol();
    } else {
    	goHome();
    }
    
}

const prevPosture = () => {
	const currentPosture = getCurrentPosture(state);

	if (currentPosture > 0){
		updateCurentPostureCount(state, currentPosture - 1);
		selectCurrentNavLink();
		goToTop();
		triggerSearch();
		renderLeftCol();
	}else{
		goHome();
	}
}

const showImageInfo = function() {
	$(this).find('.img-data').removeClass('hidden');
}

const hideImageInfo = function() {
	$(this).find('.img-data').addClass('hidden');
}

const goToPosture = function() {
	const postureId = Number($(this).attr('data-posture-id'));

	renderPosturePageClasses();
	updateCurentPostureCount(state, postureId);
	selectCurrentNavLink();
	goToTop();
	triggerSearch();
	renderLeftCol();
}

const showPronunciation = function() {
	console.log('this');
	$(this).find('.vinyasa-info').toggleClass('hidden');
	$(this).find('.pronuncuation').toggleClass('hidden');
}


const showLightbox = function() {
	const postureId = getCurrentPosture(state);
	const imgUrl = $(this).attr('data-lightbox-img-url');
	
	// **** AGAIN, THIS IS CHANGING THE DOM AS SOON AS I CALL LIGHTBOX.REMOVE CLASS. HOW DO I GET IT TO ONLY DO THAT ONCE I'M DONE CHANGING ALL THE DATA
	let lightbox = $('.lightbox');

	lightbox.removeClass('hidden');
	lightbox.find('img').attr('src', imgUrl);
}

const hideLightBox = (e) => {
	// Only hide lightbox if clicked outside image or escape key pressed
	if( ! $(e.target).hasClass('lightbox-image' || e.keyCode === 27) ){
		$('.lightbox').addClass('hidden');
	}
}

const renderNavLinks = () => {
	const postures = getAllPostures(state);
	let navHtml = "";
	// USE MAP
	postures.forEach(function(posture, index) {
		navHtml += `<li><a href="#" class="js-nav-link js-nav-link-${index}" data-posture-id="${index}">${posture.name}</a></li>`;
	});

	$('.js-main-nav').html(navHtml);
}

$(function() {
	renderNavLinks();
	populateHomePage();
	$('.js-start').click(loadFirstPosture);
	$('.js-home').click(goHome);
	$('.js-next').click(nextPosture);
	$('.js-prev').click(prevPosture);
	$('.js-nav-link').click(goToPosture);
	$('.vinyasa').on('click', 'li', showPronunciation);
	$('.background-images').on('mouseenter', '.image', showImageInfo);
	$('.background-images').on('mouseleave', '.image', hideImageInfo);
	$('.background-images').on('click', '.image', showLightbox);
	$('.lightbox').click( function(e){ hideLightBox(e) } );
	$(document).keyup(function(e) { hideLightBox(e); });
});

/* TODO

	DO SOMETHING WHEN CLICKING PLATE
	
	LOOK FOR WHERE I CAN USE MAP INSTEAD OF FOREACH
	TIDY UP AND RE ARRANGE FUNCTIONS
	TIDY UP CSS
	TIDY UP HTML
	
	RESPONSIVE

*/

/* IDEAS TO IMPROVE

	Build functionality to exclude ceratin tags from unique posture results - flickr functionality broken
	Loading animation / icon for images
	change list of cues to boxes with breath and count background is picture of Anna, show cue on click

*/