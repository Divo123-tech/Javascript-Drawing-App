//Displays and handles the colour palette.
function ColourPalette() {
	//a list of web colour strings
	this.colours = ["#000000", "#C0C0C0", "#808080", "#FFFFFF", "#800000", "#FF0000", "#800080",
		"#FFA500", "#FFC0CB", "#FF00FF", "#008000", "#00FF00", "#808000", "#FFFF00", "#000080",
		"#0000FF", "#008080", "#00FFFF"
	];
	//make the start colour be black
	this.selectedColour = "#000000";

	let self = this;
	const colorPicker = document.createElement("input")
	const colourClick = function() {
		//remove the old border
		let current = select("#" + self.selectedColour + "Swatch");
		current.style("border", "0");
		colorPicker.style.border = "0"
		//get the new colour from the id of the clicked element
		let c = this.id().split("Swatch")[0];
		
		//set the selected colour and fill and stroke
		self.selectedColour = c;
		colorPicker.value = c
		fill(c);
		stroke(c);

		//add a new border to the selected colour
		this.style("border", "2px solid blue");
	}

	//load in the colours
	this.loadColours = function() {
		//set the fill and stroke properties to be black at the start of the programme
		//running
		fill(this.colours[0]);
		stroke(this.colours[0]);

		//for each colour create a new div in the html for the colourSwatches
		for (let i = 0; i < this.colours.length; i++) {
			let colourID = this.colours[i] + "Swatch";

			//using JQuery add the swatch to the palette and set its background colour
			//to be the colour value.
			let colourSwatch = createDiv()
			colourSwatch.class('colourSwatches');
			colourSwatch.id(colourID);

			select(".colourPalette").child(colourSwatch);
			select("#" + colourID).style("background-color", this.colours[i]);
			colourSwatch.mouseClicked(colourClick)
		}

		select(".colourSwatches").style("border", "2px solid blue");
		const wrapperDiv = document.getElementsByClassName("wrapper")[0]
		colorPicker.setAttribute("type", "color")
		wrapperDiv.appendChild(colorPicker)
		colorPicker.setAttribute("value", "#000000")
		colorPicker.style.position = "absolute";
		colorPicker.style.left = "350px"
		colorPicker.style.bottom = "10px"


	};
	//call the loadColours function now it is declared
	this.loadColours();
	colorPicker.onchange = () => {
		fill(colorPicker.value)
		stroke(colorPicker.value)
		let current = select("#" + self.selectedColour + "Swatch");
		current.style("border", "0");
		colorPicker.style.border = "2px solid blue"
	}
	select("#setBGColorButton").mouseClicked(() => {
		background(this.selectedColour)
	})
}