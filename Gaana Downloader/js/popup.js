const downloaderName = "in.pathri.singleinstance";
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
		messageDownloader(songIds, albumIds);
	})
}

function messageDownloader(song_ids, album_ids){
	//TODO: Native messaging
	chrome.runtime.sendNativeMessage(
		downloaderName,
		{ song_ids: song_ids, album_ids: album_ids },
		function(response) {
			console.log("Received " + response);
			console.log("Recieved errorFlag" + response.errorFlag);
			document.getElementById("status-bar").textContent = response.message;
		}
	);
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
	console.log("AlbumIds:" + albumIds.join());
	console.log("SongsIds:" + songIds.join());
}


function appendLi(divId, data){
	let newLi = document.createElement('li');
	let text = document.createTextNode(data);
	newLi.appendChild(text);
	let ul = document.querySelector("#" + divId + " #results");
	ul.appendChild(newLi);
}