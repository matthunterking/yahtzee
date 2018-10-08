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
    constructor(name, value, calculation, active) {
      this.name = name;
      this.value = value;
      this.calculation = calculation;
      this.$selectButton = $(`#${name}`);
      this.$displayValue = $(`#${name}Display`);
      this.total = 0;
      this.active = active;
    }
    select() {
      if(this.active) {
        this.calculation(this.value);
        if(this.name !== 'pass') {
          this.$selectButton.css('backgroundColor', 'grey');
        }
        turnCount ++;
        game1.subtotal();
      }
      $rollButton.css('backgroundColor', 'white');
      dice.forEach(die => {
        die.active = true;
        die.$domElement.css('border', '1px solid black');
      });
      rollCount = 0;
      if(this.name !== 'pass') {
        this.active = false;
      }
      if(turnCount > 5) {
        game1.lower.forEach(category => {
          category.active = true;
        });
        game1.upper.forEach(category => {
          category.active = false;
        });
        turnCount = 0;
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
    const values = {
      fullHouse: 25,
      smallStraight: 30,
      largeStraight: 40,
      yahtzee: 50
    };
    if(checkCondition(condition)){
      this.total = values[this.name];
      this.active = false;
      this.$displayValue.text(this.total);
    } else {
      this.total = 0;
      this.$displayValue.text(this.total);
    }
  }

  function pass() {
    this.total += 1;
    this.$displayValue.text(`${this.total} passes`);
  }
  
  function checkCondition(condition) {
    let pass = false;
    switch (condition) {
      case 'x3':
        pass = sameOfAKindCheck(3);
        break;
      case 'x4':
        pass = sameOfAKindCheck(4);
        break;
      case 'x5':
        pass = sameOfAKindCheck(5);
        break;
      case 'FH':
        pass = fullHouseCheck();
        break;
      case 'SS':
        pass = straightCheck('SS');
        break;
      case 'LS':
        pass = straightCheck('LS');
        break;
      case 'C':
        pass = true;
        break;
    }
    return pass;
  }

  function sameOfAKindCheck(number) {
    let pass = false;
    const diceSummary = dice.sort().reduce((object, die) => {
      object[die.value] = object[die.value] ? object[die.value] + 1 : 1;
      return object;
    }, {});
    Object.keys(diceSummary).forEach(key => {
      if(diceSummary[key] >= number) {
        return pass = true;
      }
    });
    return pass;
  }

  function fullHouseCheck() {
    let pass = false;
    const diceSummary = dice.sort().reduce((object, die) => {
      object[die.value] = object[die.value] ? object[die.value] + 1 : 1;
      return object;
    }, {});
    const sortedDiceSummary = Object.keys(diceSummary).sort((a, b) => {
      return diceSummary[a] < diceSummary[b];
    });
    if(diceSummary[sortedDiceSummary[0]] === 3 && diceSummary[sortedDiceSummary[1]] === 2) {
      pass = true;
    }
    return pass;
  }


  function straightCheck(type) {
    let pass;
    let run = 0;
    let passLevel;

    switch (type) {
      case 'SS':
        passLevel = 3;
        break;
      case 'LS':
        passLevel = 4;
        break;
    }

    const uniqueDice = dice.sort((a, b) => a.value > b.value).filter((die, index, array) => {
      if(index === 0) return true;
      return die.value !== array[index -1].value;
    });

    uniqueDice.forEach((die, index, array) => {
      if(index !== 0) {
        if(die.value === array[index -1].value + 1) {
          run += 1;
        }
      }
    });
    run >= passLevel ? pass = true : pass = false;
    return pass;
  }

  class game {
    constructor(id) {
      this.id = id;
      this.ones = new category('ones', 1, sumOfMatching, true);
      this.twos = new category('twos', 2, sumOfMatching, true);
      this.threes = new category('threes', 3, sumOfMatching, true);
      this.fours = new category('fours', 4, sumOfMatching, true);
      this.fives = new category('fives', 5, sumOfMatching, true);
      this.sixes = new category('sixes', 6, sumOfMatching, true);
      this.upper = [this.ones, this.twos, this.threes, this.fours, this.fives, this.sixes];
      this.upperTotal = 0;
      this.threeOfAKind = new category('threeOfAKind', 'x3', sumOfAll, false);
      this.fourOfAKind = new category('fourOfAKind', 'x4', sumOfAll, false);
      this.fullHouse = new category('fullHouse', 'FH', setValue, false);
      this.smallStraight = new category('smallStraight', 'SS', setValue, false);
      this.largeStraight = new category('largeStraight', 'LS', setValue, false);
      this.yahtzee = new category('yahtzee', 'x5', setValue, false);
      this.chance = new category('chance', 'C', sumOfAll, false);
      this.pass = new category('pass', 'P', pass, false);

      this.lower = [
        this.threeOfAKind,
        this.fourOfAKind,
        this.fullHouse,
        this.smallStraight,
        this.largeStraight,
        this.yahtzee,
        this.chance,
        this.pass
      ];
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


});
