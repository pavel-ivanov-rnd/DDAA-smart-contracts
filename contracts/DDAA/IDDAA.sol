// SPDX-License-Identifier: None
pragma solidity ^0.8.9;

struct Order {
  uint256 balance;
  uint256 pricePerImage;
  address customer;
  uint256 deadline;
  address verifier;
  string url;
}

contract IDDAA {
  event orderSubmitted(uint256 orderId, address verifier);
  event paymentToAnnotator(uint256 orderId, address annotator, uint256 amount);
}