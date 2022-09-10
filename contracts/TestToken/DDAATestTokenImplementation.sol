// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import { SolidStateERC20 } from "@solidstate/contracts/token/ERC20/SolidStateERC20.sol";
import { OwnableInternal } from "@solidstate/contracts/access/ownable/OwnableInternal.sol";
import { IDDAATestToken } from "./IDDAATestToken.sol";

contract DDAATestTokenImplementation is 
  IDDAATestToken, 
  SolidStateERC20,
  OwnableInternal
{
  function mint(address account, uint256 amount)
    external
  //onlyOwner
  {
    _mint(account, amount);
  }

  function burnMyBalance()
    external
  //onlyOwner
  {
    _burn(msg.sender, _balanceOf(msg.sender));
  }
}