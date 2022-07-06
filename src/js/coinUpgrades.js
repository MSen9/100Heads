

//#region Upgrades
//check to see if you can buy upgrades

const coinUpgradeMap = new Map();
const activeCoinUpgrades = [];

function CheckUpgrades(){
  for(const upgradeName of activeCoinUpgrades){
    upgradeObj = coinUpgradeMap.get(upgradeName);
    if(upgradeObj.chipCost > chips){
      $('#Upgrade' + upgradeObj.id+'Button').prop('disabled', true);
    } else {
      $('#Upgrade' + upgradeObj.id+'Button').prop('disabled', false);
    }
  }
}

function ShowCoinUpgrades(){
  var element = $('#CoinUpgrades');
  element[0].classList.remove("d-none");
  coinUpgradesShown = true;
}

function AddUpgrade(upgradeName){
  let upgradeObj = coinUpgradeMap.get(upgradeName);
  let coinCostString = "";
  if(upgradeObj.chipCost != 0){
    coinCostString = upgradeObj.chipCost + " Chips";
  }
  $('#CoinUpgrades').append(`
  <div class="row" id="Upgrade`+upgradeObj.id + `">
    <div class="col-8">
      <h6>`+upgradeObj.title +`</h6>
      ` + upgradeObj.desc + `
    </div>
    <div class="col-4">
      <button id="Upgrade`+upgradeObj.id + `Button" class ="btn btn-dark" disabled onclick="BuyUpgrade('`+upgradeName + `')">` + coinCostString + `</button>
    </div>
  </div>
   `);
   activeCoinUpgrades.push(upgradeName);
}

function BuyUpgrade(upgradeName){
  let upgrade = coinUpgradeMap.get(upgradeName);
  console.log(upgrade);
  LoseChips(upgrade.chipCost);
  upgrade.func();
  $("#Upgrade"+upgrade.id).remove();
  activeCoinUpgrades.splice(activeCoinUpgrades.indexOf(upgradeName));
}

//#endregion

function MultiplyFlipSpeed(factor){
  flipSpeedMultiplier *= factor;
}
//upgrade list
function InitializeCoinUpgrades(){
  coinUpgradeMap.set("FlipSpeed1",{id: 0, func: FlipSpeed1, chipCost: 1, title: "Improved Technique",desc: "Increase flip speed by 50%"});
}

function FlipSpeed1(){
  MultiplyFlipSpeed(1.5);
}


