console.log("GAANADOWNLOADER");
$(document).ready(function() { 
	init();
});


function init(){
	let results = $("h3 a");
	//console.log("number of results:" + results.length);
	results.each((index,result) => {
		//console.log($(result).attr("href"));
		let hrefValue = $(result).attr("href");
		loadCheckBox(result);
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
	return $("input[type='checkbox'][name='GaanaDownloader']");
}