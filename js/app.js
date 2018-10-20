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
        this.$domElement.text('');
        this.$domElement.css('backgroundImage', `url(./${value}.png)`);
      }
    }
    makeInactive() {
      // if(this.value && this.active) {
      this.active = false;
      this.$domElement.css('border', '2px solid red');
    }
    makeActive() {
      this.active = true;
      this.$domElement.css('border', '1px solid black');
    }
  }

  const die1 = new Die(1);
  const die2 = new Die(2);
  const die3 = new Die(3);
  const die4 = new Die(4);
  const die5 = new Die(5);

  const dice = [die1, die2, die3, die4, die5];
  let rollCount = 0;
  const $playerName = $('#playerName');

  $playerName.text('Player 1');

  function rollDice() {
    if(rollCount < 3) {
      dice.forEach(die => {
        if(die.active) {
          die.roll();
        }
      });
      rollCount ++;
    } else if(rollCount === 3) {
      dice.forEach(die => {
        die.makeInactive();
        die.$holdButton.css('backgroundColor', 'grey');
        $rollButton.css('backgroundColor', 'grey');
      });
    }

    if(section === 'upper' && rollCount === 1) {
      currentPlayer.upper.forEach(category => category.switchActive());
    } else if(rollCount === 1){
      player1.lower.forEach(category => category.active = true);
      player2.lower.forEach(category => category.active = true);
      currentPlayer.lower.forEach(category => category.switchActive());
    }
  }

  function holdDie() {
    const targetDie = dice[this.classList.value[0] -1];
    if(targetDie.active) {
      targetDie.makeInactive();
    } else {
      targetDie.makeActive();
    }
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
      if(isPlayer1Turn) {
        currentPlayer = player1;
        otherPlayer = player2;
      } else {
        currentPlayer = player2;
        otherPlayer = player1;
      }

      if(this.active) {
        this.calculation(this.value);
        if(this.name !== 'pass') {
          this.$selectButton.css('backgroundColor', 'grey');
        }
        currentPlayer.turnCount ++;
        currentPlayer.subtotal();
        this.active = false;
      }

      $rollButton.css('backgroundColor', 'white');

      dice.forEach(die => {
        die.makeActive();
      });

      rollCount = 0;

      this.switchActive();

      this.switchTurns();



    }
    switchActive() {
      if(this.active) {
        console.log(this);
        this.$selectButton.on('click', selectScore);
      } else {
        this.$selectButton.off('click', selectScore);
      }

    }
    // makeInactive() {
    //   if(this.name !== 'pass') {
    //     this.active = false;
    //   }
    // }
    switchTurns() {
      if(currentPlayer.turnCount === 6 && otherPlayer.turnCount === 6 ) {
        this.switchSection();
      }
      if(currentPlayer.turnCount === 12 && otherPlayer.turnCount === 12) {
        if(player1.finalTotal > player2.finalTotal) {
          window.alert(`game over! Player 1 wins ${player1.finalTotal} to ${player2.finalTotal}`);
        } else if(player1.finalTotal === player2.finalTotal) {
          window.alert('It\'s a draw!');
        } else {
          window.alert(`game over! Player 2 wins ${player2.finalTotal} to ${player1.finalTotal}`);
        }
      }
      isPlayer1Turn = !isPlayer1Turn;
      if(isPlayer1Turn) {
        currentPlayer = player1;
        otherPlayer = player2;
      } else {
        currentPlayer = player2;
        otherPlayer = player1;
      }

      $playerName.text(`Player ${isPlayer1Turn ? '1' : '2'}`);
    }
    switchSection() {
      player1.upper.forEach(category => {
        category.$selectButton.off('click', selectScore);
      });
      player2.upper.forEach(category => {
        category.$selectButton.off('click', selectScore);
      });
      section = 'lower';
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
      FullHouse: 25,
      SmallStraight: 30,
      LargeStraight: 40,
      Yahtzee: 50
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
      this.ThreeOfAKind = new category('ThreeOfAKind', 'x3', sumOfAll, false, id);
      this.FourOfAKind = new category('FourOfAKind', 'x4', sumOfAll, false, id);
      this.FullHouse = new category('FullHouse', 'FH', setValue, false, id);
      this.SmallStraight = new category('SmallStraight', 'SS', setValue, false, id);
      this.LargeStraight = new category('LargeStraight', 'LS', setValue, false, id);
      this.Yahtzee = new category('Yahtzee', 'x5', setValue, false, id);
      this.Chance = new category('Chance', 'C', sumOfAll, false, id);
      this.Pass = new category('Pass', 'P', pass, false, id);
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
        if(category.name === 'Pass') return total;
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
  let currentPlayer = player1;
  let otherPlayer = player2;
  let section = 'upper';

  let isPlayer1Turn = true;



});
