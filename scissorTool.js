function scissorTool() {
  this.icon = "assets/scissor.jpg";
  this.name = "scissor";
  this.saving = false;
  this.selectMode = 0;

  let selectedArea = { x: 0, y: 0, width: 0, height: 0 };
  let savedPixels = [];
  let selectedPixels;
  let whiteSquare = loadImage("assets/whiteSquare.png")
  

  this.draw = () => {
    //object destructuring to shorten variable names in code
    const { x, y, width, height } = selectedArea;
    const canvasContainer = select("#content");
    if (
      mouseIsPressed &&
      mouseY < canvasContainer.size().height &&
      mouseY > 0 &&
      mouseX > 0
    ) {
      if (this.selectMode == 1 && !this.saving) {
        //only change the x and y properties 
        //when selected area has just been intialized
        if (x == 0 && y == 0) {
          selectedArea.x = mouseX;
          selectedArea.y = mouseY;
        } 
        else {
          selectedArea.width = mouseX - x;
          selectedArea.height = mouseY - y;
          //refresh the screen
          updatePixels();

          //functions that return the appropriate starting and ending positions
          const startingPos = (cor, dir) => cor < cor + dir ? cor : cor + dir;
          const endingPos = (cor, dir) => cor > cor + dir ? cor : cor + dir;
          //draws the striped lines that outline the selected area
          strokeWeight(1)
          for (let i = startingPos(x, width); i < endingPos(x, width); i += 15) 
          {
            line(i, y, i + 5, y);
            line(i, y + height, i + 5, y + height);
          }

          for (let i = startingPos(y, height); i < endingPos(y, height); i += 15) 
          {
            line(x, i, x, i + 5);
            line(x + width, i, x + width, i + 5);
          }
          //the four corners of the selected area
          ellipse(x, y, 7);
          ellipse(x + width, y, 7);
          ellipse(x, y + height, 7);
          ellipse(x + width, y + height, 7);
          //changes the stroke to 1px for UX consistency
          select("#setStroke").selected('1px')
        }
      } else if (this.selectMode == 2) {
        //pastes image in the center of the mouse position
        console.log("working");
        image(
          selectedPixels,
          mouseX - selectedPixels.width / 2,
          mouseY - selectedPixels.height / 2
        );
      }
    }
  };

  this.populateOptions = () => {
    //variables redeclared to original value to reset every time
    // new tool is selected before end paste is called
    this.selectMode = 0;
    selectedArea = { x: 0, y: 0, width: 0, height: 0 };
    const optionsDiv = document.getElementById("options");
    select(".options").html("<button id='selectButton'>Select Area</button>");
    const selectButton = select("#selectButton");
    const copyButton = createButton("copy");
    const deSelectButton = createButton("unselect");
    const saveButton = createButton("save");
    const useSavedButton = createButton("use saved images");
    const savedPixelsSelect = createSelect();
    copyButton.hide();
    deSelectButton.hide();
    saveButton.hide();
    savedPixelsSelect.hide();
    //only show this button when user has already saved an image
    //change this
    useSavedButton.style(
      "display",
      savedPixels.length > 0 ? "block" : "none"
    );
    copyButton.parent(optionsDiv);
    deSelectButton.parent(optionsDiv);
    selectButton.parent(optionsDiv);
    saveButton.parent(optionsDiv);
    savedPixelsSelect.parent(optionsDiv);
    useSavedButton.parent(optionsDiv);

    selectButton.mousePressed(() => {
      switch (this.selectMode) {
        case 0:
          this.selectMode += 1;
          selectButton.html("cut");
          showButtons();
          //stores current frame
          loadPixels();
          break;
        case 1:
          this.selectMode += 1;
          hideButtons();
          selectButton.html("end paste");
          //removes square
          updatePixels();
          //gets the selected pixels
          selectedPixels = getSelectedPixels();
          //erases the selected area
          if(selectedArea.width != 0 && selectedArea.height != 0){
          image(whiteSquare, selectedArea.x, selectedArea.y, selectedArea.width, selectedArea.height)
          }
          break;
        case 2:
          this.selectMode = 0;
          loadPixels();
          selectButton.html("Select Area");
          //resets the selected area
          selectedArea = { x: 0, y: 0, width: 0, height: 0 };

          //changes the visibility of the useSavedButton based on whether
          //there are saved images
          useSavedButton.style(
            "display",
            savedPixels.length > 0 ? "block" : "none"
          );
          savedPixelsSelect.hide();
          break;
      }
    });
    copyButton.mousePressed(() => {
      this.selectMode += 1;
      selectButton.html("end paste");
      hideButtons();
      //removes square
      updatePixels();
      //gets the selected pixels
      selectedPixels = getSelectedPixels();
    });

    deSelectButton.mousePressed(() => {
      //removes square
      eraseSquare();
    });
    saveButton.mousePressed(() => {
      //sets variable saving state to true to prevent drawing while clicking on the pop up
      this.saving = true;
      updatePixels();
      //prompt to get the name of the selected image
      const name = prompt("Give a name to saved image!");
      //if its a valid input, then store the pixel information as the value, with the input as the key
      if (name != "null" && name != "" 
          &&
        (selectedArea.width != 0 || selectedArea.height != 0)
      ) {
        savedPixels.push({name: name, pixels: getSelectedPixels()})
        selectedArea = { x: 0, y: 0, width: 0, height: 0 };
      } else if (name == null) {
        alert("Save Failed! Please enter a name!");
      } else if (selectedArea.width != 0 || selectedArea.height != 0) {
        alert("Save Failed! Please select a valid area!");
      }

      //resets the saving state nnfback to false after 1 second
      setTimeout(() => saving = false, 1000);
    });
    useSavedButton.mousePressed(() => {
      eraseSquare();
      this.selectMode = 2;
      hideButtons();
      //change this
      if (savedPixels.length > 0) {
        savedPixelsSelect.style("display", "block");
        for (let i = 0; i <= savedPixelsSelect.child().length; i++) {
          //resets the select options to prevent undefined bug
          if (savedPixelsSelect.child()[0]) {
            savedPixelsSelect.child()[0].remove();
          }
        }
        //populates the select options with the keys of saved pixels
        for (option of savedPixels) {
          savedPixelsSelect.option(option.name);
        }
      }
      //sets the default selected pixels as the first item in the select
      selectedPixels = savedPixels[0].pixels;
      selectButton.html("end paste");
    });

    savedPixelsSelect.changed(() => {
      if (savedPixelsSelect.selected() != "") {
        for(option of selectedPixels){
          if(option.name ==  savedPixelsSelect.selected()){
            selectedPixels = option.pixels
          }
        }
      }
    });

    //supplementary functions to help keep code DRY
    const eraseSquare = () => {
      updatePixels();
      selectedArea = { x: 0, y: 0, width: 0, height: 0 };
    };

    const hideButtons = () => {
      copyButton.hide();
      deSelectButton.hide();
      saveButton.hide();
      useSavedButton.hide();
    };

    const showButtons = () => {
      copyButton.show();
      deSelectButton.show();
      saveButton.show();
      useSavedButton.show();
    };

    const getSelectedPixels = () => {
      //object destruturing to shorten lines of code
      const { x, y, width, height } = selectedArea;
      const {abs} = Math
      //allows for the image to be selected in whatever orientation the mouse position goes
      //if width/height is less than 0 then it will be negative so use the absolute value
      //likewise add width and/or height to x or y to get the "final mouse position" to be the "starting" position
      if (width < 0 && height < 0) {
        return get(x + width, y + height, abs(width), abs(height));
      }
      else if(selectedArea.width < 0){
        return get(x + width, y, abs(width), height);
      }
      else if (selectedArea.height < 0){
        return get(x, y + height, width, abs(height)); 
      }
      else{
        return get(x,y,width,height);
      }
    };
  };
  this.unselectTool = function() {
		updatePixels();
		//clear options
		select(".options").html("");
	};
}
