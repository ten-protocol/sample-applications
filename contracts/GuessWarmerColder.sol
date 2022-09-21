//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


contract ERC20Basic is IERC20 {
    string public constant name = "Tether USD";
    string public constant symbol = "USDT";
    uint8 public constant decimals = 0;
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    uint256 totalSupply_ = 1000000;

    constructor() {
        balances[msg.sender] = totalSupply_;
    }

    function totalSupply() public override view returns (uint256) {
        return totalSupply_;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender]-numTokens;
        balances[receiver] = balances[receiver]+numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint256 numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public override view returns (uint) {
        return allowed[owner][delegate];
    }

    function transferFrom(address owner, address buyer, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);

        balances[owner] = balances[owner]-numTokens;
        allowed[owner][msg.sender] = allowed[owner][msg.sender]-numTokens;
        balances[buyer] = balances[buyer]+numTokens;
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
}


contract Guess {
    address payable owner;
    uint8 private target;
    uint16 public guesses;
    mapping(address => uint8) private prevGuess;
    uint8 public size;
    IERC20 public erc20;
    address public tokenAddress;

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function."); 
        _;
    }
    
    constructor(uint8 _size, address _tokenAddress) {
        owner = payable(msg.sender);
        size = _size;
        erc20 = IERC20(_tokenAddress);
        setNewTarget();
    }

    event Warmer(uint8 guess);
    event Colder(uint8 guess);
    event Correct(uint8 guess);


    function attempt(uint8 guess) public payable {
        require(erc20.allowance(msg.sender, address(this)) >= 1, "Check the token allowance.");
        erc20.transferFrom(msg.sender, address(this), 1);
        guesses++;
        if (guess == target) {
            erc20.transfer(msg.sender, erc20.balanceOf(address(this)));
            emit Correct(guess);
            prevGuess[msg.sender] = 0;
            setNewTarget();
        }
        else {
            calculateGuess(msg.sender, guess);
        }
    }

    function calculateGuess(address player, uint8 guess) private {
        if (guess > target && prevGuess[player] > target && guess - target <= prevGuess[player] - target) {
            emit Warmer(guess);
            prevGuess[player] = guess;
        }
        else if (guess > target && prevGuess[player] < target && guess - target <= target - prevGuess[player]) {
            emit Warmer(guess);
            prevGuess[player] = guess;
        }
        else if (guess < target && prevGuess[player] < target && target - guess <= target - prevGuess[player]) {
            emit Warmer(guess);
            prevGuess[player] = guess;
        }
        else if (guess < target && prevGuess[player] > target && target - guess <= prevGuess[player] - target) {
            emit Warmer(guess);
            prevGuess[player] = guess;
        }
        else {
            emit Colder(guess);
            prevGuess[player] = guess;
        }
    }

    function close() public payable onlyOwner {
        selfdestruct(payable(owner));
    }

    function getBalance() public view returns (uint256) {
        return erc20.balanceOf(address(this));
    }

    function setNewTarget() private {
        require (erc20.balanceOf(address(this)) == 0, "Balance must be zero to set a new target.");
        target = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)))%size);
    }
}
