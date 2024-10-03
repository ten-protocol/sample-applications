// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title Anon Suggestion Box Contract
/// @notice This contract allows users to anonymously submit encrypted suggestions.
/// @dev The suggestions are stored privately and can only be accessed or managed by the contract owner.
contract AnonSuggestionBox {
    /// @dev Array to store encrypted suggestions privately, managed by the L2 protocol
    bytes[] private suggestions;

    /// @dev The owner of the contract, initially set to the deployer
    address private owner;

    /// @notice Event emitted when a new suggestion is submitted
    /// @param suggestionId The index of the new suggestion in the suggestions array
    event NewSuggestion(uint256 indexed suggestionId);

    /// @notice Constructor that sets the contract deployer as the owner
    constructor() {
        owner = msg.sender;
    }

    /// @notice Submits a new suggestion in encrypted form
    /// @param encryptedSuggestion The encrypted suggestion data submitted by the user
    function submitSuggestion(bytes calldata encryptedSuggestion) external {
        suggestions.push(encryptedSuggestion);
        emit NewSuggestion(suggestions.length - 1);
    }

    /// @notice Returns the total number of suggestions submitted
    /// @return The count of suggestions in the contract
    function getSuggestionCount() external view returns (uint256) {
        return suggestions.length;
    }

    /// @notice Allows the owner to read all submitted suggestions
    /// @dev Only callable by the contract owner
    /// @return An array of all encrypted suggestions
    function readAllSuggestions() external view onlyOwner returns (bytes[] memory) {
        return suggestions;
    }

    /// @notice Clears all suggestions from the contract
    /// @dev Only callable by the contract owner; deletes the entire suggestions array
    function clearSuggestions() external onlyOwner {
        delete suggestions;
    }

    /// @dev Modifier that restricts function access to the contract owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
}
