var FundraiserFactoryContract = artifacts.require("./FundraiserFactoryContract.sol");

module.exports = function(deployer) {
  deployer.deploy(FundraiserFactoryContract);
};
