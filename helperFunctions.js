function HelperFunctions() {

	//Jquery click events. Notice that there is no this. at the
	//start we don't need to do that here because the event will
	//be added to the button and doesn't 'belong' to the object

	//event handler for the clear button event. Clears the screen
	select("#clearButton").mouseClicked(function() {
		background(255, 255, 255);
		//call loadPixels to update the drawing state
		//this is needed for the mirror tool
		loadPixels();
	});

	//event handler for the save image button. saves the canvsa to the
	//local file system.
	select("#saveImageButton").mouseClicked(function() {
		saveCanvas("myPicture", "jpg");
	});


	//dropdown to chagne the "size of the brush" for the differnt tools
	const selectStroke = createSelect()
	selectStroke.id('setStroke')
	selectStroke.parent(document.getElementsByClassName('header')[0])
	//populates the options by double the size of the brush each time
	for(var i = 1; i < 10; i*=2) {
		selectStroke.option(`${i}px`)
	}
	selectStroke.mouseClicked(function() {
		//accesses just the numeric value wihtout the "px"
		console.log(selectStroke.value().split("")[0])
		strokeWeight(selectStroke.value().split("")[0])
	})
	
}