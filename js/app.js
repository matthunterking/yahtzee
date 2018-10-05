$(function(){

  const $rollButton = $('.rollButton');

  class Die {
    constructor(id) {
      this.value = 0;
      this.$domElement = $(`#${id}`);
      this.$holdButton = $(`.${id}dieHold`);
      this.active = true;
      this.$holdButton.on('click', holdDie);
    }
    roll() {
      if(this.active) {
        // NOTE: uncomment line 16 when not testing;
        const value = Math.floor(Math.random() * 6) + 1;
        // const value = 3;
        this.value = value;
        this.$domElement.text(value);
      }
    }
    hold() {
      if(this.value && this.active) {
        this.active = false;
        this.$domElement.css('border', '2px solid red');
      } else if(!this.active) {
        this.active = true;
        this.$domElement.css('border', '1px solid black');
      }
    }
  }

  const die1 = new Die(1);
  const die2 = new Die(2);
  const die3 = new Die(3);
  const die4 = new Die(4);
  const die5 = new Die(5);

  const dice = [die1, die2, die3, die4, die5];
  let rollCount = 0;
  let turnCount = 0;

  function rollDice() {
    console.log(rollCount);
    if(rollCount < 3) {
      dice.forEach(dice => dice.roll());
      rollCount ++;
    } else if(rollCount === 3) {
      $rollButton.css('backgroundColor', 'grey');
    }
  }

  function holdDie() {
    dice[this.classList.value[0] -1].hold();
  }

  $rollButton.on('click', rollDice);

  class category {
    constructor(name, value, calculation) {
      this.name = name;
      this.value = value;
      this.calculation = calculation;
      this.$selectButton = $(`#${name}`);
      this.$displayValue = $(`#${name}Display`);
      this.total = 0;
      this.active = true;
    }
    select() {
      if(this.active) {
        this.calculation(this.value);
        this.$selectButton.css('backgroundColor', 'grey');
        turnCount ++;
        game1.subtotal();
      }
      $rollButton.css('backgroundColor', 'white');
      dice.forEach(die => {
        die.active = true;
        die.$domElement.css('border', '1px solid black');
      });
      rollCount = 0;
      this.active = false;
      if(turnCount > 5) {
        // TODO: Add in a way to switch between upper and lower
        console.log('end!!!');
      }
    }
  }

  function sumOfMatching(matchValue) {
    const matchingDie = dice.filter(die => die.value === matchValue);
    const total = matchingDie.reduce((total, die) => total + die.value, 0);
    this.total = total;
    this.active = false;
    this.$displayValue.text(total);
  }

  function sumOfAll(condition) {
    if(checkCondition(condition)){
      this.total = dice.reduce((total, die) => total + die.value, 0);
    } else {
      this.total = 0;
    }
    this.active = false;
    this.$displayValue.text(this.total);
  }

  function setValue(condition) {
    if(checkCondition(condition)){
      this.total = 50;
      this.active = false;
      this.$displayValue.text('50');
    } else {
      this.total = 0;
    }
  }

  function checkCondition(condition) {
    let pass = false;
    if(condition === 'x3') {
      pass = sameOfAKindCheck(3);
    } else if(condition === 'x4') {
      pass = sameOfAKindCheck(4);
    } else if(condition === 'x5') {
      pass = sameOfAKindCheck(5);
    }
    return pass;
  }

  function sameOfAKindCheck(number) {
    let pass = false;
    const diceTotals = dice.sort().reduce((object, die) => {
      object[die.value] = object[die.value] ? object[die.value] + 1 : 1;
      return object;
    }, {});
    Object.keys(diceTotals).forEach(key => {
      if(diceTotals[key] >= number) {
        return pass = true;
      }
    });
    return pass;
  }

  class game {
    constructor(id) {
      this.id = id;
      this.ones = new category('ones', 1, sumOfMatching);
      this.twos = new category('twos', 2, sumOfMatching);
      this.threes = new category('threes', 3, sumOfMatching);
      this.fours = new category('fours', 4, sumOfMatching);
      this.fives = new category('fives', 5, sumOfMatching);
      this.sixes = new category('sixes', 6, sumOfMatching);
      this.upper = [this.ones, this.twos, this.threes, this.fours, this.fives, this.sixes];
      this.upperTotal = 0;
      this.threeOfAKind = new category('threeOfAKind', 'x3', sumOfAll);
      this.fourOfAKind = new category('fourOfAKind', 'x4', sumOfAll);

      this.yahtzee = new category('yahtzee', 'x5', setValue);

      this.lower = [this.threeOfAKind, this.fourOfAKind, this.yahtzee];
    }
    subtotal() {
      const $subtotalDisplay = $('#upperSubtotal');
      const $grandTotalDisplay = $('#upperTotal');
      const subtotal = this.upper.reduce((total, category) => {
        return total + category.total;
      }, 0);
      $subtotalDisplay.text(subtotal);
      this.upperTotal = subtotal;
      if(subtotal >= 63) {
        $('#upperBonus').text('35');
        this.upperTotal += 35;
      }
      $grandTotalDisplay.text(this.upperTotal);
    }
  }

  function selectScore() {
    game1[this.id].select();
  }

  const game1 = new game(1);
  game1.upper.forEach(category => {
    category.$selectButton.on('click', selectScore);
  });
  //TODO DO THIS AFTER UPPER IS FINISHED
  game1.lower.forEach(category => {
    category.$selectButton.on('click', selectScore);
  });

  console.log(game1);

});
