var songIds;
var albumIds;
document.addEventListener('DOMContentLoaded', function() {
	songIds = [];
	albumIds = [];
	downloadRegister();
	queryData();
});

function downloadRegister(){
	document.getElementById("download").addEventListener('click',function(){
		let song_ids = songIds.join(";");
		let album_ids = albumIds.join(";"); 
		//TODO: Native messaging
		console.log(song_ids + album_ids);
	})
}

function queryData(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {action: "getResults"}, function(response) {
		displaySelection(response.data);
	  });
	});		
}

function displaySelection(data){
	if(data.songs){
		data.songs.forEach((val, key) => {
			appendLi("songs", val.song_name);
			songIds.push(val.song_id);
		});
	}
	if(data.albums){
		data.albums.forEach((val, key) => {
			appendLi("albums", val.album_name);
			albumIds.push(val.album_id);
		});
	}	
}


function appendLi(divId, data){
	let newLi = document.createElement('li');
	let text = document.createTextNode(data);
	newLi.appendChild(text);
	let ul = document.querySelector("#" + divId + " #results");
	ul.appendChild(newLi);
}