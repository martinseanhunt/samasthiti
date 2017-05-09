// **** MAYBE STORE ALL OF THIS IN AN OBJECT? OR MOVE TO RELEVANT FUNCTIONS?
// ___________  

// FLICKR API INFO
const BASE_URL = 'https://api.flickr.com/services/rest/?jsoncallback=';
const API_KEY = '124b8d16a8cbdb38a9daa4eae472c89e';

// INNAPPROPRIATE PHOTOS TO EXCLUDE
const DISSALLOWED_PHOTOS = ['7294540910', '31367025712', '16365532406', '31367026172', 
							'31367026382', '31142632900', '26523692991', '26563577466', 
							'26523692941', '26316572830', '25984495244', '26497118422'];

// SANSKRIT NUMBERS 1 TO 17 FOR USE LATER **** IS THIS THE BEST PLACE FOR THESE? ****
const SANSKRIT_NUMBERS = ['SAMASTHITI', 'EKHAM', 'DVE', 'TRINI', 'CATVARI', 'PANCHA', 
							'SAT', 'SAPTA', 'ASTAU', 'NAVA', 'DASA', 'EKADASA', 'DVADASA', 
							'TRAYODASA', 'CHATURDASA', 'PANCADASA', 'SODASA', 'SAPTADASA'];
const SANSKRIT_PRONUNCIATIONS = ['sa-ma-stee-tee', 'A-kam', 'dway', 'tree-nee', 'chat-waar-ee', 
								'pan-cha', 'shat', 'sap-ta', 'ash-toe', 'na-va', 'day-sha', 
								'e-ka-da-sha', 'dva-da-sha', 'try-yo-da-sha', 'chat-uhr-da-sha', 
								'pan-cha-da-sha', 'show-da-sha', 'sap-ta-da-sha'];

// ___________



// TEMPLATES

const PHOTO_TEMPLATE = `<div class="image" data-lightbox-img-url="">
							<img src="" alt="">
							<div class="img-data hidden">
								<ul class="data-list">
									<li><b>Photo By: </b> <a href=""></a></li>
									<li><b>Taken: </b> <span class="js-taken"></span></li>
									<li><b>Views: </b> <span class="js-views"></span></li>
								</ul>							
							</div>
						</div>`;

const PLATE_TEMPLATE = `<li>
							<span class="count-num"></span>
							<img src="" alt="">
							<div class="vinyasa-info">
								<span class="vinyasa-count"></span>
								<span class="breath"></span>
								<span class="held-posture hidden">hold for 5 breaths</span>
							</div>
							<div class="pronunciation hidden">
								<span class="pronunciation-span"></span>
							</div>
						</li>`



// ___________



// STATE

let state = {
	postures: [
		{
			name: 'Surya Namaskar A',
			vinyasaCount: 9,
			vinyasaPhotos: ['surya-a-0.jpg','surya-a-1.jpg','surya-a-2.jpg','surya-a-3.jpg',
							'surya-a-4.jpg','surya-a-5.jpg','surya-a-6.jpg','surya-a-3.jpg',
							'surya-a-2.jpg','surya-a-1.jpg',],
			search: `samasthiti, surya+Namaskar+a, sun+salutation+a, Uttanasana, Ardha+Uttanasana, 
					downward+facing+dog, aradho+mukha+svanasanadh, upward+facing+dog, urdhva+mukha+svanasanadh`,
			photos: [],
		},
		{
			name: 'Surya Namaskar B',
			vinyasaCount: 17,
			vinyasaPhotos: ['surya-a-0.jpg','surya-b-1.jpg','surya-a-2.jpg','surya-a-3.jpg','surya-a-4.jpg',
							'surya-a-5.jpg','surya-a-6.jpg','surya-b-7.jpg','surya-a-4.jpg','surya-a-5.jpg' ,
							'surya-a-6.jpg','surya-b-11.jpg' ,'surya-a-4.jpg' ,'surya-a-5.jpg','surya-a-6.jpg', 
							'surya-a-3.jpg', 'surya-a-2.jpg', 'surya-b-1.jpg'],
			search: `samasthiti, surya+Namaskar+b, sun+salutation+b, Uttanasana, Ardha+Uttanasana, downward+facing+dog, 
					aradho+mukha+svanasanadh, upward+facing+dog, urdhva+mukha+svanasanadh, virabhadrasana, 
					virabhadrasanaa, virabhadrasana+a, warrior+1, warrior1`,
			photos: [],
		}
	],
	currentPosture: 0,
}



// STATE FUNCTIONS 

// Add photo array from flickr to state
const addPhotos = (state, posture, photos) => {
	state.postures[posture].photos = photos;
}

// Return current posture which is the key for the object of the posture we're on 
const getCurrentPosture = state => {
	return state.currentPosture;
}

//Get all postures object from state
const getAllPostures = state => {
	return state.postures;
}

//Get all postures array length
const getPosturesArrayLength= state => {
	return state.postures.length;
}

//Get a posture object from state
const getPosture = (state, postureId) => {
	return state.postures[postureId];
}

//Get a posture object from state
const getVinyasaCount = (state, postureId) => {
	return state.postures[postureId].vinyasaCount;
}

const getVinyasaImage = (state, postureId, plateCount) => {
	return state.postures[postureId].vinyasaPhotos[plateCount];
}

//Get a posture object from state
const getPostureString = (state, postureId) => {
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

// _________________



// FLICKR API TRIGGERS, CALL AND CALLBACK

const searchFlickr = (q, callBack) => { 
	const query = {
		method: 'flickr.photos.search',
		format: 'json',
		api_key: API_KEY,
		tags: q ,
		nojsoncallback: '1',
		extras: 'url_t, url_s, url_q, url_m, url_n, url_z, date_taken, owner_name, views'
	};
	
	$.getJSON(BASE_URL, query, callBack);
}

const processPhotos = (data) => {
	// Sending photos array to be added to state
	const currentPostureId = getCurrentPosture(state);
	addPhotos(state, currentPostureId, data.photos.photo);

	// update the background image, needs to be triggered from here otherwise the photos might not have come back yet
	renderRightCol(state, '.background-images');
}

const triggerSearch = () => {
	// Find out what posture we're on and search flickr for it
	const currentPostureId = getCurrentPosture(state);
	const currentPostureString = getPostureString(state, currentPostureId);
	searchFlickr(currentPostureString, processPhotos);
}

const triggerHomeSearch = () => {
	searchFlickr('pattabhi', processPhotos);
}

// _________________



// HELPER FUNCTIONS

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

// _________________



// RENDER FUNCTIONS

const renderRightCol = (sate, htmlElement) => {
	// get biggest usable image
	const currentPostureId = getCurrentPosture(state);
	const currentPosturePhotos = getPosturePhotos(state, currentPostureId);

	// Shuffle array to randomize photo order
	let i = 0;
	let j = 0;
	let temp = null;

	for (i = currentPosturePhotos.length - 1; i > 0; i--) {
	    j = Math.floor(Math.random() * (i + 1));
	    temp = currentPosturePhotos[i];
	    currentPosturePhotos[i] = currentPosturePhotos[j];
	    currentPosturePhotos[j] = temp;
	};

	// Create array of item divs
	const imagesHTML = currentPosturePhotos.map(function(photo) { 
		// Skip over dissallowed photos
		if ($.inArray(photo.id, DISSALLOWED_PHOTOS) === -1) { 
			// finds the biggest available image
			let template = $(PHOTO_TEMPLATE);
			const biggestImg = findBiggestImg(photo);

			template.attr('data-lightbox-img-url', biggestImg);
			template.find('img').attr('src', biggestImg).attr('alt', photo.title);
			template.find('a').attr('href', `https://www.flickr.com/people/${photo.owner}/`).text(photo.ownername);
			template.find('.js-taken').text(photo.datetaken);
			template.find('.js-views').text(photo.views);

			return template;
		}else{
			return null;
		}
	});

	$(htmlElement).html(imagesHTML);
} 

const renderLeftCol = (state, htmlElement) => {
	const currentPostureId = getCurrentPosture(state);
	const currentPosture = getPosture(state, currentPostureId);
	const vinyasaCount = currentPosture.vinyasaCount;
	const postureHeading = currentPosture.name + ' - ' + currentPosture.vinyasaCount + ' Vinyasa';

	let infoHtml = $(htmlElement).clone();

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
		const pronunciation = SANSKRIT_PRONUNCIATIONS[plateCount];

		let vinyasaHtml = $(PLATE_TEMPLATE);

		vinyasaHtml.find('.count-num').text(plateCount);
		vinyasaHtml.find('img').attr('src', `img/${vinyasaImage}`).attr('alt', currentVinyasa);
		vinyasaHtml.find('.vinyasa-count').text(currentVinyasa);
		vinyasaHtml.find('.breath').text(breath);

		// if it's a held posture show that instruction
		if (currentPostureId === 0 && plateCount === 6 || currentPostureId === 1 && plateCount === 14) {
			vinyasaHtml.find('.held-posture').removeClass('hidden');
		}

		vinyasaHtml.find('.pronunciation-span').text(pronunciation);

		infoHtml.find('.vinyasa').append(vinyasaHtml);

	}

	// Set H2 heading with posture name and vinyasa count
	infoHtml.find('.js-posture-name').text(postureHeading);

	$(htmlElement).replaceWith(infoHtml);
}

const selectCurrentNavLink = () => {
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

const renderHomeClasses = () => {
	$('.home').removeClass('hidden');
	$('.posture-info').addClass('hidden');
	$('h1').addClass('selected');
	$('.js-nav-link').removeClass('selected');
}

const showImageInfo = function() {
	$(this).find('.img-data').removeClass('hidden');
}

const hideImageInfo = function() {
	$(this).find('.img-data').addClass('hidden');
}

const showPronunciation = function() {
	$(this).find('.vinyasa-info').toggleClass('hidden');
	$(this).find('.pronunciation').toggleClass('hidden');
}

const showLightbox = function() {
	const postureId = getCurrentPosture(state);
	const imgUrl = $(this).attr('data-lightbox-img-url');
	
	// **** AGAIN, THIS IS CHANGING THE DOM AS SOON AS I CALL LIGHTBOX.REMOVE CLASS. HOW DO I GET IT TO ONLY DO THAT ONCE I'M DONE CHANGING ALL THE DATA
	let lightbox = $('.lightbox');

	lightbox.removeClass('hidden');
	lightbox.find('img').attr('src', imgUrl);

	// write html template in global and use variable name as jquery selector to make a copy and modify.
}

const hideLightBox = (e) => {
	// Only hide lightbox if clicked outside image or escape key pressed
	if( ! $(e.target).hasClass('lightbox-image' || e.keyCode === 27) ){
		$('.lightbox').addClass('hidden');
	}
}

const renderNavLinks = () => {
	const postures = getAllPostures(state);
	
	const navHtml = postures.map(function(posture, index) {
		return `<li><a href="#" class="js-nav-link js-nav-link-${index}" data-posture-id="${index}">${posture.name}</a></li>`;
	});

	$('.js-main-nav').html(navHtml);
}

// _________________



// LISTENER FUNCTIONS

const goHome = () => {
	renderHomeClasses();
	resetCurentPostureCount(state);
	triggerHomeSearch();
}

const loadFirstPosture = () => {
	renderPosturePageClasses();
	triggerSearch();
	renderLeftCol(state, '.js-vinyasa-content');
}

const nextPosture = () => {
	let currentPosture = getCurrentPosture(state);
	const posturesArraylength = getPosturesArrayLength(state);
    currentPosture = updateCurentPostureCount(state, currentPosture + 1);

    if (currentPosture < posturesArraylength) {
		selectCurrentNavLink();
		triggerSearch();
		renderLeftCol(state, '.js-vinyasa-content');
    } else {
    	goHome();
    }
    
}

const prevPosture = () => {
	const currentPosture = getCurrentPosture(state);

	if (currentPosture > 0){
		updateCurentPostureCount(state, currentPosture - 1);
		selectCurrentNavLink();
		triggerSearch();
		renderLeftCol(state, '.js-vinyasa-content');
	}else{
		goHome();
	}
}

const goToPosture = function() {
	const postureId = Number($(this).attr('data-posture-id'));

	renderPosturePageClasses();
	updateCurentPostureCount(state, postureId);
	selectCurrentNavLink();
	triggerSearch();
	renderLeftCol(state, '.js-vinyasa-content');
}


$(function() {
	renderNavLinks();
	triggerHomeSearch();
	$('.js-start').click(loadFirstPosture);
	$('.js-home').click(goHome);
	$('.js-next').click(nextPosture);
	$('.js-prev').click(prevPosture);
	$('.js-nav-link').click(goToPosture);
	$('.posture-page').on('click', '.vinyasa li', showPronunciation);
	$('.background-images').on('mouseenter', '.image', showImageInfo);
	$('.background-images').on('mouseleave', '.image', hideImageInfo);
	$('.background-images').on('click', '.image', showLightbox);
	$('.lightbox').click( hideLightBox );
	$(document).keyup( hideLightBox );
});
