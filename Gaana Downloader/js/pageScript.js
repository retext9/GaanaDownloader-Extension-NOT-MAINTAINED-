//TODO: modify constants
const entitySelector = "h3 a";
const songCbName = "GaanaDownloaderSong";
const albumCbName = "GaanaDownloaderAlbum";

$(document).ready(function() { 
	init();
});


function init(){
	initCheckBoxes();
	initListener();
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
		return {song_name:elem.id, song_id:elem.value};
	});

	checkedItems = getCheckedAlbums();
	let checkedAlbums = $.map(checkedItems,(elem, index) => {
		return {album_name:elem.id, album_id:elem.value};
	});				
	
	return {songs: checkedSongs, albums: checkedAlbums};
}

function loadCheckBox(targetElem){
	var checkbox = document.createElement('input');
	checkbox.type = "checkbox";
	checkbox.name = isSongElem()?songCbName:albumCbName;
	checkbox.value = getCheckValue(targetElem);
	checkbox.id = getCheckId(targetElem);

	targetElem.after(checkbox);
}

function isSongElem(){
	//TODO: add logic
	return true;
}

function getCheckValue(targetElem){
	//TODO: modify accordingly
	return $(targetElem).attr('href');
}

function getCheckId(targetElem){
	//TODO: modify accordingly
	return $(targetElem).text();
}

function getCheckedSongs(){
	return $("input[type='checkbox'][name='" + songCbName + "']:checked");
}
function getCheckedAlbums(){
	return $("input[type='checkbox'][name='" + albumCbName + "']:checked");
}