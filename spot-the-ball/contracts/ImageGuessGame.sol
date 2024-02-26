// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title Image Guessing Game
/// @notice This contract allows players to guess the location of an item in an image for a chance to win a prize.
contract ImageGuessGame {
  struct Challenge {
    string publicImageURL;
    string privateImageURL;
    uint256[2] topLeft;
    uint256[2] bottomRight;
    uint256[2] centerPoint;
    bool isActive;
    bool isRevealed;
    uint256 prizePool;
    uint256 activationTime;
    uint256 expirationTime; // New field to track when the challenge expires
  }

  struct GuessDetails {
    address guesser;
    uint256 distance;
  }

  Challenge[] private challenges;
  uint256 public currentChallengeIndex;
  uint256 public entryFee;
  address public owner;
  mapping(address => uint256) private guessCount;
  mapping(address => uint256) private winningGuessCount;
  mapping(address => bool) private admins;
  mapping(uint256 => address[]) public challengeWinners;
  mapping(uint256 => GuessDetails[3]) private topGuesses;

  struct ChallengeCreationParams {
    string publicImageURL;
    string privateImageURL;
    uint256[2] topLeft;
    uint256[2] bottomRight;
    uint256[2] centerPoint;
  }

  mapping(uint256 => mapping(address => uint256[2][])) private guessCoordinates;
  mapping(uint256 => mapping(address => uint256[])) private guessTimestamps;

  event ChallengeCreated(uint256 indexed challengeId, string imageURL, uint256 prizePool);
  event GuessSubmitted(uint256 indexed challengeId, address indexed user, uint256[2] guessCoordinates, uint256 timestamp);
  event ChallengeWinner(uint256 indexed challengeId, address indexed winner, uint256 prizeAmount, uint8 position);
  event ImageRevealed(uint256 indexed challengeId, string hiddenImageURL);
  event NoMoreChallengesFound();

  constructor(uint256 _entryFee) {
    owner = msg.sender;
    admins[owner] = true;
    entryFee = _entryFee;
    currentChallengeIndex = 0;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only owner can call this function.');
    _;
  }

  modifier onlyAdmin() {
    require(admins[msg.sender], 'Only admins can call this function');
    _;
  }

  function createChallenge(ChallengeCreationParams memory params) public onlyOwner {
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

  function submitGuess(uint256 _challengeId, uint256[2] memory _guessCoordinates) public payable {
    require(msg.value == entryFee, 'Incorrect entry fee.');
    require(_challengeId == currentChallengeIndex, 'This challenge is not active.');
    Challenge storage challenge = challenges[_challengeId];

    if (block.timestamp > challenge.expirationTime) {
      declareWinnersAndDistributePrizes(_challengeId); 
      challenge.isActive = false;
      challenge.isRevealed = true;
      challenge.prizePool = 0;

      emit ImageRevealed(_challengeId, challenge.privateImageURL);

      if (_challengeId + 1 < challenges.length) {
        currentChallengeIndex += 1;
        Challenge storage nextChallenge = challenges[currentChallengeIndex];
        nextChallenge.isActive = true;
        nextChallenge.activationTime = block.timestamp;
        nextChallenge.expirationTime = block.timestamp + 24 hours;
      } else {
        emit NoMoreChallengesFound();
        return;
      }
    } else {
      guessCoordinates[_challengeId][msg.sender].push(_guessCoordinates);
      guessTimestamps[_challengeId][msg.sender].push(block.timestamp);
      guessCount[msg.sender] += 1;

      uint256 distance = calculateEuclideanDistanceSquared(_guessCoordinates, challenge.centerPoint);
      GuessDetails memory newGuess = GuessDetails(msg.sender, distance);
      updateTopGuesses(_challengeId, newGuess);

    challenge.prizePool += msg.value;

    emit GuessSubmitted(_challengeId, msg.sender, _guessCoordinates, block.timestamp);
  }
}

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

  function calculateEuclideanDistanceSquared(uint256[2] memory point1, uint256[2] memory point2) private pure returns (uint256) {
    uint256 dx = (point1[0] > point2[0]) ? point1[0] - point2[0] : point2[0] - point1[0];
    uint256 dy = (point1[1] > point2[1]) ? point1[1] - point2[1] : point2[1] - point1[1];
    return (dx * dx) + (dy * dy);
  }

  /// @notice Allows a user to view their guess coordinates and the time elapsed since each guess was made for a specific challenge.
  /// @param _challengeId The index of the challenge
  /// @return coordinates An array of guess coordinates made by the user for the specified challenge
  /// @return timesElapsed An array of times elapsed (in seconds) since each guess was made by the user
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
