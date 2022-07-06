
//#region Initialize Values
const tetCountObj = document.getElementById('tet-count');
var chips = 0;
var totalFlips = 0;
var flipSpeedMultiplier = 1;
var flipChipGainMultiplier = 1;
var coinUpgradesShown = false;
const FLIPS_FOR_UPGRADES = 1;
//takes 3 seconds to flip a coin by default
const BASE_FLIP_RATE = 3000;



//maps between html item names and their values
const coinMap = new Map();
const baseCoinVals = {
    coinName: "coin0",
    canFlip: true,
    flipSide: 0, //0 for heads, 1 for tails, 2 for side(if need be)
    headStreak: 0,
    headStreakMax: 0,
    tailStreak: 0,
    tailStreakMax: 0,
    tetMultiplier: 1
}



InitializeGame();

//#endregion

//#region General util functions

function GainChips(chipCount){
  chips += chipCount;
  $('#chip-count').text(chips);
}
function LoseChips(chipCount){
  chips -= chipCount;
  $('#chip-count').text(chips);
  CheckUpgrades();
}

//#endregion
function InitializeGame(){
  $.getScript("src/js/coinUpgrades.js", function (){
    InitializeCoinUpgrades();
    NewGame();
  });
  
  //check for save data, for now just go with default
  
}

function NewGame(){
  AddCoin(0);
  AddUpgrade("FlipSpeed1");
}


window.setInterval( function() {
  CheckUpgrades();
  CheckProgress();
}, 1000);



function CheckProgress(){
  if(coinUpgradesShown == false){
    if(totalFlips >= FLIPS_FOR_UPGRADES){
      ShowCoinUpgrades();
    }
  }
}

//#region Coins/CoinFlipping
function AddCoin(coinType){
    let coinCount = coinMap.size;
    let coinName = "coin" + coinCount;
    let coinTypeName = "coin" + coinType;
    $('#allCoins').append(`<div class="col-3 text-center">
    <div class="coin" id="` + coinName + `">
      <div class="heads">
        <img src="./src/img/` + coinTypeName + `Heads.png" alt="Image for coin's head" />
      </div>
      <div class="tails">
        <img src="./src/img/` + coinTypeName + `Tails.png" alt="Image for coin's tail" />
      </div>
    </div>
    <button id ="` + coinName + `flip" class ="btn btn-dark" onclick="Toss('` + coinName + `')">Flip</button>
    <br>
    <div class="row">
      <div class="col-6 text-left">
        Heads: <span id="` + coinName + `-head-streak">0</span><br>
        Tails: <span id="` + coinName + `-tail-streak">0</span>
      </div>
      <div class="col-6 text-left">
        Max: <span id="` + coinName + `-head-streak-max">0</span><br>
        Max: <span id="` + coinName + `-tail-streak-max">0</span>
      </div>
    </div>   
  </div>`);
    NewCoinStats(coinName, coinType);
}


function NewCoinStats(coinName, coinType){
    const coinVals = structuredClone(baseCoinVals);
    coinVals.coinName = coinName;
    switch (coinType){
        case 0:
            break;
        default:
            console.log("Error: No coin type for: " + coinType);
    }
    coinMap.set(coinName,coinVals);
}
function Toss(coinName) {    
    const coinVals = coinMap.get(coinName);
    if(coinVals.canFlip == false){
        return;
    }
    coinVals.canFlip = false;
    const coin = document.getElementById(coinName);
    if(coinVals.flipSide == 0){
        coin.style.setProperty('--flipStart','0');
    } else {
        coin.style.setProperty('--flipStart','180deg');
    }
    let flipTime = GetFlipSpeed();
    coin.style.animation = "none";
    coin.offsetHeight;
    coin.style.animation = null;
    let flipResult = -1;
    if (Math.random() >= 0.5) {
      coin.style.setProperty('--flipEnd','2520deg');
      coin.style.animation = "flipSpin " + flipTime + "ms forwards cubic-bezier(.55,.52,.67,.87), flipGrow " + flipTime+"ms ease";
      flipResult = 0;
    } else {
      coin.style.setProperty('--flipEnd','2700deg');
      coin.style.animation = "flipSpin " + flipTime + "ms forwards cubic-bezier(.55,.52,.67,.87), flipGrow " + flipTime+"ms ease";
      flipResult = 1;
    }
    setTimeout(() => (TossResult(coinName,coinVals,flipResult)),flipTime)
}

function TossResult(coinName, coinVals, flipResult){
  totalFlips++;
  coinVals.flipSide = flipResult;
  coinVals.canFlip = true;
  if(flipResult == 0){
      coinVals.tailStreak = 0;
      coinVals.headStreak++;
      coinVals.headStreakMax = Math.max(coinVals.headStreak,coinVals.headStreakMax);
      let tetGain = coinVals.headStreak * coinVals.tetMultiplier;
      GainChips(tetGain);
  } else {
      coinVals.headStreak = 0;
      coinVals.tailStreak++;
      coinVals.tailStreakMax = Math.max(coinVals.tailStreak,coinVals.tailStreakMax);
  }
  UpdateCoinText(coinVals);
}


function UpdateCoinText(coinVals){
  $('#'+coinVals.coinName+'-head-streak').text(coinVals.headStreak);
  $('#'+coinVals.coinName+'-head-streak-max').text(coinVals.headStreakMax);
  $('#'+coinVals.coinName+'-tail-streak').text(coinVals.tailStreak);
  $('#'+coinVals.coinName+'-tail-streak-max').text(coinVals.tailStreakMax);
}

function GetFlipSpeed(){
  return BASE_FLIP_RATE/flipSpeedMultiplier;
}

//#endregion


  