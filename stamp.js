function Stamp() {
  //set an icon and a name for the object
	this.icon = "assets/stamp.jpg";
	this.name = "stamp";
  //object containing the images and their urls
  this.Images = {
  	star: loadImage("assets/star.png"),
    triangle: loadImage("assets/triangle.png"),
    stamp: loadImage("assets/stamp.png"),
    heart: loadImage("assets/heart.png"),
    basketball: loadImage("assets/basketball.png"),
    randomRobot: null,
    text: ""
  };
  this.currentImage = this.Images.star
  
  //sets default image as the star
  
  let imageSize = 20;

  this.draw = function () {
    if (mouseIsPressed && mouseY < height && mouseX > 0) {
      let x = mouseX - imageSize / 2;
      let y = mouseY - imageSize / 2;
      if(this.currentImage == this.Images.text){
        textSize(imageSize)
        text(this.Images.text, x, mouseY)
      }
      else{
        image(this.currentImage, x, y, imageSize, imageSize);
      }
      
    }
  };

  this.populateOptions = function () {
    imageSize = 20;
    this.currentImage = this.Images.star
    const optionsDiv = document.getElementById("options");
    select(".options").html("<select id='dropdown'></select>");
    const dropdown = select("#dropdown");
    //populating the options
    for (option in this.Images) {
      dropdown.option(option);
    }

    //initialize the slider and its text in the options div
    const slider = createSlider(20, 200, 20);
    const sliderText = document.createElement("p");
    const sliderValueText = document.createElement("p");

    sliderText.innerHTML = "Change Stamp size";
    sliderValueText.innerHTML = `size: 20px`;

    const sliderContainer = document.createElement("div");
    optionsDiv.appendChild(sliderContainer);
    sliderContainer.appendChild(sliderText);
    slider.parent(sliderContainer);
    sliderContainer.appendChild(sliderValueText);

    //initializes the get Random Robot Button and places it as a child of the options Div
    const getRandomRobotButton = createButton('Get random robot!')
    getRandomRobotButton.parent(optionsDiv);

    const inputDiv = document.createElement("div");
    const input = createInput('')
    const inputText = document.createElement("p")
    
    optionsDiv.appendChild(inputDiv);
    inputText.innerHTML = "Stamp your own text!"
    inputDiv.appendChild(inputText)
    input.parent(inputDiv)
    



    //sets the current Stamp Image to a random Robot and tge dropdown to show random Robot selected
    getRandomRobotButton.mousePressed(() => {
      this.currentImage = loadImage(`https://robohash.org/${Math.random()}`)
        dropdown.selected('randomRobot')
    })

    //options logic
    dropdown.changed(() => {
      //ternary operator to determine whether to generate a random robot or to display the preloaded image
      this.currentImage =
      dropdown.selected() == "randomRobot"
          ? loadImage(`https://robohash.org/${Math.random()}`)
          : this.Images[dropdown.selected()];
    });

    slider.changed(() => {
      imageSize = slider.value();
      sliderValueText.innerHTML = `size: ${imageSize}px`;
    });

    input.changed(() => {
      this.Images.text = input.value();
      this.currentImage = this.Images.text
      dropdown.selected('text')
    })
  };
  this.unselectTool = function() {
		updatePixels();
		//clear options
		select(".options").html("");
	};
}
