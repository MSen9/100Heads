//maps between html item names and their 
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
const tetCountObj = document.getElementById('tet-count');
var tetras = 0;

function addCoin(coinType){
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
    <button id ="` + coinName + `flip" class ="btn btn-dark" onclick="toss('` + coinName + `')">Flip</button>
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
    newCoinStats(coinName, coinType);
}


function newCoinStats(coinName, coinType){
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
function toss(coinName) {    
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
    let flipTime = 1+Math.random()*2;
    coin.style.animation = "none";
    coin.offsetHeight;
    coin.style.animation = null;
    let flipResult = -1;
    if (Math.random() >= 0.5) {
      coin.style.setProperty('--flipEnd','2520deg');
      coin.style.animation = `flipSpin 3s forwards cubic-bezier(.55,.52,.67,.87), flipGrow 3s ease`;
      flipResult = 0;
    } else {
      coin.style.setProperty('--flipEnd','2700deg');
      coin.style.animation = `flipSpin 3s forwards cubic-bezier(.55,.52,.67,.87), flipGrow 3s ease`;
      flipResult = 1;
    }
    setTimeout(() => (tossResult(coinName,coinVals,flipResult)),3000)
  }

  function tossResult(coinName, coinVals, flipResult){
    coinVals.flipSide = flipResult;
    coinVals.canFlip = true;
    if(flipResult == 0){
        coinVals.tailStreak = 0;
        coinVals.headStreak++;
        coinVals.headStreakMax = Math.max(coinVals.headStreak,coinVals.headStreakMax);
        let tetGain = coinVals.headStreak * coinVals.tetMultiplier;
        gainTets(tetGain);
    } else {
        coinVals.headStreak = 0;
        coinVals.tailStreak++;
        coinVals.tailStreakMax = Math.max(coinVals.tailStreak,coinVals.tailStreakMax);
    }
    updateCoinText(coinVals);
  }
  function gainTets(tetCount){
      tetras += tetCount;
      $('#tet-count').text(tetras);
  }
  function updateCoinText(coinVals){
    $('#'+coinVals.coinName+'-head-streak').text(coinVals.headStreak);
    $('#'+coinVals.coinName+'-head-streak-max').text(coinVals.headStreakMax);
    $('#'+coinVals.coinName+'-tail-streak').text(coinVals.tailStreak);
    $('#'+coinVals.coinName+'-tail-streak-max').text(coinVals.tailStreakMax);
  }

  