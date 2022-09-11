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
  console.log(`Test Token deployed to ${ddaaTestToken.address}`);
  try {
    if(hre.network.name != "hardhat") {
      await hre.run("verify:verify", { address: ddaaTestToken.address });
    }
  } catch (err : any) { 
    if (err.message.includes("Reason: Already Verified")) {
      console.log("Contract is already verified!");
    } else console.log(err);
  }

  const DDAAImplementation = await ethers.getContractFactory("DDAAImplementation");
  const DDAA = await DDAAImplementation.deploy(ddaaTestToken.address)
  await DDAA.deployed();
  console.log(`DDAA deployed to ${DDAA.address}`);
  try {
    if(hre.network.name != "hardhat") {
      await hre.run("verify:verify", {
        address: DDAA.address,
        constructorArguments: [ddaaTestToken.address]
      });
    }
  } catch (err : any) { 
    if (err.message.includes("Reason: Already Verified")) {
      console.log("Contract is already verified!");
    } else console.log(err);
  }

  const Verifier = await ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy("pook", ddaaTestToken.address, DDAA.address);
  await verifier.deployed();
  console.log(`Verifier deployed to ${verifier.address}`);
  try {
    if(hre.network.name != "hardhat") {
      await hre.run("verify:verify", {
        address: verifier.address,
        constructorArguments: ["pook", ddaaTestToken.address, DDAA.address]
      });
    }
  } catch (err : any) { 
    if (err.message.includes("Reason: Already Verified")) {
      console.log("Contract is already verified!");
    } else console.log(err);
  }

  fs.writeFileSync('./scripts/deployment/addresses.txt',
  `Test Token: ${ddaaTestToken.address}
Verifier: ${verifier.address}
DDAA: ${DDAA.address}`,
  { flag: 'w' });

  fs.writeFileSync('./scripts/deployment/addresses.ts',
  `export const testToken = ${ddaaTestToken.address}
export const verifier = ${verifier.address}
export const DDAA = ${DDAA.address}`,
  { flag: 'w' });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
