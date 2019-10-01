var App = function() {
  var incrementButton = document.getElementById('increase-counter-button')
  var decrementButton = document.getElementById('decrease-counter-button')
  this.displayText = document.getElementById('display-text')

  window.addEventListener('keydown', function (event) {
    if(!this.canChangeCounter) return;
    switch(event.keyCode) {
      case 38:
        event.preventDefault();
        this.changeCounter(this.incrementCounter);
        break;
      case 40:
        event.preventDefault();
        this.changeCounter(this.decrementCounter);
        break;
    }
  }.bind(this));

  var isOnMobile = window.matchMedia("only screen and ( max-device-width: 750px )").matches;
  if(isOnMobile) {
    var topTouchBox = document.getElementById("top-touch-box");
    var bottomTouchBox = document.getElementById("bottom-touch-box");

    topTouchBox.addEventListener("touchend", function (event) {
      if(!this.canChangeCounter) return;
      this.changeCounter(this.incrementCounter);
    }.bind(this));

    bottomTouchBox.addEventListener("touchend", function (event) {
      if(!this.canChangeCounter) return;
      this.changeCounter(this.decrementCounter);
    }.bind(this));
  }

  this.canChangeCounter = true;
  this.counter = JSON.parse(localStorage.getItem("counter")) || 50;


  this.style = JSON.parse(localStorage.getItem("style")) || {
    playState: "paused",
    animationName: "shake",
    color: "white"
  };
}

App.prototype = {
  render: function() {
    this.changeDisplayText(this.counter)
  },

  changeDisplayText: function (number) {
    switch(number) {
      case 49:
        this.style.color = "white";
        break;
      case 50: case 69:
        this.style.color = "khaki";
        break;
      case 70: case 79:
        this.style.color = "gold";
        this.style.playState = "paused";
        break;
      case 80: case 89:
        this.style.color = "gold";
        this.style.playState = "running";
        this.style.animationName = "shake";
        this.style.filter = "blur(0px)";
        break
      case 90: case 94:
        this.style.color = "orange";
        this.style.animationName = "shake-with-blur";
        break;
      case 95: case 99:
        this.style.color = "orangered";
        this.style.playState = "running";
        this.style.animationName = "shake-with-lots-of-blur";
        break;
      case 100:
        this.style.color = "red";
        this.style.playState = "paused";
        this.style.animationName = "shake";
        this.style.filter = "blur(0px)";
        break;
    }

    if(this.canChangeCounter === false) {
      this.style.filter = "blur(0px)";
      this.style.playState = "paused";
      this.style.animationName = "shake";
    }

    document.getElementById('counter-container').style.color = this.style.color;
    document.body.style.animationName = this.style.animationName;
    document.body.style.animationPlayState = this.style.playState;
    document.body.style.filter = this.style.filter;

    localStorage.setItem("style", JSON.stringify(this.style));

    this.displayText.innerText = number;
  },

  changeCounter: function  (callback) {
    var newCounter = callback(this.counter);
    if(newCounter > 100 || newCounter < 0) return;

    if(newCounter === 100) {
      this.hitLimit();
      this.canChangeCounter = false;
    } else {
      this.playChangeSound();
    }

    this.counter = newCounter;
    localStorage.setItem("counter", newCounter);
    this.render();
  },

  incrementCounter: function (number, increase) {
    return number + 1;
  },

  decrementCounter: function (number, decrease) {
    return number - 1;
  },

  playChangeSound: function () {
    var counterSound = new Audio('sounds/counterChangeBleep.mp3');
    counterSound.volume = 1;
    counterSound.play();
  },

  play100PercentSound: function () {
    var limitSound = new Audio('sounds/100PercentSound.mp3');
    limitSound.volume = 0.05;
    limitSound.currentTime = 0.1;
    limitSound.play();
    setTimeout(function() {
      limitSound.pause();
    }, 1100);
  },

  hitLimit: function () {
    this.play100PercentSound();
    setTimeout(function() {
      document.body.style.backgroundImage = "url('gif/mobFreakoutHD.gif')";
      this.countDown();
    }.bind(this), 1100);
  },

  countDown: function() {
    if(this.counter > 0) setTimeout(function () {
      this.changeCounter(this.decrementCounter);
      if(this.counter === 0) {
        this.canChangeCounter = true;
        document.body.style.backgroundImage = "none";
      }
      this.countDown();
    }.bind(this), 43)
  }
}

window.addEventListener('load', function () {
  var app = new App();
  app.render();
});
