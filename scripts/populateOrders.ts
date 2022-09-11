import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { 
  DDAA as DDAA_address,
  verifier as verifier_address,
  testToken as token_address
} from "./deployment/addresses";

async function main() {
  let [owner] = await ethers.getSigners();
  const DDAA = await ethers.getContractAt("IDDAA", DDAA_address);
  const Token = await ethers.getContractAt("ISolidStateERC20", token_address);
//const decimalShift = BigNumber.from("1000000000000000000");
  const oneHour = 60*60*1000;
  let tx;
  let currentTime = new Date();
  
  let args = {
    amount: BigNumber.from(1000),
    pricePerImage: BigNumber.from(100),
    verifier: verifier_address,
    deadline: currentTime.getTime() + 10 * oneHour, //current time + 10 hours
    endpointUrl: "pook",
  }

  for(let i = 1; i < 10; i++) {
    args.amount = args.amount.add(BigNumber.from(1000 * i));
    args.pricePerImage = args.pricePerImage.add(BigNumber.from(1 * i));
    args.deadline += oneHour * i;
    args.endpointUrl += `${i}`;
    await (await Token.approve(DDAA.address, args.amount)).wait();
    await (await DDAA.submitOrder(
      args.amount,
      args.pricePerImage,
      args.verifier,
      args.deadline,
      args.endpointUrl,
      { gasLimit: 1000000 }
    )).wait();
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});