$(() => {

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
  const $playerName = $('#playerName');

  $playerName.text('Player 1');

  function rollDice() {
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
    constructor(name, value, calculation, active, playerId) {
      this.name = name;
      this.value = value;
      this.calculation = calculation;
      this.$selectButton = $(`#player${playerId}${name}`);
      this.$displayValue = $(`#player${playerId}${name}Display`);
      this.total = 0;
      this.active = active;
      this.playerId = playerId;
    }
    select() {
      let currentPlayer;
      isPlayer1Turn ? currentPlayer = player1 : currentPlayer = player2;
      if(this.active && this.playerId === currentPlayer.id) {
        this.calculation(this.value);
        if(this.name !== 'pass') {
          this.$selectButton.css('backgroundColor', 'grey');
        }
        currentPlayer.turnCount ++;
        if(isPlayer1Turn) {
          player1.subtotal();
        } else {
          player2.subtotal();
        }
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
      if(currentPlayer.turnCount > 5) {
        this.lower.forEach(category => {
          category.active = true;
        });
        this.upper.forEach(category => {
          category.active = false;
        });
      }
      if(currentPlayer.turnCount > 11) {
        window.alert(`game over! You scored ${this.finalTotal}`);
      }
      isPlayer1Turn = !isPlayer1Turn;

      $playerName.text(`Player ${isPlayer1Turn ? '1' : '2'}`);
    
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
      this.Ones = new category('Ones', 1, sumOfMatching, true, id);
      this.Twos = new category('Twos', 2, sumOfMatching, true, id);
      this.Threes = new category('Threes', 3, sumOfMatching, true, id);
      this.Fours = new category('Fours', 4, sumOfMatching, true, id);
      this.Fives = new category('Fives', 5, sumOfMatching, true, id);
      this.Sixes = new category('Sixes', 6, sumOfMatching, true, id);
      this.upper = [this.Ones, this.Twos, this.Threes, this.Fours, this.Fives, this.Sixes];
      this.upperSubtotal = 0;
      this.upperTotal = 0;
      this.ThreeOfAKind = new category('ThreeOfAKind', 'x3', sumOfAll, false);
      this.FourOfAKind = new category('FourOfAKind', 'x4', sumOfAll, false);
      this.FullHouse = new category('FullHouse', 'FH', setValue, false);
      this.SmallStraight = new category('SmallStraight', 'SS', setValue, false);
      this.LargeStraight = new category('LargeStraight', 'LS', setValue, false);
      this.Yahtzee = new category('Yahtzee', 'x5', setValue, false);
      this.Chance = new category('Chance', 'C', sumOfAll, false);
      this.Pass = new category('Pass', 'P', pass, false);
      this.lowerTotal = 0;
      this.lowerIsActive = false;
      this.lower = [
        this.ThreeOfAKind,
        this.FourOfAKind,
        this.FullHouse,
        this.SmallStraight,
        this.LargeStraight,
        this.Yahtzee,
        this.Chance,
        this.Pass
      ];
      this.finalTotal = 0;
      this.turnCount = 0;
    }
    subtotal() {
      const $subtotalDisplay = $(`#player${this.id}UpperSubtotal`);
      const $UppertotalDisplay = $(`.player${this.id}UpperTotal`);
      const $lowertotalDisplay = $(`#player${this.id}LowerTotal`);
      const $finalTotalDisplay = $(`#player${this.id}FinalTotal`);
      const upperSubtotal = this.upper.reduce((total, category) => {
        return total + category.total;
      }, 0);
      const lowerSubtotal = this.lower.reduce((total, category) => {
        if(category.name === 'pass') return total;
        return total + category.total;
      }, 0);
      this.upperSubtotal = upperSubtotal;
      if(upperSubtotal >= 63) {
        $(`#player${this.id}UpperBonus`).text('35');
        this.upperTotal = this.upperSubtotal + 35;
      } else {
        this.upperTotal = this.upperSubtotal;
      }
      this.lowerTotal = lowerSubtotal;
      this.finalTotal = this.upperTotal + this.lowerTotal;
      $subtotalDisplay.text(this.upperSubtotal);
      $UppertotalDisplay.text(this.upperTotal);
      $lowertotalDisplay.text(this.lowerTotal);
      $finalTotalDisplay.text(this.finalTotal);
    }
  }

  function selectScore() {
    let playerCategory;
    if(isPlayer1Turn) {
      playerCategory = player1[this.id.split('1')[1]];
      if(playerCategory) return playerCategory.select();
    } else {
      playerCategory = player2[this.id.split('2')[1]];
      if(playerCategory) return playerCategory.select();
    }
  }

  const player1 = new game(1);
  const player2 = new game(2);
  const players = [player1, player2];
  let isPlayer1Turn = true;

  players.forEach(player => {
    player.upper.forEach(category => {
      category.$selectButton.on('click', selectScore);
    });
    player.lower.forEach(category => {
      category.$selectButton.on('click', selectScore);
    });
  });


});
