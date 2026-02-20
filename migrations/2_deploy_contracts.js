const Central = artifacts.require("Central");

module.exports = function (deployer) {
  deployer.deploy(Central);
};
