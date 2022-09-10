// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import { ISolidStateERC20 } from "@solidstate/contracts/token/ERC20/ISolidStateERC20.sol";

interface IDDAATestToken is ISolidStateERC20 {
  function mint(address account, uint256 amount) external;

  function burnMyBalance() external;
}