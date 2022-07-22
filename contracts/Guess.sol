//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Guess {
    address payable owner;
    uint8 private target;
    uint16 public guesses;
    uint8 public size;

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function."); 
        _;
    }
    
    constructor(uint8 _size) {
        owner = payable(msg.sender);
        target = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)))%_size);
        size = _size;
    }

    function attempt(uint8 guess) public payable {
        console.log("Accepting guess %d accompanied by %d wei from address %s", guess, msg.value, msg.sender);
        require(msg.value == 10**18, "The guess must be funded by 1 Ether.");
        guesses++;
        if (guess == target) {
            console.log("Guess %d against target %d.", guess, target);
            selfdestruct(payable(msg.sender));
        }
    }

    function close() public payable onlyOwner {
        selfdestruct(payable(owner));
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
