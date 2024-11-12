// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title Sealed Bid Auction Contract
/// @notice This contract allows for a sealed bid auction where the highest bidder wins.
/// @dev Implements a sealed bid auction with the auctioneer as the only authority to end the auction.
contract SealedBidAuction {
    /// @notice The address of the auctioneer who deploys the contract
    address public auctioneer;
    
    /// @notice The timestamp when the auction ends
    uint public auctionEndTime;
    
    /// @notice The address of the current highest bidder
    address private highestBidder;
    
    /// @notice The highest bid amount
    uint private highestBid;
    
    /// @notice Boolean indicating whether the auction has ended
    bool public auctionEnded;

    /// @dev Private mapping of bidders to their bid amounts
    mapping(address => uint) private bids;
    
    /// @dev Private mapping of pending returns for each address
    mapping(address => uint) private pendingReturns;

    /// @notice Event emitted when the auction ends
    event AuctionEnded();

    /// @dev Event emitted when a bid is placed
    /// @param bidder The address of the bidder
    event BidPlaced(address indexed bidder);

    /// @dev Event emitted when the winner is determined
    /// @param winner The address of the highest bidder
    /// @param winningBid The winning bid amount
    event WinnerDetermined(address indexed winner, uint winningBid);

    /// @dev Event emitted when a bidder withdraws their pending returns
    /// @param bidder The address of the bidder
    /// @param amount The amount withdrawn
    event WithdrawalMade(address indexed bidder, uint amount);

    /// @dev Modifier that restricts function access to the auctioneer only
    modifier onlyAuctioneer() {
        require(msg.sender == auctioneer, "Only auctioneer can call this function");
        _;
    }

    /// @dev Modifier that allows function execution only before the auction ends
    modifier onlyBeforeEnd() {
        require(block.timestamp < auctionEndTime, "Auction already ended");
        _;
    }

    /// @dev Modifier that allows function execution only after the auction ends
    modifier onlyAfterEnd() {
        require(block.timestamp >= auctionEndTime, "Auction not yet ended");
        _;
    }

    /// @notice Constructor to initialize the auction duration
    /// @param _auctionDuration Duration in seconds for which the auction will be active
    constructor(uint _auctionDuration) {
        auctioneer = msg.sender;
        auctionEndTime = block.timestamp + _auctionDuration;
    }

    /// @notice Allows a user to place a bid in the auction
    /// @dev Bids are cumulative; a new bid adds to the previous bid amount by the same bidder
    function placeBid() public payable onlyBeforeEnd {
        require(msg.value > 0, "Bid amount must be greater than 0");
        
        uint currentBid = bids[msg.sender] + msg.value;
        bids[msg.sender] = currentBid;

        if (currentBid > highestBid) {
            if (highestBidder != address(0)) {
                pendingReturns[highestBidder] += highestBid;
            }
            highestBidder = msg.sender;
            highestBid = currentBid;
        }

        emit BidPlaced(msg.sender);
    }

    /// @notice Allows a bidder to withdraw their pending returns
    function withdraw() public {
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;
            payable(msg.sender).transfer(amount);
            emit WithdrawalMade(msg.sender, amount);
        }
    }

    /// @notice Ends the auction and transfers the highest bid to the auctioneer
    /// @dev Only the auctioneer can end the auction and only after the auction end time has passed
    function endAuction() public onlyAuctioneer onlyAfterEnd {
        require(!auctionEnded, "Auction already ended");
        auctionEnded = true;
        emit AuctionEnded();
        emit WinnerDetermined(highestBidder, highestBid);
        payable(auctioneer).transfer(highestBid);
    }

    /// @notice Returns the caller's bid amount
    /// @return The bid amount placed by the caller
    function getMyBid() public view returns (uint) {
        return bids[msg.sender];
    }

    /// @notice Allows the auctioneer to check the auction status
    /// @dev Can only be called by the auctioneer after the auction has ended
    /// @return highestBidder The address of the highest bidder
    /// @return highestBid The highest bid amount
    function checkAuctionStatus() public view onlyAuctioneer returns (address, uint) {
        require(auctionEnded, "Auction not yet ended");
        return (highestBidder, highestBid);
    }
}
