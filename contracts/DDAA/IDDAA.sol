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

interface IDDAA {
  function submitOrder(
    uint256 amount,
    uint256 pricePerImage,
    address verifier,
    uint256 deadline,
    string memory endpointUrl
  ) external;

  function payToAnnotator(
    address annotator, 
    uint256 order,
    uint256 amount
  ) external;

//External getters
  function getOrder(uint256 id) external view returns(Order memory);

  function getOwner() external view returns(address);

  event orderSubmitted(uint256 orderId, address verifier);
  event paymentToAnnotator(uint256 orderId, address annotator, uint256 amount);
}