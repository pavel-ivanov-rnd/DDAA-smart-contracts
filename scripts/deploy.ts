import hre, { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  let [owner] = await ethers.getSigners();

  if (!fs.existsSync("./scripts/deployment/")) {
    fs.mkdirSync("./scripts/deployment/");
  }

  const TokenImplementation = await ethers.getContractFactory("DDAATestTokenImplementation");
  const tokenImplementation = await TokenImplementation.deploy();
  await tokenImplementation.deployed();
  try {
    if(hre.network.name != "hardhat") {
      await hre.run("verify:verify", { address: tokenImplementation.address });
    }
  } catch (err) { console.error(err) }


  const TokenProxy = await ethers.getContractFactory("DDAATestTokenProxy");
  const tokenProxy = await TokenProxy.deploy(tokenImplementation.address, owner.address);
  await tokenProxy.deployed();
  console.log(`Test token deployed to ${tokenProxy.address}`);
  try {
    if(hre.network.name != "hardhat") {
      await hre.run("verify:verify", {
        address: tokenProxy.address,
        constructorArguments: [
          tokenImplementation.address,
          owner.address
        ]
      });
    }
  } catch (err) { console.error(err) }

  const DDAAImplementation = await ethers.getContractFactory("DDAAImplementation");
  const DDAA = await DDAAImplementation.deploy(owner.address, "pook", tokenProxy.address)
  console.log(`DDAA deployed to ${DDAA.address}`);
  try {
    if(hre.network.name != "hardhat") {
      await hre.run("verify:verify", {
        address: DDAA.address,
        constructorArguments: [owner.address, "pook", tokenProxy.address]
      });
    }
  } catch (err) { console.error(err) }

  fs.writeFileSync('./scripts/deployment/addresses.txt',
  `Token: ${tokenProxy.address}
DDAA: ${DDAA.address}`,
  { flag: 'w' });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
