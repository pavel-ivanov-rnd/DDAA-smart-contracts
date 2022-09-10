import hre, { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  let [owner] = await ethers.getSigners();

  if (!fs.existsSync("./scripts/deployment/")) {
    fs.mkdirSync("./scripts/deployment/");
  }

  const DDAATestToken = await ethers.getContractFactory("DDAATestToken");
  const ddaaTestToken = await DDAATestToken.deploy();
  await ddaaTestToken.deployed();
  try {
    if(hre.network.name != "hardhat") {
      await hre.run("verify:verify", { address: ddaaTestToken.address });
    }
  } catch (err : any) { 
    if (err.message.includes("Reason: Already Verified")) {
      console.log("Contract is already verified!");
    } 
  }

  const DDAAImplementation = await ethers.getContractFactory("DDAAImplementation");
  const DDAA = await DDAAImplementation.deploy(owner.address, "pook", ddaaTestToken.address)
  await DDAA.deployed();
  console.log(`DDAA deployed to ${DDAA.address}`);
  fs.writeFileSync('./scripts/deployment/ddaa_args.ts',
    `module.exports = ["${owner.address}", "pook", "${ddaaTestToken.address}"]`,
    { flag: 'w' });
  try {
    if(hre.network.name != "hardhat") {
      await hre.run("verify:verify", {
        address: DDAA.address,
        constructorArguments: [owner.address, "pook", ddaaTestToken.address]
      });
    }
  } catch (err : any) { 
    if (err.message.includes("Reason: Already Verified")) {
      console.log("Contract is already verified!");
    } 
  }

  fs.writeFileSync('./scripts/deployment/addresses.txt',
  `Test Token: ${ddaaTestToken.address}
DDAA: ${DDAA.address}`,
  { flag: 'w' });

  fs.writeFileSync('./scripts/deployment/addresses.ts',
  `export const testToken = ${ddaaTestToken.address}
export const DDAA = : ${DDAA.address}`,
  { flag: 'w' });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
