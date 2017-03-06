document.addEventListener('DOMContentLoaded', function() {
	queryData();
});

function queryData(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {action: "getResults"}, function(response) {
		//console.log((response.data)[0]);
		appendLi(response.data);
	  });
	});		
}

function appendLi(data){
	let newLi = document.createElement('li');
	let text = document.createTextNode(data);
	newLi.appendChild(text);
	let ul = document.getElementById("results");
	ul.appendChild(newLi);
}