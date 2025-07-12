// SPDX-License-Identifier: MIT
// File: @openzeppelin/contracts/token/ERC20/IERC20.sol


// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC-20 standard as defined in the ERC.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

// File: @openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol


// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/extensions/IERC20Metadata.sol)

pragma solidity ^0.8.20;


/**
 * @dev Interface for the optional metadata functions from the ERC-20 standard.
 */
interface IERC20Metadata is IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}

// File: @openzeppelin/contracts/utils/Context.sol


// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}

// File: @openzeppelin/contracts/interfaces/draft-IERC6093.sol


// OpenZeppelin Contracts (last updated v5.1.0) (interfaces/draft-IERC6093.sol)
pragma solidity ^0.8.20;

/**
 * @dev Standard ERC-20 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-20 tokens.
 */
interface IERC20Errors {
    /**
     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     */
    error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC20InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC20InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `spender`’s `allowance`. Used in transfers.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     * @param allowance Amount of tokens a `spender` is allowed to operate with.
     * @param needed Minimum amount required to perform a transfer.
     */
    error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC20InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `spender` to be approved. Used in approvals.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC20InvalidSpender(address spender);
}

/**
 * @dev Standard ERC-721 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-721 tokens.
 */
interface IERC721Errors {
    /**
     * @dev Indicates that an address can't be an owner. For example, `address(0)` is a forbidden owner in ERC-20.
     * Used in balance queries.
     * @param owner Address of the current owner of a token.
     */
    error ERC721InvalidOwner(address owner);

    /**
     * @dev Indicates a `tokenId` whose `owner` is the zero address.
     * @param tokenId Identifier number of a token.
     */
    error ERC721NonexistentToken(uint256 tokenId);

    /**
     * @dev Indicates an error related to the ownership over a particular token. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param tokenId Identifier number of a token.
     * @param owner Address of the current owner of a token.
     */
    error ERC721IncorrectOwner(address sender, uint256 tokenId, address owner);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC721InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC721InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `operator`’s approval. Used in transfers.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     * @param tokenId Identifier number of a token.
     */
    error ERC721InsufficientApproval(address operator, uint256 tokenId);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC721InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC721InvalidOperator(address operator);
}

/**
 * @dev Standard ERC-1155 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-1155 tokens.
 */
interface IERC1155Errors {
    /**
     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     * @param tokenId Identifier number of a token.
     */
    error ERC1155InsufficientBalance(address sender, uint256 balance, uint256 needed, uint256 tokenId);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC1155InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC1155InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `operator`’s approval. Used in transfers.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     * @param owner Address of the current owner of a token.
     */
    error ERC1155MissingApprovalForAll(address operator, address owner);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC1155InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC1155InvalidOperator(address operator);

    /**
     * @dev Indicates an array length mismatch between ids and values in a safeBatchTransferFrom operation.
     * Used in batch transfers.
     * @param idsLength Length of the array of token identifiers
     * @param valuesLength Length of the array of token amounts
     */
    error ERC1155InvalidArrayLength(uint256 idsLength, uint256 valuesLength);
}

// File: @openzeppelin/contracts/token/ERC20/ERC20.sol


// OpenZeppelin Contracts (last updated v5.3.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.20;





/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * The default value of {decimals} is 18. To change this, you should override
 * this function so it returns a different value.
 *
 * We have followed general OpenZeppelin Contracts guidelines: functions revert
 * instead returning `false` on failure. This behavior is nonetheless
 * conventional and does not conflict with the expectations of ERC-20
 * applications.
 */
abstract contract ERC20 is Context, IERC20, IERC20Metadata, IERC20Errors {
    mapping(address account => uint256) private _balances;

    mapping(address account => mapping(address spender => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * Both values are immutable: they can only be set once during construction.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the default value returned by this function, unless
     * it's overridden.
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual returns (uint8) {
        return 18;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view virtual returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `value`.
     */
    function transfer(address to, uint256 value) public virtual returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, value);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view virtual returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If `value` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 value) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, value);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Skips emitting an {Approval} event indicating an allowance update. This is not
     * required by the ERC. See {xref-ERC20-_approve-address-address-uint256-bool-}[_approve].
     *
     * NOTE: Does not update the allowance if the current allowance
     * is the maximum `uint256`.
     *
     * Requirements:
     *
     * - `from` and `to` cannot be the zero address.
     * - `from` must have a balance of at least `value`.
     * - the caller must have allowance for ``from``'s tokens of at least
     * `value`.
     */
    function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        return true;
    }

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead.
     */
    function _transfer(address from, address to, uint256 value) internal {
        if (from == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        if (to == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(from, to, value);
    }

    /**
     * @dev Transfers a `value` amount of tokens from `from` to `to`, or alternatively mints (or burns) if `from`
     * (or `to`) is the zero address. All customizations to transfers, mints, and burns should be done by overriding
     * this function.
     *
     * Emits a {Transfer} event.
     */
    function _update(address from, address to, uint256 value) internal virtual {
        if (from == address(0)) {
            // Overflow check required: The rest of the code assumes that totalSupply never overflows
            _totalSupply += value;
        } else {
            uint256 fromBalance = _balances[from];
            if (fromBalance < value) {
                revert ERC20InsufficientBalance(from, fromBalance, value);
            }
            unchecked {
                // Overflow not possible: value <= fromBalance <= totalSupply.
                _balances[from] = fromBalance - value;
            }
        }

        if (to == address(0)) {
            unchecked {
                // Overflow not possible: value <= totalSupply or value <= fromBalance <= totalSupply.
                _totalSupply -= value;
            }
        } else {
            unchecked {
                // Overflow not possible: balance + value is at most totalSupply, which we know fits into a uint256.
                _balances[to] += value;
            }
        }

        emit Transfer(from, to, value);
    }

    /**
     * @dev Creates a `value` amount of tokens and assigns them to `account`, by transferring it from address(0).
     * Relies on the `_update` mechanism
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead.
     */
    function _mint(address account, uint256 value) internal {
        if (account == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(address(0), account, value);
    }

    /**
     * @dev Destroys a `value` amount of tokens from `account`, lowering the total supply.
     * Relies on the `_update` mechanism.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead
     */
    function _burn(address account, uint256 value) internal {
        if (account == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        _update(account, address(0), value);
    }

    /**
     * @dev Sets `value` as the allowance of `spender` over the `owner`'s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     *
     * Overrides to this logic should be done to the variant with an additional `bool emitEvent` argument.
     */
    function _approve(address owner, address spender, uint256 value) internal {
        _approve(owner, spender, value, true);
    }

    /**
     * @dev Variant of {_approve} with an optional flag to enable or disable the {Approval} event.
     *
     * By default (when calling {_approve}) the flag is set to true. On the other hand, approval changes made by
     * `_spendAllowance` during the `transferFrom` operation set the flag to false. This saves gas by not emitting any
     * `Approval` event during `transferFrom` operations.
     *
     * Anyone who wishes to continue emitting `Approval` events on the`transferFrom` operation can force the flag to
     * true using the following override:
     *
     * ```solidity
     * function _approve(address owner, address spender, uint256 value, bool) internal virtual override {
     *     super._approve(owner, spender, value, true);
     * }
     * ```
     *
     * Requirements are the same as {_approve}.
     */
    function _approve(address owner, address spender, uint256 value, bool emitEvent) internal virtual {
        if (owner == address(0)) {
            revert ERC20InvalidApprover(address(0));
        }
        if (spender == address(0)) {
            revert ERC20InvalidSpender(address(0));
        }
        _allowances[owner][spender] = value;
        if (emitEvent) {
            emit Approval(owner, spender, value);
        }
    }

    /**
     * @dev Updates `owner`'s allowance for `spender` based on spent `value`.
     *
     * Does not update the allowance value in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Does not emit an {Approval} event.
     */
    function _spendAllowance(address owner, address spender, uint256 value) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance < type(uint256).max) {
            if (currentAllowance < value) {
                revert ERC20InsufficientAllowance(spender, currentAllowance, value);
            }
            unchecked {
                _approve(owner, spender, currentAllowance - value, false);
            }
        }
    }
}

// File: @openzeppelin/contracts/utils/ReentrancyGuard.sol


// OpenZeppelin Contracts (last updated v5.1.0) (utils/ReentrancyGuard.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
 * consider using {ReentrancyGuardTransient} instead.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    uint256 private _status;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        if (_status == ENTERED) {
            revert ReentrancyGuardReentrantCall();
        }

        // Any calls to nonReentrant after this point will fail
        _status = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == ENTERED;
    }
}

// File: SimpleSwap.sol


pragma solidity ^0.8.27;

/**
 * @title SimpleSwap (Final Corrected Version)
 * @author Freddy Brito (Inspired by Uniswap V2)
 * @dev A highly gas-optimized AMM for swapping two ERC20 tokens.
 * This version focuses on minimizing state reads/writes and external calls.
 */
contract SimpleSwap is ERC20, ReentrancyGuard {

    // --- State Variables ---

    // Address of token A used in the pair
    ERC20 public immutable tokenA;

    // Address of token B used in the pair
    ERC20 public immutable tokenB;

    // Current reserve of token A in the liquidity pool
    uint256 public reserveA;

    // Current reserve of token B in the liquidity pool
    uint256 public reserveB;


    // --- Events ---
    
    /** 
    * @notice Emitted when liquidity is added to the pool
    * @param provider The address that provided the liquidity
    * @param amountA The amount of token A added
    * @param amountB The amount of token B added
    * @param liquidity The amount of liquidity tokens minted
    */
    event AddLiquidity(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);

    /** 
    * @notice Emitted when liquidity is removed from the pool
    * @param provider The address that removed the liquidity
    * @param amountA The amount of token A returned
    * @param amountB The amount of token B returned
    * @param liquidity The amount of liquidity tokens burned
    */
    event RemoveLiquidity(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);

    /** 
    * @notice Emitted when a swap is executed
    * @param sender The address initiating the swap
    * @param to The address receiving the output tokens
    * @param amountIn The amount of input tokens swapped
    * @param amountOut The amount of output tokens received
    * @param tokenIn The address of the input token
    * @param tokenOut The address of the output token
    */
    event Swap(address indexed sender, address indexed to, uint256 amountIn, uint256 amountOut, address tokenIn, address tokenOut);
    
    /** 
    * @notice Emitted when the pool's reserves are updated
    * @param reserveA The updated reserve of token A
    * @param reserveB The updated reserve of token B
    */
    event Sync(uint256 reserveA, uint256 reserveB);



    // --- Modifiers ---

    /** 
    * @notice Ensures that the transaction is still valid based on the given deadline
    * @dev Reverts if the current block timestamp is greater than the provided deadline
    * @param deadline The latest timestamp at which the transaction is still valid
    */
    modifier ensure(uint256 deadline) {
        require(deadline >= block.timestamp, "EXPIRED");
        _;
    }


    // --- Constructor ---

    /**
     * @dev When deploying the contract we set the token pair and the liquidity token is created.
     * @param _tokenA Address of the first ERC-20 token. (FTK)
     * @param _tokenB Address of the second ERC-20 token. (BTK)
     */
    constructor(address _tokenA, address _tokenB) ERC20("SimpleSwap Liquidity", "SSL") {
        require(_tokenA != address(0) && _tokenB != address(0), "ZERO_ADDRESS");
        require(_tokenA != _tokenB, "IDENTICAL_ADDRESSES");
        tokenA = ERC20(_tokenA);
        tokenB = ERC20(_tokenB);
    }


    // --- Reading Functions (View/Pure) ---

    /**
     * @notice Returns the number of output tokens for a given input amount.
     * @dev This is a pure view function, it does not modify state.
     * @param amountIn The amount of the token being sent to the pool.
     * @param reserveIn The reservation of the input token.
     * @param reserveOut The reserve of the output token.
     * @return amountOut The amount of the token to be received.
     * @notice Calculates the amount of output tokens for a given input amount, including fees.
     * @dev This is the standard Uniswap V2 formula for getAmountOut.
     */
    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) private pure returns (uint256 amountOut) {
        require(amountIn > 0, "INSUFFICIENT_INPUT_AMOUNT");
        require(reserveIn > 0 && reserveOut > 0, "INSUFFICIENT_LIQUIDITY");

        // The ratio of reserves is based on the ratio of input amounts and output amounts.
        amountOut = (amountIn * reserveOut) / (reserveIn + amountIn);
    }

    /**
     * @notice Returns the instant price of token in terms of token to change.
     * @dev It is based on the proportion of reserves. It does not consider the impact of a trade.
     * @param token Token contract address.
     * @return amountToPay price of token in units of the other token.
     */
    function getAmountByTokenToChange(address token, uint256 amountToChange) public view returns (uint256 amountToPay) {
        (uint256 reserveIn, uint256 reserveOut) = (token == address(tokenA)) ? (reserveA, reserveB) : (reserveB, reserveA);
        amountToPay = getAmountOut(amountToChange, reserveIn, reserveOut);
    }

    /**
     * @notice Returns the reserves of the pool.
     * @return _reserveA tokenA reserve.
     * @return _reserveB tokenB reserve.
     */
    function getReserves() public view returns (uint256 _reserveA, uint256 _reserveB) {
        return (reserveA, reserveB);
    }


    // --- Core Logic Functions ---

    /**
     * @dev Internal function to update reserves and emit a Sync event.
     * This is the most gas-efficient way to update state.
     * @param _reserveA tokenA reserve.
     * @param _reserveB tokenB reserve.
     */
    function _update(uint256 _reserveA, uint256 _reserveB) private {
        reserveA = _reserveA;
        reserveB = _reserveB;
        emit Sync(_reserveA, _reserveB);
    }

    /**
    * @notice Adds liquidity to the pair.
    * @dev The user must have approved the contract to spend their tokens first.
    * @param amountADesired Desired amount of tokenA to add.
    * @param amountBDesired Desired amount of tokenB to add.
    * @param amountAMin Minimum amount of tokenA to add.
    * @param amountBMin Minimum amount of tokenB to add.
    * @param to Recipient of the liquidity tokens.
    * @param deadline Time after which the transaction is invalid.
    * @return amountA Effective amount of tokenA added.
    * @return amountB Effective amount of tokenB added.
    * @return liquidity Amount of liquidity tokens minted.
    */
    function addLiquidity(uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) external nonReentrant ensure(deadline) returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        (uint256 _reserveA, uint256 _reserveB) = (reserveA, reserveB); // Gas optimization: read to memory once
        
        if (_reserveA > 0 || _reserveB > 0) {
            uint amountBOptimal = (amountADesired * _reserveB) / _reserveA;
            if (amountBOptimal <= amountBDesired) {
                require(amountBOptimal >= amountBMin, "INSUFFICIENT_B_AMOUNT");
                amountA = amountADesired;
                amountB = amountBOptimal;
            } else {
                uint amountAOptimal = (amountBDesired * _reserveA) / _reserveB;
                require(amountAOptimal >= amountAMin, "INSUFFICIENT_A_AMOUNT");
                amountA = amountAOptimal;
                amountB = amountBDesired;
            }
        } else {
            amountA = amountADesired;
            amountB = amountBDesired;
        }

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        uint256 _totalSupply = totalSupply();
        if (_totalSupply == 0) {
            liquidity = sqrt(amountA * amountB);
        } else {
            liquidity = Math.min((amountA * _totalSupply) / _reserveA, (amountB * _totalSupply) / _reserveB);
        }

        require(liquidity > 0, "INSUFFICIENT_LIQUIDITY_MINTED");
        _mint(to, liquidity);

        // Gas Optimization: Update reserves arithmetically instead of calling balanceOf()
        _update(_reserveA + amountA, _reserveB + amountB);
        emit AddLiquidity(msg.sender, amountA, amountB, liquidity);
    }

    /**
     * @notice Withdraw liquidity from the pool.
     * @param liquidity Amount of liquidity tokens to withdraw.
     * @param amountAMin Acceptable minimums to avoid failures.
     * @param amountBMin Acceptable minimums to avoid failures.
     * @param to Address of the recipient.
     * @param deadline Timestamp for the transaction.
     * @return amountA Amounts received after withdrawing liquidity.
     * @return amountB Amounts received after withdrawing liquidity.
     */
    function removeLiquidity(uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external nonReentrant ensure(deadline) returns (uint amountA, uint amountB) {
        require(balanceOf(msg.sender) >= liquidity, "INSUFFICIENT_LIQUIDITY");
        
        (uint256 _reserveA, uint256 _reserveB) = (reserveA, reserveB); // Gas optimization
        uint256 _totalSupply = totalSupply();

        amountA = (liquidity * _reserveA) / _totalSupply;
        amountB = (liquidity * _reserveB) / _totalSupply;
        
        require(amountA >= amountAMin, "INSUFFICIENT_A_AMOUNT");
        require(amountB >= amountBMin, "INSUFFICIENT_B_AMOUNT");

        _burn(msg.sender, liquidity);
        tokenA.transfer(to, amountA);
        tokenB.transfer(to, amountB);

        // Gas Optimization: Update reserves arithmetically
        _update(_reserveA - amountA, _reserveB - amountB);
        emit RemoveLiquidity(msg.sender, amountA, amountB, liquidity);
    }

    /**
     * @notice Swaps an exact amount of input tokens for as many output tokens as possible.
     * @param amountIn Amount of input token.
     * @param amountOutMin Minimum acceptable output token amount (slippage protection).
     * @param path Input token address and Output token address.
     * @param to Address that will receive the output tokens.
     * @param deadline Deadline for the transaction to be valid (front-running protection).
     * @notice Removes liquidity from the pool.
     */
    function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external nonReentrant ensure(deadline) {
        require(path.length == 2, "INVALID_PATH");
        address _tokenA = address(tokenA);
        address _tokenB = address(tokenB);
        address tokenInAddress = path[0];
        address tokenOutAddress = path[1];
        require((tokenInAddress == _tokenA && tokenOutAddress == _tokenB) || (tokenInAddress == _tokenB && tokenOutAddress == _tokenA), "INVALID_TOKEN_PAIR");

        (uint256 _reserveA, uint256 _reserveB) = (reserveA, reserveB); // Gas optimization
        (uint256 reserveIn, uint256 reserveOut) = (tokenInAddress == _tokenA) ? (_reserveA, _reserveB) : (_reserveB, _reserveA);
  
        uint256 _amountIn = amountIn;

        ERC20(tokenInAddress).transferFrom(msg.sender, address(this), _amountIn);
        uint amountOut = getAmountOut(_amountIn, reserveIn, reserveOut);
        require(amountOut >= amountOutMin, "INSUFFICIENT_OUTPUT_AMOUNT");
        ERC20(tokenOutAddress).transfer(to, amountOut);

        // Gas Optimization: Update reserves arithmetically
        if (tokenInAddress == _tokenA) {
            _update(_reserveA + _amountIn, _reserveB - amountOut);
        } else {
            _update(_reserveA - amountOut, _reserveB + _amountIn);
        }
        
        emit Swap(msg.sender, to, _amountIn, amountOut, tokenInAddress, tokenOutAddress);
    }


    // --- Auxiliary Functions ---

    /**
    * @notice Calculates the integer square root of a given number
    * @dev Uses the Babylonian method for computing square roots
    * @param y The input number to compute the square root of
    * @return z The integer square root of the input number
    */
    function sqrt(uint y) private pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}

/**
 * @title Math
 * @author Uniswap Library
 * @dev A library for basic math operations.
 */
library Math {
    function min(uint x, uint y) internal pure returns (uint) {
        return x <= y ? x : y;
    }
}