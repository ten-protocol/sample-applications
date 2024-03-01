// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title Image Guessing Game
/// @notice This contract allows players to guess the location of an item in an image for a chance to win a prize.
contract ImageGuessGame {
    /// @dev Structure to hold challenge details.
    struct Challenge {
        string publicImageURL; // URL of the image visible to all players.
        string privateImageURL; // URL of the solution image revealed after the challenge ends.
        uint256[2] topLeft; // Top left coordinates of the item in the image.
        uint256[2] bottomRight; // Bottom right coordinates of the item in the image.
        uint256[2] centerPoint; // Center point coordinates of the item in the image.
        bool isActive; // Flag indicating if the challenge is active.
        bool isRevealed; // Flag indicating if the challenge solution is revealed.
        uint256 prizePool; // Total prize pool accumulated for the challenge.
        uint256 activationTime; // Timestamp when the challenge becomes active.
        uint256 expirationTime; // Timestamp when the challenge expires.
    }

    /// @dev Structure to hold details of a guess.
    struct GuessDetails {
        address guesser; // Address of the guesser.
        uint256 distance; // Calculated distance of the guess from the actual item location.
    }

    // State variables
    Challenge[] private challenges;
    uint256 public currentChallengeIndex;
    uint256 public entryFee;
    address public owner;
    mapping(address => uint256) private guessCount;
    mapping(address => uint256) private winningGuessCount;
    mapping(address => bool) private admins;
    mapping(uint256 => address[]) public challengeWinners;
    mapping(uint256 => GuessDetails[3]) private topGuesses;

    /// @dev Structure to hold parameters for challenge creation.
    struct ChallengeCreationParams {
        string publicImageURL;
        string privateImageURL;
        uint256[2] topLeft;
        uint256[2] bottomRight;
        uint256[2] centerPoint;
    }

    mapping(uint256 => mapping(address => uint256[2][])) private guessCoordinates;
    mapping(uint256 => mapping(address => uint256[])) private guessTimestamps;

    // Events
    event ChallengeCreated(uint256 indexed challengeId, string imageURL, uint256 prizePool);
    event GuessSubmitted(uint256 indexed challengeId, address indexed user, uint256[2] guessCoordinates, uint256 timestamp, uint256 timeLeft);
    event ChallengeWinner(uint256 indexed challengeId, address indexed winner, uint256 prizeAmount, uint8 position);
    event ImageRevealed(uint256 indexed challengeId, string privateImageURL);
    event NoMoreChallengesFound();

    /// @notice Contract constructor to initialize state.
    /// @param _entryFee The fee required to submit a guess.
    constructor(uint256 _entryFee) {
        owner = msg.sender;
        admins[owner] = true;
        entryFee = _entryFee;
        currentChallengeIndex = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can call this function");
        _;
    }

    /// @notice Creates a new challenge.
    /// @dev Only callable by an admin.
    /// @param params The parameters for the new challenge.
    function createChallenge(ChallengeCreationParams memory params) public onlyAdmin {
        challenges.push(
            Challenge({
                publicImageURL: params.publicImageURL,
                privateImageURL: params.privateImageURL,
                topLeft: params.topLeft,
                bottomRight: params.bottomRight,
                centerPoint: params.centerPoint,
                isActive: false,
                isRevealed: false,
                prizePool: 0,
                activationTime: 0,
                expirationTime: 0
            })
        );

        if (challenges.length == 1 || !challenges[currentChallengeIndex].isActive) {
            uint256 newChallengeIndex = challenges.length - 1;
            challenges[newChallengeIndex].isActive = true;
            challenges[newChallengeIndex].activationTime = block.timestamp;
            challenges[newChallengeIndex].expirationTime = block.timestamp + 24 hours;
            currentChallengeIndex = newChallengeIndex;
        }

        emit ChallengeCreated(challenges.length - 1, params.publicImageURL, 0);
    }

  /// @notice Returns public information about a challenge.
  /// @param challengeId The index of the challenge
  /// @return publicImageURL URL of the publicly visible image
  /// @return isActive Whether the challenge is currently active
  /// @return isRevealed Whether the hidden image has been revealed
  /// @return prizePool The current prize pool for the challenge
  /// @return timeLeft The time left in seconds until the challenge expires, or 0 if expired or not active
  function getChallengePublicInfo(
    uint256 challengeId
  ) public view returns (string memory, bool, bool, uint256, uint256) {
    Challenge storage challenge = challenges[challengeId];
    uint256 timeLeft = 0;
    if (challenge.isActive && block.timestamp < challenge.expirationTime) {
      timeLeft = challenge.expirationTime - block.timestamp;
    }
    return (
      challenge.publicImageURL,
      challenge.isActive,
      challenge.isRevealed,
      challenge.prizePool,
      timeLeft
    );
  }

    /// @notice Allows a player to submit a guess for the current challenge.
    /// @dev Players must pay the entry fee to submit their guess.
    /// @param _challengeId The ID of the challenge to guess for.
    /// @param _guessCoordinates The coordinates of the player's guess.
    function submitGuess(uint256 _challengeId, uint256[2] memory _guessCoordinates) public payable {
        require(msg.value == entryFee, "Incorrect entry fee.");
        require(_challengeId == currentChallengeIndex, "This challenge is not active.");
        Challenge storage challenge = challenges[_challengeId];
        require(challenge.isActive, "Challenge is not active.");
        
        guessCoordinates[_challengeId][msg.sender].push(_guessCoordinates);
        guessTimestamps[_challengeId][msg.sender].push(block.timestamp);
        guessCount[msg.sender] += 1;

        uint256 distance = calculateEuclideanDistanceSquared(_guessCoordinates, challenge.centerPoint);
        GuessDetails memory newGuess = GuessDetails(msg.sender, distance);
        updateTopGuesses(_challengeId, newGuess);

        challenge.prizePool += msg.value;

        if (block.timestamp > challenge.expirationTime) {
            declareWinnersAndDistributePrizes(_challengeId);
            challenge.isActive = false;
            challenge.isRevealed = true;

            emit ImageRevealed(_challengeId, challenge.privateImageURL);

            if (_challengeId + 1 < challenges.length) {
                currentChallengeIndex += 1;
                Challenge storage nextChallenge = challenges[currentChallengeIndex];
                nextChallenge.isActive = true;
                nextChallenge.activationTime = block.timestamp;
                nextChallenge.expirationTime = block.timestamp + 24 hours;
            } else {
                emit NoMoreChallengesFound();
            }
        } else {
            uint256 timeLeft = challenge.expirationTime - block.timestamp;
            emit GuessSubmitted(_challengeId, msg.sender, _guessCoordinates, block.timestamp, timeLeft);
        }
    }

    /// @dev Declares winners and distributes prizes for a challenge.
    /// @param _challengeId The ID of the challenge to distribute prizes for.
    function declareWinnersAndDistributePrizes(uint256 _challengeId) private {
        uint256 totalPrizePool = challenges[_challengeId].prizePool;
        uint256[3] memory prizeDistribution = [totalPrizePool * 60 / 100, totalPrizePool * 30 / 100, totalPrizePool * 10 / 100];

        for (uint8 i = 0; i < topGuesses[_challengeId].length; i++) {
            if (topGuesses[_challengeId][i].guesser != address(0)) {
                payable(topGuesses[_challengeId][i].guesser).transfer(prizeDistribution[i]);
                emit ChallengeWinner(_challengeId, topGuesses[_challengeId][i].guesser, prizeDistribution[i], i + 1);
            }
        }

        // Reset the prize pool after distribution
        challenges[_challengeId].prizePool = 0;
    }

  /// @dev Updates the top guesses for a challenge.
  /// @param _challengeId The ID of the challenge to update top guesses for.
  /// @param newGuess The new guess to consider for top guesses.
  function updateTopGuesses(uint256 _challengeId, GuessDetails memory newGuess) private {
      GuessDetails[3] storage currentTopGuesses = topGuesses[_challengeId];
      bool shouldInsertNewGuess = true;

      for (uint256 i = 0; i < currentTopGuesses.length; i++) {
          if (currentTopGuesses[i].guesser == newGuess.guesser) {
              if (newGuess.distance < currentTopGuesses[i].distance) {
                  currentTopGuesses[i] = newGuess;
              }
              shouldInsertNewGuess = false;
              break;
          }
      }

      if (shouldInsertNewGuess) {
          for (uint256 i = 0; i < currentTopGuesses.length; i++) {
              if (currentTopGuesses[i].guesser == address(0) || newGuess.distance < currentTopGuesses[i].distance) {
                  for (uint256 j = currentTopGuesses.length - 1; j > i; j--) {
                      currentTopGuesses[j] = currentTopGuesses[j - 1];
                  }
                  currentTopGuesses[i] = newGuess;
                  break;
              }
          }
      }
  }

  /// @dev Calculates the squared Euclidean distance between two points.
  /// @param point1 The first point.
  /// @param point2 The second point.
  /// @return The squared distance between point1 and point2.
  function calculateEuclideanDistanceSquared(uint256[2] memory point1, uint256[2] memory point2) private pure returns (uint256) {
    uint256 dx = (point1[0] > point2[0]) ? point1[0] - point2[0] : point2[0] - point1[0];
    uint256 dy = (point1[1] > point2[1]) ? point1[1] - point2[1] : point2[1] - point1[1];
    return (dx * dx) + (dy * dy);
  }

    /// @notice Allows a user to view their guesses for a specific challenge.
    /// @param _challengeId The ID of the challenge to view guesses for.
    /// @return coordinates The coordinates of the user's guesses.
    /// @return timesElapsed The time elapsed since each guess was made.
  function viewMyGuesses(
    uint256 _challengeId
  ) public view returns (uint256[2][] memory coordinates, uint256[] memory timesElapsed) {
    require(_challengeId < challenges.length, 'Challenge does not exist.');

    uint256[] storage guessTimes = guessTimestamps[_challengeId][msg.sender];
    uint256[] memory elapsedTimes = new uint256[](guessTimes.length);

    for (uint256 i = 0; i < guessTimes.length; i++) {
      uint256 timeElapsed = block.timestamp - guessTimes[i];
      elapsedTimes[i] = timeElapsed;
    }

    return (guessCoordinates[_challengeId][msg.sender], elapsedTimes);
  }

    /// @notice Retrieves the top guesses and private image URL for a revealed challenge.
    /// @param challengeId The ID of the challenge.
    /// @return topGuessesArray The top 3 guesses for the challenge.
    /// @return privateImageUrl The private image URL of the challenge.
  function getRevealedChallengeDetails(uint256 challengeId) public view returns (GuessDetails[3] memory topGuessesArray, string memory privateImageUrl) {
      require(challengeId < challenges.length, "Challenge does not exist.");
      Challenge storage challenge = challenges[challengeId];
      require(challenge.isRevealed, "Challenge has not started or has not ended yet");

      return (topGuesses[challengeId], challenge.privateImageURL);
  }

  /// @notice Adds an admin to the game.
  /// @param _admin The address to be added as an admin.
  function addAdmin(address _admin) external onlyOwner {
    admins[_admin] = true;
  }

  /// @notice Removes an admin from the game.
  /// @param _admin The address to be removed from the admin list.
  function removeAdmin(address _admin) external onlyOwner {
    admins[_admin] = false;
  }

  /// @notice Retrieves the number of guesses made by a specific player.
  /// @param _player The address of the player.
  /// @return The count of guesses made by the player.
  function getGuessCount(address _player) external view onlyAdmin returns (uint256, uint256) {
    return (guessCount[_player], winningGuessCount[_player]);
  }
}
