// SPDX-License-Identifier: None
pragma solidity ^0.8.0;

import { IDDAA } from "../DDAA/IDDAA.sol";
import { ISolidStateERC20 } from "@solidstate/contracts/token/ERC20/ISolidStateERC20.sol";

contract Verifier {
  string internal url;
  ISolidStateERC20 internal Coin;

  constructor(string memory _url, address coinAddress) {
    url = _url;
    Coin = ISolidStateERC20(coinAddress);
  }

  function withdrawTokens() external {
    Coin.transfer(msg.sender, Coin.balanceOf(address(this)));
  }

  function setURL(string memory _url) external { 
    url = _url;
    emit UrlChanged(url);
  }
  
  function getURL() external view returns(string memory) { return url; }

  event UrlChanged(string url);
}