pragma solidity ^0.4.17;

import 'truffle/Assert.sol'; // Truffle library with assertion helpers
import 'truffle/DeployedAddresses.sol'; // This gets the address of the smart contract in test mode
import '../contracts/Adoption.sol';


contract TestAdoption {
  Adoption adoption = Adoption(DeployedAddresses.Adoption());

  function testUserCanAdoptPet() public {
    uint returnedId = adoption.adopt(8);

    uint expected = 8;

    Assert.equal(returnedId, expected, 'Adoption of pet 8 should be recorded');
  }

  function testGetAdopterAddressByPetId() public {
    // Expected owner of this contract
    address expected = this;

    // We adopted with the current (this) contract in the previous function
    // therefore this address should be the adopter
    address adopter = adoption.adopters(8);

    Assert.equal(adopter, expected, 'Owner of pet 8 should be recorded');

  }

  function testGetAdopterAddressByPetIdInArray() public {

    address expected = this;

    // Temporarily store the value in memory
    address[16] memory adopters = adoption.getAdopters();

    Assert.equal(adopters[8], expected, 'Owner of pet 8 should be recorded');
  }
}