var SupplyContract = artifacts.require("SupplyContract");
module.exports = function(deployer){
  deployer.deploy(SupplyContract);
};
