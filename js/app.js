const $rollButton = $('<button class="rollButton">Roll</button>');

class Die {
  constructor(id, domElement, displayValue, holdButton, value, active) {
    this.id = id;
    this.domElement = domElement;
    this.displayValue = displayValue;
    this.holdButton = holdButton;
    this.value = value;
    this.active = active;
  }
  roll() {
    if(this.active) {
      const value = Math.floor(Math.random() * 6) + 1;
      this.value = value;
      console.log(this);
      this.displayValue.text(value);
    }
  }
  hold() {
    if(this.value) {
      this.active = false;
    }
    console.log(this);
  }
}

const die1 = new Die(1, $('<div class="dice" id="1"></div>'), $('<p class="die1Value">-</p>'), '<button class=die1Hold>Hold</button>',  0, true);
const die2 = new Die(2, $('<div class="dice" id="2"></div>'), $('<p class="die2Value">-</p>'), '<button class=die2Hold>Hold</button>', 0, true);
const die3 = new Die(3, $('<div class="dice" id="3"></div>'), $('<p class="die3Value">-</p>'), '<button class=die3Hold>Hold</button>', 0, true);
const die4 = new Die(4, $('<div class="dice" id="4"></div>'), $('<p class="die4Value">-</p>'), '<button class=die4Hold>Hold</button>', 0, true);
const die5 = new Die(5, $('<div class="dice" id="5"></div>'), $('<p class="die5Value">-</p>'), '<button class=die5Hold>Hold</button>', 0, true);

const dice = [die1, die2, die3, die4, die5];


function setUp() {
  dice.forEach(die => {
    die.domElement.append(die.displayValue, `<button class=die${die.id}Hold id=${die.id}>Hold</button>`);
    $('.gameboard').append(die.domElement);
    $(`.die${die.id}Hold`).on('click', hold);
  });
  $('.gameboard').append($rollButton);
  $rollButton.on('click', rollDice);
}

function rollDice() {
  dice.forEach(dice => dice.roll());
}

function hold() {
  dice[this.id -1].hold();
}

$(function(){
  setUp();
});
