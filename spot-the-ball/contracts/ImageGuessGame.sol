// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ImageGuessGame {
  struct Challenge {
    string publicImageURL;
    string privateImageURL;
    uint256 startTime;
    uint256 endTime;
    uint256[2] topLeft;
    uint256[2] bottomRight;
    bool isActive;
    bool isRevealed;
  }

  struct Guess {
    address user;
    uint256[2] guessCoordinates;
    bool isCorrect;
  }

  Challenge[] public challenges;
  mapping(uint256 => Guess[]) private guesses;
  mapping(uint256 => address) private challengeWinners;
  uint256 public entryFee;
  address public owner;

  event ChallengeCreated(uint256 indexed challengeId, string imageURL);
  event GuessSubmitted(uint256 indexed challengeId, address indexed user, bool isCorrect);
  event ChallengeWinner(uint256 indexed challengeId, address indexed winner);
  event ImageRevealed(uint256 indexed challengeId, string hiddenImageURL);

  constructor(uint256 _entryFee) {
    owner = msg.sender;
    entryFee = _entryFee;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only owner can call this function.');
    _;
  }

  function createChallenge(
    string memory _publicImageURL,
    string memory _privateImageURL,
    uint256[2] memory _topLeft,
    uint256[2] memory _bottomRight
  ) public onlyOwner {
    uint256 challengeId = challenges.length;
    challenges.push(
      Challenge({
        publicImageURL: _publicImageURL,
        privateImageURL: _privateImageURL,
        startTime: block.timestamp,
        endTime: block.timestamp + 24 hours,
        topLeft: _topLeft,
        bottomRight: _bottomRight,
        isActive: true,
        isRevealed: false
      })
    );
    emit ChallengeCreated(challengeId, _publicImageURL);
  }

  function submitGuess(uint256 _challengeId, uint256[2] memory _guessCoordinates) public payable {
    require(msg.value == entryFee, 'Incorrect entry fee.');
    require(_challengeId < challenges.length, 'Challenge does not exist.');
    Challenge storage challenge = challenges[_challengeId];
    require(challenge.isActive, 'Challenge is not active.');

    bool isCorrect = isInside(challenge.topLeft, challenge.bottomRight, _guessCoordinates);
    guesses[_challengeId].push(
      Guess({user: msg.sender, guessCoordinates: _guessCoordinates, isCorrect: isCorrect})
    );

    if (block.timestamp >= challenge.endTime) {
      determineWinner(_challengeId);
    } else {
      emit GuessSubmitted(_challengeId, msg.sender, isCorrect);
    }
  }

  function determineWinner(uint256 _challengeId) private {
    Challenge storage challenge = challenges[_challengeId];
    require(challenge.isActive, 'Challenge is not active or already concluded.');
    challenge.isActive = false;

    address winner;
    for (uint256 i = 0; i < guesses[_challengeId].length; i++) {
      if (guesses[_challengeId][i].isCorrect) {
        winner = guesses[_challengeId][i].user;
        break;
      }
    }

    challengeWinners[_challengeId] = winner;
    if (winner != address(0)) {
      payable(winner).transfer(address(this).balance);
      emit ChallengeWinner(_challengeId, winner);
    }
  }

  function isInside(
    uint256[2] memory topLeft,
    uint256[2] memory bottomRight,
    uint256[2] memory point
  ) private pure returns (bool) {
    return
      point[0] >= topLeft[0] &&
      point[0] <= bottomRight[0] &&
      point[1] >= topLeft[1] &&
      point[1] <= bottomRight[1];
  }

  function revealHiddenImage(uint256 _challengeId) public {
    require(_challengeId < challenges.length, 'Challenge does not exist.');
    Challenge storage challenge = challenges[_challengeId];
    require(block.timestamp > challenge.endTime, 'Challenge has not ended yet.');
    challenge.isRevealed = true;
    emit ImageRevealed(_challengeId, challenge.privateImageURL);
  }

  function getHiddenImageURL(uint256 _challengeId) public view returns (string memory) {
    require(_challengeId < challenges.length, 'Challenge does not exist.');
    Challenge memory challenge = challenges[_challengeId];
    require(challenge.isRevealed, 'Hidden image is not revealed yet.');
    return challenge.privateImageURL;
  }
}
