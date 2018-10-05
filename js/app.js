// Game object?
//1's
  // function
  // selectButton domElement
  // displayValue domElement
  // total
  // active t/f
//2's
//3's
//4's
//5's
//6's

// round object
//
// class category {
//   constructor(value, calculation, $selectButton, $displayValue, total, active) {
//     this.value = value;
//     this.calculation = calculation;
//     this.$selectButton = $selectButton;
//     this.$displayValue = $displayValue;
//     this.total = total;
//     this.active = active;
//   }
//   select() {
//     if(this.active) {
//       this.calculation();
//     }
//     this.active = false;
//   }
// }
//
// function sumOfMatching(sumValue) {
//   return 0;
// }
//
// function sumOfAll() {
//   return 1;
// }
//
// class game {
//   constructor(id) {
//     this.id = id;
//     this.ones = new category(1, sumOfMatching, $('body'), $('body'), 0, true);
//   }
// }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// // class Die {
// //   constructor(id, domElement, displayValue, holdButton, value, active) {
// //     this.id = id;
// //     this.domElement = domElement;
// //     this.displayValue = displayValue;
// //     this.holdButton = holdButton;
// //     this.value = value;
// //     this.active = active;
// //   }
// //   roll() {
// //     if(this.active) {
// //       const value = Math.floor(Math.random() * 6) + 1;
// //       this.value = value;
// //       console.log(this);
// //       this.displayValue.text(value);
// //     }
// //   }
// //   hold() {
// //     if(this.value) {
// //       this.active = false;
// //     }
// //   }
// // }
//
//
//
// const scoreCard = {};
//
// function setUp() {
//   scoreCard.ones = {
//     total: 0,
//     displayValue: $('.ones'),
//     formula: function() {
//       console.log(dice.filter(die => die.value === 1));
//       this.total = dice.filter(die => die.value === 1).reduce((total, die) => {
//         console.log(total);
//         return total + die.value;
//       }, 0);
//       console.log(this);
//       this.displayValue.text(this.total);
//     },
//     selectButton: $('#ones'),
//     active: true
//   };
//   dice.forEach(die => {
//     die.domElement.append(die.displayValue, `<button class=die${die.id}Hold id=${die.id}>Hold</button>`);
//     $('.gameboard').append(die.domElement);
//     $(`.die${die.id}Hold`).on('click', hold);
//   });
//   $('.gameboard').append($rollButton);
//
//   scoreCard.ones.selectButton.on('click', select);
// }
//
//
//
// function hold() {
//   dice[this.id -1].hold();
// }
//
// function select() {
//   scoreCard[this.id].formula();
// }

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
        const value = Math.floor(Math.random() * 6) + 1;
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

  function rollDice() {
    if(rollCount < 3) {
      dice.forEach(dice => dice.roll());
      rollCount ++;
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
      }
      dice.forEach(die => {
        die.active = true;
        die.$domElement.css('border', '1px solid black');
      });
      rollCount = 0;
      this.active = false;
    }
  }

  function sumOfMatching(matchValue) {
    const matchingDie = dice.filter(die => die.value === matchValue);
    const total = matchingDie.reduce((total, die) => total + die.value, 0);
    this.total = total;
    this.active = false;
    this.$displayValue.text(total);
  }

  function sumOfAll() {
    return 1;
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
    }
  }

  function selectScore() {
    game1[this.id].select();
  }

  const game1 = new game(1);
  game1.upper.forEach(category => {
    category.$selectButton.on('click', selectScore);
  });



});
