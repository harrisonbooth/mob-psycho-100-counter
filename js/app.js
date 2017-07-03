var App = function() {
  var incrementButton = document.getElementById('increase-counter-button')
  var decrementButton = document.getElementById('decrease-counter-button')
  this.displayText = document.getElementById('display-text')

  window.addEventListener('keydown', function(event) {
    if(!this.canChangeCounter) return
    switch(event.keyCode) {
      case 38:
        event.preventDefault()
        this.changeCounter(this.incrementCounter)
        break
      case 40:
        event.preventDefault()
        this.changeCounter(this.decrementCounter)
        break
    }
  }.bind(this))

  this.canChangeCounter = true
  this.counter = 0

  this.playState = "paused"
  this.animationName = "shake"
  this.color = "white"
}

App.prototype = {
  render: function() {
    this.changeDisplayText(this.counter)
  },

  changeDisplayText: function(number) {
    switch(number) {
      case 49:
        this.color = "white"
        break
      case 50: case 69:
        this.color = "khaki"
        break
      case 70: case 79:
        this.color = "gold"
        this.playState = "paused"
        break
      case 80: case 89:
        this.color = "gold"
        this.playState = "running"
        this.animationName = "shake"
        document.body.style.filter = "blur(0px)"
        break
      case 90: case 94:
        this.color = "orange"
        this.animationName = "shake-with-blur"
        break
      case 95: case 99:
        this.color = "orangered"
        this.playState = "running"
        this.animationName = "shake-with-lots-of-blur"
        break
      case 100:
        this.color = "red"
        this.playState = "paused"
        this.animationName = "shake"
        document.body.style.filter = "blur(0px)"
        break
    }

    if(this.canChangeCounter === false) {
      document.body.style.filter = "blur(0px)"
      this.playState = "paused"
      this.animationName = "shake"
    }

    document.getElementById('counter-container').style.color = this.color
    document.body.style.animationName = this.animationName
    document.body.style.animationPlayState = this.playState

    this.displayText.innerText = number
  },

  changeCounter: function(callback) {
    var newCounter = callback(this.counter)
    if(newCounter > 100 || newCounter < 0) return

    if(newCounter === 100) {
      this.hitLimit()
      this.canChangeCounter = false
    } else {
      this.playChangeSound()
    }

    this.counter = newCounter
    this.render()
  },

  incrementCounter: function(number, increase) {
    return number + 1
  },

  decrementCounter: function(number, decrease) {
    return number - 1
  },

  playChangeSound: function() {
    var counterSound = new Audio('sounds/counterChangeBleep.mp3')
    counterSound.volume = 1
    counterSound.play()
  },

  play100PercentSound: function() {
    var limitSound = new Audio('sounds/testSound.mp3')
    limitSound.volume = 0.05
    limitSound.currentTime = 0.1
    limitSound.play()
    setTimeout(function() {
      limitSound.pause()
    }, 1100)
  },

  hitLimit: function() {
    this.play100PercentSound()
    setTimeout(function() {
      document.body.style.backgroundImage = "url('gif/mobFreakoutLonger.gif')"
      this.countDown()
    }.bind(this), 1100)
  },

  countDown: function() {
    if(this.counter > 0) setTimeout(function() {
      this.changeCounter(this.decrementCounter)
      if(this.counter === 0) {
        this.canChangeCounter = true
        document.body.style.backgroundImage = "none"
      }
      this.countDown()
    }.bind(this), 45)
  }
}

window.addEventListener('load', function() {
  var app = new App()
  app.render()
})
