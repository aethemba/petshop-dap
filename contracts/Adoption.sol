pragma solidity ^0.4.17;
// Above is minimum version of Solidity for this contract

contract Adoption {
  address[16] public adopters; // Public variables have automatic getters
 
  function adopt(uint petId) public returns (uint) { // Return value must be specified
    require(petId >=0 && petId <=15);

    adopters[petId] = msg.sender; // The address of the person or smart contract calling this function

    return petId;
  }

  function getAdopters() public view returns (address[16]) { // View functions promise not to modify the state
    return adopters;
  }

}
