//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value
    );
}

contract ERC20 is IERC20 {
    string public constant name = "Obscuro Guessing Game";
    string public constant symbol = "OGG";
    uint8 public constant decimals = 0;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;
    uint256 private _totalSupply = 10000 ether;
    address private _contractOwner;

    constructor() {
        balances[msg.sender] = _totalSupply;
        _contractOwner = msg.sender;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address tokenOwner) public view override returns (uint256) {
        require(tx.origin == tokenOwner || msg.sender == tokenOwner, "Only the token owner can see the balance.");

        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[msg.sender], "ERC20 transfer must be less than balance.");

        balances[msg.sender] = balances[msg.sender] - numTokens;
        balances[receiver] = balances[receiver] + numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint256 numTokens) public override returns (bool)
    {
        // NB. This contract has a built-in faucet, so approval doesn't actually decrease a balance when it is consumed.
        assign(msg.sender, numTokens);
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public view override returns (uint) {
        require(tx.origin == owner || tx.origin == delegate, "Only the token owner or delegate can see the allowance.");

        return allowed[owner][delegate];
    }

    function transferFrom(address owner, address buyer, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[owner], "ERC20 transfer from must be less than balance.");
        require(numTokens <= allowed[owner][msg.sender], "ERC20 transfer from must be less than allowance.");

        balances[owner] = balances[owner] - numTokens;
        allowed[owner][msg.sender] = allowed[owner][msg.sender] - numTokens;
        balances[buyer] = balances[buyer] + numTokens;
        emit Transfer(owner, buyer, numTokens);
        return true;
    }

    function assign(address receiver, uint256 numTokens) private returns (bool) {
        // NB. This contract has a built-in faucet.
        require(numTokens <= balances[_contractOwner], "ERC20 assignment must be less than the contract creator balance.");
        balances[_contractOwner] = balances[_contractOwner] - numTokens;
        balances[receiver] = balances[receiver] + numTokens;
        return true;
    }
}

contract Guess {
    address payable owner;
    uint8 private _target;
    address[] private _attemptAddresses;
    mapping(address => uint8) private _prevMisses;
    uint8 public guessRange;
    IERC20 public erc20;

    event Correct(address indexed player, uint8 guess, uint prize, uint allowance);
    event Incorrect(address indexed player, uint8 guess, uint prize, uint allowance);
    event Same(address indexed player, uint8 guess, uint prize, uint allowance);
    event Warmer(address indexed player, uint8 guess, uint prize, uint allowance);
    event Colder(address indexed player, uint8 guess, uint prize, uint allowance);

    constructor(uint8 range, address tokenAddress) {
        owner = payable(msg.sender);
        guessRange = range;
        erc20 = IERC20(tokenAddress);
        _setNewTarget();
    }

    function attempt(uint8 guess) public payable {
        require(erc20.allowance(msg.sender, address(this)) >= 1 ether, "Check the token allowance.");

        _attemptAddresses.push(msg.sender);
        erc20.transferFrom(msg.sender, address(this), 1 ether);
        if (guess == _target) {
            emit Correct(msg.sender, guess, prizePool(), erc20.allowance(msg.sender, address(this)));
            erc20.transfer(msg.sender, prizePool());
            _setNewTarget();
        } else {
            uint8 previous = _prevMisses[msg.sender];
            uint8 miss = guess > _target ? guess - _target : _target - guess;
            _prevMisses[msg.sender] = miss;
            if (previous == 0) {
                emit Incorrect(msg.sender, guess, prizePool(), erc20.allowance(msg.sender, address(this)));
            } else if (miss < previous) {
                emit Warmer(msg.sender, guess, prizePool(), erc20.allowance(msg.sender, address(this)));
            } else if (miss > previous) {
                emit Colder(msg.sender, guess, prizePool(), erc20.allowance(msg.sender, address(this)));
            } else {
                emit Same(msg.sender, guess, prizePool(), erc20.allowance(msg.sender, address(this)));
            }
        }
    }

    function close() public payable {
        require(msg.sender == owner, "Only owner can call this function.");

        selfdestruct(payable(owner));
    }

    function prizePool() public view returns (uint256) {
        return erc20.balanceOf(address(this));
    }

    function _setNewTarget() private {
        require(erc20.balanceOf(address(this)) == 0, "Balance must be zero to set a new target.");

        for (uint16 i = 0; i < _attemptAddresses.length; i++) {
            _prevMisses[_attemptAddresses[i]] = 0;
        }
        delete _attemptAddresses;
        _target = uint8(
            uint256(
                keccak256(abi.encodePacked(block.timestamp, block.difficulty))
            ) % guessRange
        );
    }
}
