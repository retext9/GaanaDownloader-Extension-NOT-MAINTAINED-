console.log("GAANADOWNLOADER");
$(document).ready(function() { 
	init();
});


function init(){
	initCheckBoxes();
	initListener();
}

function initCheckBoxes(){
	let results = $("h3 a");
	//console.log("number of results:" + results.length);
	results.each((index, result) => {
		//console.log($(result).attr("href"));
		let hrefValue = $(result).attr("href");
		loadCheckBox(result);
	});	
}

function initListener(){
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ?
                // "from a content script:" + sender.tab.url :
                // "from the extension");
    if(request.action){
		if (request.action == "getResults"){
			let checkedItems = getCheckedItems();
			let responseVals = $.map(checkedItems,(elem, index) => {
				console.log("index:" + index);
				console.log("elem:" + elem);
				return elem.value;
			});			
			//let responseVals = "kk";
			sendResponse({data:responseVals});
		}			
	}
  });	
}

function loadCheckBox(targetElem){
	var checkbox = document.createElement('input');
	checkbox.type = "checkbox";
	checkbox.name = "GaanaDownloader";
	checkbox.value = getCheckValue(targetElem);
	//checkbox.id = "id";

	targetElem.after(checkbox);
}

function getCheckValue(targetElem){
	return $(targetElem).attr('href');
}

function getCheckedItems(){
	return $("input[type='checkbox'][name='GaanaDownloader']:checked");
}