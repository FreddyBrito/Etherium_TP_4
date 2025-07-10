`

freddybrito@Freddy Etherium_TP_4 % npx hardhat coverage

Version
=======
> solidity-coverage: v0.8.16

Instrumenting for coverage...
=============================

> MockERC20.sol
> SimpleSwap.sol

Compilation:
============

Nothing to compile

Network Info
============
> HardhatEVM: v2.25.0
> network:    hardhat



  SimpleSwap
    Constructor
      ✔ Should set the correct token addresses
      ✔ Should revert if tokenA is zero address
      ✔ Should revert if tokenB is zero address
      ✔ Should revert if tokenA and tokenB are the same address
      ✔ Should set the ERC20 name and symbol
    addLiquidity
      ✔ Should add initial liquidity correctly (99ms)
      ✔ Should add subsequent liquidity with correct ratio (60ms)
      ✔ Should add subsequent liquidity when optimal A is less than desired A (60ms)
      ✔ Should revert if deadline is passed
      ✔ Should revert if amountB supplied is less than amountBMin (45ms)
      ✔ Should revert if no liquidity is minted
      ✔ Should handle adding liquidity with different initial token amounts correctly (49ms)
      ✔ Should correctly calculate subsequent liquidity when reserves are unequal (69ms)
    removeLiquidity
      ✔ Should remove liquidity correctly
      ✔ Should remove partial liquidity correctly
      ✔ Should revert if sender has insufficient liquidity
      ✔ Should revert if deadline is passed
      ✔ Should revert if amountA withdrawn is less than amountAMin
      ✔ Should revert if amountB withdrawn is less than amountBMin
    swapExactTokensForTokens
      ✔ Should swap tokenA for tokenB correctly
      ✔ Should swap tokenB for tokenA correctly
      ✔ Should revert if path length is not 2
      ✔ Should revert if token pair is invalid
      ✔ Should revert if amountOut is less than amountOutMin
      ✔ Should revert if deadline is passed
      ✔ Should revert if input amount is zero
      ✔ Should revert if reserves are zero (no liquidity)
      ✔ Should handle small amounts correctly
    Reading Functions
      ✔ Should return correct reserves
      ✔ Should return correct amount to pay for tokenA
      ✔ Should return correct amount to pay for tokenB
      ✔ Should return zero if reserves are zero for getAmountByTokenToChange
      ✔ Should return zero if amountToChange is zero for getAmountByTokenToChange
    ReentrancyGuard
      ✔ Should prevent reentrancy during addLiquidity (43ms)
      ✔ Should prevent reentrancy during removeLiquidity (52ms)
      ✔ Should prevent reentrancy during swapExactTokensForTokens (59ms)
    Events
      ✔ Should emit AddLiquidity event (47ms)
      ✔ Should emit RemoveLiquidity event (55ms)
      ✔ Should emit Swap event (86ms)
      ✔ Should emit Sync event on liquidity addition (45ms)
      ✔ Should emit Sync event on liquidity removal (55ms)
      ✔ Should emit Sync event on swap (58ms)


  42 passing (3s)

-----------------|----------|----------|----------|----------|----------------|
File             |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-----------------|----------|----------|----------|----------|----------------|
 contracts/      |    73.76 |    67.86 |    64.41 |    71.08 |                |
  MockERC20.sol  |    78.57 |    54.17 |    65.22 |    68.85 |... 591,611,634 |
  SimpleSwap.sol |    71.72 |    71.59 |    63.89 |    72.03 |... 688,706,901 |
-----------------|----------|----------|----------|----------|----------------|
All files        |    73.76 |    67.86 |    64.41 |    71.08 |                |
-----------------|----------|----------|----------|----------|----------------|

`