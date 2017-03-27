/* //*[contains(@id,'parent-row')]
parent-row-album (2)
parent-row-song (10)
parent-row-playlist (3)
parent-row-gaanaradio
parent-row-radio
$("#parent-row-song21262810").parent().find("a[title='Humsafar']")
$("<p>testetst</p>").insertAfter(trgtElem) */


const entitySelector = "span[id*='parent-row']";
const songCbName = "GaanaDownloaderSong";
const albumCbName = "GaanaDownloaderAlbum";
const observerContainer = "div[pjax-div]";
const targetSelector = {
	home_album: targetElem => $(targetElem).next("li").find("a[data-pjax][class*='album-name']"),
	home_song: targetElem => $(targetElem).parent().find("h3"),
	album_album: targetElem => $(targetElem).parent().find("h1"),
	album_song: targetElem => $(targetElem).parent().find("li[class='s_title'] a[data-type='playSong']")
}

$(document).ready(function() { 
	init();
	observeMutation();
});

function init(){
	initCheckBoxes();
	initListener();
}

function observeMutation(){
	let target = document.querySelector(observerContainer);

	let observer = new MutationObserver(function(mutations) {
	  
	  mutations.forEach(function(mutation) {
		let addedNodes = mutation.addedNodes;
		if(addedNodes.length > 1){
			init();
		}
	  });
	});

	let config = {
	  childList: true,
	  attributes: false,
	  characterData: false,
	  subtree: false
	};

	observer.observe(target, config);	
}

function initCheckBoxes(){
	let results = $(entitySelector);
	results.each((index, result) => {
		loadCheckBox(result);
	});	
}

function initListener(){
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action){
		if (request.action == "getResults"){		
			let responseVals = getChekedItems();
			sendResponse(
				{
					errorFlag:false,
					data:responseVals
				}
			);
		}			
	}
  });	
}

function getChekedItems(){	
	let checkedItems = getCheckedSongs();
	let checkedSongs = $.map(checkedItems,(elem, index) => {
		return {song_name:elem.value, song_id:elem.id};
	});

	checkedItems = getCheckedAlbums();
	let checkedAlbums = $.map(checkedItems,(elem, index) => {
		return {album_name:elem.value, album_id:elem.id};
	});				
	
	return {songs: checkedSongs, albums: checkedAlbums};
}

function loadCheckBox(targetElem){
	let elemJSON = getJSONContent(targetElem);
	let checkBxElem = getCheckBoxElem(elemJSON);
	if(checkBxElem != null){
		let titleElem = getTitleElem(targetElem, elemJSON);
		if(titleElem != null){
			$(checkBxElem).insertBefore(titleElem);
		}
	}
}

function getTitleElem(targetElem, elemJSON){
	let currentPage = getCurrentPage();
	let titleElem = null;
	let type = "";
	switch(elemJSON.object_type){
		case 2:
			type = "album";
			break;
		case 10:
			type = "song";
			break;
	}	
	if(type.length == 0) return titleElem;
	switch(currentPage){
		case "":
			titleElem = targetSelector["home_" + type](targetElem);
			break;
		case "album":
			titleElem = targetSelector["album_" + type](targetElem);
			break;
	}			
	return titleElem;
}

function getCurrentPage(){
	return window.location.pathname.split('/')[1];
}

function getJSONContent(targetElem){
	let jsonText = $(targetElem).text();
	if( jsonText.length !== 0){
		jsonObj = JSON.parse(jsonText);
		return jsonObj;
	}
	return null;
}

function getCheckBoxElem(elemJSON){
	if(elemJSON != null){
		let cbName = getCheckBoxName(elemJSON);
		if(cbName.length !== 0){
			var checkbox = document.createElement('input');
			checkbox.type = "checkbox";
			checkbox.name = cbName;
			checkbox.value = elemJSON.title;
			checkbox.id = elemJSON.id;
			return checkbox;
		}
	}
	return null;
}

function getCheckBoxName(elemJSON){	
	switch(elemJSON.object_type){
		case 2:
			return albumCbName;
			break;
		case 10:
			return songCbName;
			break;
		default:
			return "";
	}
}

function getCheckedSongs(){
	return $("input[type='checkbox'][name='" + songCbName + "']:checked");
}
function getCheckedAlbums(){
	return $("input[type='checkbox'][name='" + albumCbName + "']:checked");
}