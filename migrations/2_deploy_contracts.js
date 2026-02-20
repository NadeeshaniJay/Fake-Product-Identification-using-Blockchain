const Central = artifacts.require("Central");
const Migrations = artifacts.require("Migrations");
const fs = require('fs');
const path = require('path');

const updateArtifactNetworks = (artifactPath, address, networkIds) => {
  if (!fs.existsSync(artifactPath)) {
    return;
  }

  const artifactData = fs.readFileSync(artifactPath, 'utf8');
  const artifact = JSON.parse(artifactData);
  artifact.networks = artifact.networks || {};

  networkIds.forEach((id) => {
    artifact.networks[id] = { address };
  });

  fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2), 'utf8');
};

module.exports = async function (deployer, network) {
  await deployer.deploy(Central);
  const central = await Central.deployed();
  const migrationsContract = await Migrations.deployed();
  
  // Update config.json with the deployed contract address
  const configPath = path.join(__dirname, '../src/config.json');
  let config = {};
  
  // Read existing config if it exists
  if (fs.existsSync(configPath)) {
    const configData = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(configData);
  }
  
  // Get network ID
  const networkId = await web3.eth.net.getId();
  const networkIds = [String(networkId), '1337', '5777'];
  
  const networksToUpdate = new Set(networkIds);

  networksToUpdate.forEach((id) => {
    if (!config[id]) {
      config[id] = {};
    }

    config[id].central = {
      address: central.address
    };
  });
  
  // Write updated config back to file
  fs.writeFileSync(
    configPath,
    JSON.stringify(config, null, 2),
    'utf8'
  );

  const abisPath = path.join(__dirname, '../src/abis');
  updateArtifactNetworks(path.join(abisPath, 'Central.json'), central.address, networkIds);
  updateArtifactNetworks(path.join(abisPath, 'Migrations.json'), migrationsContract.address, networkIds);
  
  console.log('\n✅ Config updated successfully!');
  console.log(`Network ID: ${networkId}`);
  console.log(`Central Contract: ${central.address}`);
  console.log(`Migrations Contract: ${migrationsContract.address}`);
  console.log(`Config file: ${configPath}\n`);
};
