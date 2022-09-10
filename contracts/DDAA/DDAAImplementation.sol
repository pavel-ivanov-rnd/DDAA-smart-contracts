// SPDX-License-Identifier: None
pragma solidity ^0.8.9;

import { ISolidStateERC20 } from "@solidstate/contracts/token/ERC20/ISolidStateERC20.sol";
import { IDDAA, Order } from "./IDDAA.sol";

contract DDAAImplementation is IDDAA {
  address internal owner;
  uint256 internal orderIndex;
  ISolidStateERC20 internal Coin;
  //orderId => Order
  mapping (uint256 => Order) internal orders;
  //address => url
  mapping (address => string) internal verifiersURL;

  constructor (address verifier, string memory url, address coinAddress) {
    verifiersURL[verifier] = url;
    Coin = ISolidStateERC20(coinAddress);
    owner = msg.sender;
  }

  function submitOrder(
    uint256 amount,
    uint256 pricePerImage,
    address verifier,
    uint256 deadline,
    string memory endpointUrl
  ) external {
    //Transfer funds to the contract
    require(Coin.allowance(msg.sender, address(this)) >= amount, 
      "DDAA: Insufficient amount of funds allocated");
    Coin.transferFrom(msg.sender, address(this), amount);
    //Create an order
    orders[orderIndex] = Order(
      {
        balance: amount,
        pricePerImage: pricePerImage,
        customer: msg.sender,
        deadline: deadline, 
        verifier: verifier,
        url: endpointUrl
      }
    );
    orderIndex++;
    emit orderSubmitted(orderIndex, verifier);
  }

  function payToAnnotator(
    address annotator, 
    uint256 order,
    uint256 amount
  ) external {
    require(orders[order].verifier == msg.sender, 
      "DDAA: This verifier is not assigned to this order");
    require(orders[order].balance >= amount, 
      "DDAA: This order has insuffisient amount of funds left");
    orders[order].balance -= amount;
    Coin.transfer(annotator, amount);
    Coin.transfer(msg.sender, 5 * (amount / 100));
    Coin.transfer(annotator, 5 * (amount / 100));
    emit paymentToAnnotator(order, annotator, amount);
  }
//External getters
  function getOrder(uint256 id) external view returns(Order memory) {
    return orders[id];
  }

  function getVerifierURL(address verifier) external view returns(string memory) {
    return verifiersURL[verifier];
  }

  function getOwner() external view returns(address) {
    return owner;
  }
}