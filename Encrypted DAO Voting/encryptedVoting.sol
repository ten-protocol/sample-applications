// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title Encrypted DAO Voting Contract
/// @notice This contract facilitates a private voting system for a DAO using TEN's L2 protocol for encryption.
/// @dev Voting results are private, with upvotes and downvotes stored securely. Only the admin can end the voting.
contract encryptedVoting {
    /// @notice The address of the admin who deployed the contract
    address public admin;

    /// @notice The timestamp when the voting ends
    uint public votingEndTime;

    /// @dev Private variable to store the count of upvotes, encrypted by TEN's L2 protocol
    uint private upvotes;

    /// @dev Private variable to store the count of downvotes, encrypted by TEN's L2 protocol
    uint private downvotes;

    /// @dev Mapping to track whether an address has voted
    mapping(address => bool) private hasVoted;

    /// @notice Event emitted when a vote is cast
    /// @param voter The address of the voter
    event VoteCast(address indexed voter);

    /// @notice Event emitted when the voting ends
    /// @param upvotes The final count of upvotes
    /// @param downvotes The final count of downvotes
    event VotingEnded(uint upvotes, uint downvotes);

    /// @notice Constructor that sets the admin and voting duration
    /// @param _durationInMinutes The duration of the voting period in minutes
    constructor(uint _durationInMinutes) {
        admin = msg.sender;
        votingEndTime = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    /// @dev Modifier to restrict access to the admin only
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    /// @dev Modifier to ensure that voting is still open
    modifier votingOpen() {
        require(block.timestamp < votingEndTime, "Voting has ended");
        _;
    }

    /// @notice Allows users to cast their vote as either an upvote or a downvote
    /// @dev Users can only vote once and voting must be open
    /// @param isUpvote Boolean indicating whether the vote is an upvote (`true`) or a downvote (`false`)
    function vote(bool isUpvote) external votingOpen {
        require(!hasVoted[msg.sender], "Already voted");

        if (isUpvote) {
            upvotes++;
        } else {
            downvotes++;
        }
        hasVoted[msg.sender] = true;

        emit VoteCast(msg.sender);
    }

    /// @notice Ends the voting process and emits the final vote counts
    /// @dev Only the admin can call this function and only after the voting period has ended
    function endVoting() external onlyAdmin {
        require(block.timestamp >= votingEndTime, "Voting period not yet over");
        emit VotingEnded(upvotes, downvotes);
    }

    /// @notice Checks if a specific user has voted
    /// @param user The address of the user to check
    /// @return A boolean indicating whether the user has voted
    function hasUserVoted(address user) external view returns (bool) {
        return hasVoted[user];
    }

    /// @notice Retrieves the current voting status
    /// @return isOpen Boolean indicating if voting is still open
    /// @return timeRemaining The amount of time remaining for voting in seconds
    function getVotingStatus() external view returns (bool isOpen, uint timeRemaining) {
        isOpen = block.timestamp < votingEndTime;
        timeRemaining = votingEndTime > block.timestamp ? votingEndTime - block.timestamp : 0;
    }
}
