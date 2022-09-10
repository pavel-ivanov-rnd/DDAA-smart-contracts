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
  } catch (err : any) { 
    if (err.message.includes("Reason: Already Verified")) {
      console.log("Contract is already verified!");
    } 
  }


  const TokenProxy = await ethers.getContractFactory("DDAATestTokenProxy");
  const tokenProxy = await TokenProxy.deploy(tokenImplementation.address, owner.address);
  await tokenProxy.deployed();
  fs.writeFileSync('./scripts/deployment/token_proxys_args.ts',
    `module.exports = ["${tokenImplementation.address}", "${owner.address}"]`,
    { flag: 'w' });
  console.log(`Token proxy deployed to ${tokenProxy.address}`);
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
  } catch (err : any) { 
    if (err.message.includes("Reason: Already Verified")) {
      console.log("Contract is already verified!");
    } 
  }

  const DDAAImplementation = await ethers.getContractFactory("DDAAImplementation");
  const DDAA = await DDAAImplementation.deploy(owner.address, "pook", tokenProxy.address)
  await DDAA.deployed();
  console.log(`DDAA deployed to ${DDAA.address}`);
  fs.writeFileSync('./scripts/deployment/ddaa_args.ts',
    `module.exports = ["${owner.address}", "pook", "${tokenProxy.address}"]`,
    { flag: 'w' });
  try {
    if(hre.network.name != "hardhat") {
      await hre.run("verify:verify", {
        address: DDAA.address,
        constructorArguments: [owner.address, "pook", tokenProxy.address]
      });
    }
  } catch (err : any) { 
    if (err.message.includes("Reason: Already Verified")) {
      console.log("Contract is already verified!");
    } 
  }

  fs.writeFileSync('./scripts/deployment/addresses.txt',
  `Token proxy: ${tokenProxy.address}
Token implementation: ${tokenImplementation.address}
DDAA: ${DDAA.address}`,
  { flag: 'w' });

  fs.writeFileSync('./scripts/deployment/addresses.ts',
  `export const tokenProxy = ${tokenProxy.address}
export const tokenImplementation = ${tokenImplementation.address}
export const DDAA = : ${DDAA.address}`,
  { flag: 'w' });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
