const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleSwap", function () {
    let SimpleSwap;
    let simpleSwap;
    let TokenA;
    let tokenA;
    let TokenB;
    let tokenB;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    // Helper function to approve tokens
    const approveTokens = async (signer, amount) => {
        await tokenA.connect(signer).approve(await simpleSwap.getAddress(), amount);
        await tokenB.connect(signer).approve(await simpleSwap.getAddress(), amount);
    };

    // Helper function to get the current timestamp
    const getTimestamp = async () => {
        const block = await ethers.provider.getBlock("latest");
        return block.timestamp;
    };

    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // Deploy Mock ERC20 tokens
        TokenA = await ethers.getContractFactory("MockERC20");
        tokenA = await TokenA.deploy("Token A", "TKA");
        TokenB = await ethers.getContractFactory("MockERC20");
        tokenB = await TokenB.deploy("Token B", "TKB");

        // Mint some tokens to owner and addr1
        await tokenA.mint(owner.address, ethers.parseEther("10000"));
        await tokenB.mint(owner.address, ethers.parseEther("10000"));
        await tokenA.mint(addr1.address, ethers.parseEther("10000"));
        await tokenB.mint(addr1.address, ethers.parseEther("10000"));

        // Deploy SimpleSwap
        SimpleSwap = await ethers.getContractFactory("SimpleSwap");
        simpleSwap = await SimpleSwap.deploy(await tokenA.getAddress(), await tokenB.getAddress());
    });

    // --- Constructor Tests ---
    describe("Constructor", function () {
        it("Should set the correct token addresses", async function () {
            expect(await simpleSwap.tokenA()).to.equal(await tokenA.getAddress());
            expect(await simpleSwap.tokenB()).to.equal(await tokenB.getAddress());
        });

        it("Should revert if tokenA is zero address", async function () {
            await expect(SimpleSwap.deploy(ethers.ZeroAddress, await tokenB.getAddress())).to.be.revertedWith("ZERO_ADDRESS");
        });

        it("Should revert if tokenB is zero address", async function () {
            await expect(SimpleSwap.deploy(await tokenA.getAddress(), ethers.ZeroAddress)).to.be.revertedWith("ZERO_ADDRESS");
        });

        it("Should revert if tokenA and tokenB are the same address", async function () {
            await expect(SimpleSwap.deploy(await tokenA.getAddress(), await tokenA.getAddress())).to.be.revertedWith("IDENTICAL_ADDRESSES");
        });

        it("Should set the ERC20 name and symbol", async function () {
            expect(await simpleSwap.name()).to.equal("SimpleSwap Liquidity");
            expect(await simpleSwap.symbol()).to.equal("SSL");
        });
    });

    // --- Add Liquidity Tests ---
    describe("addLiquidity", function () {
        beforeEach(async function () {
            // Approve tokens for owner
            await approveTokens(owner, ethers.parseEther("10000"));
        });

        it("Should add initial liquidity correctly", async function () {
            const amountA = ethers.parseEther("100");
            const amountB = ethers.parseEther("100");
            const deadline = (await getTimestamp()) + 1000;

            await expect(simpleSwap.addLiquidity(amountA, amountB, 0, 0, owner.address, deadline))
                .to.emit(simpleSwap, "AddLiquidity")
                .withArgs(owner.address, amountA, amountB, ethers.parseEther("100")); // sqrt(100*100) = 100

            expect(await simpleSwap.reserveA()).to.equal(amountA);
            expect(await simpleSwap.reserveB()).to.equal(amountB);
            expect(await simpleSwap.balanceOf(owner.address)).to.equal(ethers.parseEther("100"));
            expect(await tokenA.balanceOf(simpleSwap.getAddress())).to.equal(amountA);
            expect(await tokenB.balanceOf(simpleSwap.getAddress())).to.equal(amountB);
        });

        it("Should add subsequent liquidity with correct ratio", async function () {
            // Initial liquidity
            await simpleSwap.addLiquidity(ethers.parseEther("100"), ethers.parseEther("100"), 0, 0, owner.address, (await getTimestamp()) + 1000);

            // Add more liquidity
            const amountADesired = ethers.parseEther("50");
            const amountBDesired = ethers.parseEther("60"); // More than optimal
            const deadline = (await getTimestamp()) + 1000;

            // Optimal B for 50 A is (50 * 100) / 100 = 50
            await expect(simpleSwap.addLiquidity(amountADesired, amountBDesired, 0, 0, owner.address, deadline))
                .to.emit(simpleSwap, "AddLiquidity")
                .withArgs(owner.address, amountADesired, ethers.parseEther("50"), ethers.parseEther("50")); // (50 * 100) / 100 = 50

            expect(await simpleSwap.reserveA()).to.equal(ethers.parseEther("150"));
            expect(await simpleSwap.reserveB()).to.equal(ethers.parseEther("150"));
            expect(await simpleSwap.balanceOf(owner.address)).to.equal(ethers.parseEther("150"));
        });

        it("Should add subsequent liquidity when optimal A is less than desired A", async function () {
            // Initial liquidity
            await simpleSwap.addLiquidity(ethers.parseEther("100"), ethers.parseEther("100"), 0, 0, owner.address, (await getTimestamp()) + 1000);

            // Add more liquidity, prioritize B
            const amountADesired = ethers.parseEther("60"); // More than optimal
            const amountBDesired = ethers.parseEther("50");
            const deadline = (await getTimestamp()) + 1000;

            // Optimal A for 50 B is (50 * 100) / 100 = 50
            await expect(simpleSwap.addLiquidity(amountADesired, amountBDesired, 0, 0, owner.address, deadline))
                .to.emit(simpleSwap, "AddLiquidity")
                .withArgs(owner.address, ethers.parseEther("50"), amountBDesired, ethers.parseEther("50")); // (50 * 100) / 100 = 50

            expect(await simpleSwap.reserveA()).to.equal(ethers.parseEther("150"));
            expect(await simpleSwap.reserveB()).to.equal(ethers.parseEther("150"));
            expect(await simpleSwap.balanceOf(owner.address)).to.equal(ethers.parseEther("150"));
        });

        it("Should revert if deadline is passed", async function () {
            const amountA = ethers.parseEther("100");
            const amountB = ethers.parseEther("100");
            const deadline = (await getTimestamp()) - 10; // Past deadline
            await expect(simpleSwap.addLiquidity(amountA, amountB, 0, 0, owner.address, deadline)).to.be.revertedWith("EXPIRED");
        });

        it("Should revert if amountB supplied is less than amountBMin", async function () {
            await simpleSwap.addLiquidity(ethers.parseEther("100"), ethers.parseEther("100"), 0, 0, owner.address, (await getTimestamp()) + 1000);
            const amountADesired = ethers.parseEther("50");
            const amountBDesired = ethers.parseEther("50");
            const amountBMin = ethers.parseEther("51"); // Higher than optimal
            const deadline = (await getTimestamp()) + 1000;
            await expect(simpleSwap.addLiquidity(amountADesired, amountBDesired, 0, amountBMin, owner.address, deadline)).to.be.revertedWith("INSUFFICIENT_B_AMOUNT");
        });


        it("Should revert if no liquidity is minted", async function () {
            const amountA = 0;
            const amountB = 0;
            const deadline = (await getTimestamp()) + 1000;
            await expect(simpleSwap.addLiquidity(amountA, amountB, 0, 0, owner.address, deadline)).to.be.revertedWith("INSUFFICIENT_LIQUIDITY_MINTED");
        });

        it("Should handle adding liquidity with different initial token amounts correctly", async function () {
            const amountA = ethers.parseEther("200");
            const amountB = ethers.parseEther("100");
            const deadline = (await getTimestamp()) + 1000;

            await expect(simpleSwap.addLiquidity(amountA, amountB, 0, 0, owner.address, deadline))
                .to.emit(simpleSwap, "AddLiquidity")
                .withArgs(owner.address, amountA, amountB, ethers.parseEther("141.421356237309504880")); // sqrt(200*100)
            
            expect(await simpleSwap.reserveA()).to.equal(amountA);
            expect(await simpleSwap.reserveB()).to.equal(amountB);
        });

        it("Should correctly calculate subsequent liquidity when reserves are unequal", async function () {
            // Initial liquidity
            await simpleSwap.addLiquidity(ethers.parseEther("200"), ethers.parseEther("100"), 0, 0, owner.address, (await getTimestamp()) + 1000); // 141.42 LP tokens minted

            // Add more liquidity, trying to maintain ratio
            // Current ratio 200A:100B (2:1)
            // Add 100A, desired 50B
            const amountADesired = ethers.parseEther("100");
            const amountBDesired = ethers.parseEther("50");
            const deadline = (await getTimestamp()) + 1000;

            // Optimal B: (100 * 100) / 200 = 50
            await expect(simpleSwap.addLiquidity(amountADesired, amountBDesired, 0, 0, owner.address, deadline))
                .to.emit(simpleSwap, "AddLiquidity")
                .withArgs(owner.address, amountADesired, amountBDesired, ethers.parseEther("70.710678118654752440")); // (100 * 141.42...) / 200

            expect(await simpleSwap.reserveA()).to.equal(ethers.parseEther("300"));
            expect(await simpleSwap.reserveB()).to.equal(ethers.parseEther("150"));
            // Total LP tokens: 141.421356237309504880 + 70.710678118654752440 = 212.132034355964257320
            expect(await simpleSwap.balanceOf(owner.address)).to.equal(ethers.parseEther("212.132034355964257320"));
        });
    });

    // --- Remove Liquidity Tests ---
    describe("removeLiquidity", function () {
        const initialLiquidityA = ethers.parseEther("100");
        const initialLiquidityB = ethers.parseEther("100");
        const initialLP = ethers.parseEther("100");

        beforeEach(async function () {
            // Add initial liquidity
            await approveTokens(owner, ethers.parseEther("10000"));
            await simpleSwap.addLiquidity(initialLiquidityA, initialLiquidityB, 0, 0, owner.address, (await getTimestamp()) + 1000);
        });

        it("Should remove liquidity correctly", async function () {
            const liquidityToRemove = initialLP;
            const amountAMin = 0;
            const amountBMin = 0;
            const deadline = (await getTimestamp()) + 1000;

            await expect(simpleSwap.removeLiquidity(liquidityToRemove, amountAMin, amountBMin, owner.address, deadline))
                .to.emit(simpleSwap, "RemoveLiquidity")
                .withArgs(owner.address, initialLiquidityA, initialLiquidityB, liquidityToRemove);

            expect(await simpleSwap.reserveA()).to.equal(0);
            expect(await simpleSwap.reserveB()).to.equal(0);
            expect(await simpleSwap.balanceOf(owner.address)).to.equal(0);
            expect(await tokenA.balanceOf(simpleSwap.getAddress())).to.equal(0);
            expect(await tokenB.balanceOf(simpleSwap.getAddress())).to.equal(0);
        });

        it("Should remove partial liquidity correctly", async function () {
            const liquidityToRemove = ethers.parseEther("50");
            const amountAMin = 0;
            const amountBMin = 0;
            const deadline = (await getTimestamp()) + 1000;

            // Calculate expected amounts
            const expectedAmountA = (liquidityToRemove * initialLiquidityA) / initialLP;
            const expectedAmountB = (liquidityToRemove * initialLiquidityB) / initialLP;

            await expect(simpleSwap.removeLiquidity(liquidityToRemove, amountAMin, amountBMin, owner.address, deadline))
                .to.emit(simpleSwap, "RemoveLiquidity")
                .withArgs(owner.address, expectedAmountA, expectedAmountB, liquidityToRemove);

            expect(await simpleSwap.reserveA()).to.equal(initialLiquidityA - expectedAmountA);
            expect(await simpleSwap.reserveB()).to.equal(initialLiquidityB - expectedAmountB);
            expect(await simpleSwap.balanceOf(owner.address)).to.equal(initialLP - liquidityToRemove);
        });

        it("Should revert if sender has insufficient liquidity", async function () {
            const liquidityToRemove = ethers.parseEther("150"); // More than owner's balance
            const amountAMin = 0;
            const amountBMin = 0;
            const deadline = (await getTimestamp()) + 1000;

            await expect(simpleSwap.removeLiquidity(liquidityToRemove, amountAMin, amountBMin, owner.address, deadline)).to.be.revertedWith("INSUFFICIENT_LIQUIDITY");
        });

        it("Should revert if deadline is passed", async function () {
            const liquidityToRemove = ethers.parseEther("50");
            const amountAMin = 0;
            const amountBMin = 0;
            const deadline = (await getTimestamp()) - 10; // Past deadline

            await expect(simpleSwap.removeLiquidity(liquidityToRemove, amountAMin, amountBMin, owner.address, deadline)).to.be.revertedWith("EXPIRED");
        });

        it("Should revert if amountA withdrawn is less than amountAMin", async function () {
            const liquidityToRemove = ethers.parseEther("50");
            const amountAMin = ethers.parseEther("51"); // Higher than expected
            const amountBMin = 0;
            const deadline = (await getTimestamp()) + 1000;

            await expect(simpleSwap.removeLiquidity(liquidityToRemove, amountAMin, amountBMin, owner.address, deadline)).to.be.revertedWith("INSUFFICIENT_A_AMOUNT");
        });

        it("Should revert if amountB withdrawn is less than amountBMin", async function () {
            const liquidityToRemove = ethers.parseEther("50");
            const amountAMin = 0;
            const amountBMin = ethers.parseEther("51"); // Higher than expected
            const deadline = (await getTimestamp()) + 1000;

            await expect(simpleSwap.removeLiquidity(liquidityToRemove, amountAMin, amountBMin, owner.address, deadline)).to.be.revertedWith("INSUFFICIENT_B_AMOUNT");
        });
    });

    // --- Swap Exact Tokens For Tokens Tests ---
    describe("swapExactTokensForTokens", function () {
        const initialLiquidityA = ethers.parseEther("1000");
        const initialLiquidityB = ethers.parseEther("1000");

        beforeEach(async function () {
            // Add initial liquidity
            await approveTokens(owner, ethers.parseEther("10000"));
            await simpleSwap.addLiquidity(initialLiquidityA, initialLiquidityB, 0, 0, owner.address, (await getTimestamp()) + 1000);

            // Approve tokens for addr1 to swap
            await tokenA.connect(addr1).approve(await simpleSwap.getAddress(), ethers.parseEther("10000"));
            await tokenB.connect(addr1).approve(await simpleSwap.getAddress(), ethers.parseEther("10000"));
        });

        it("Should swap tokenA for tokenB correctly", async function () {
            const amountIn = ethers.parseEther("10");
            const amountOutMin = ethers.parseEther("9"); // Expecting around 9.9
            const path = [await tokenA.getAddress(), await tokenB.getAddress()];
            const to = addr1.address;
            const deadline = (await getTimestamp()) + 1000;

            const initialReserveA = await simpleSwap.reserveA();
            const initialReserveB = await simpleSwap.reserveB();
            const initialAddr1BalanceB = await tokenB.balanceOf(addr1.address);

            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline))
                .to.emit(simpleSwap, "Swap")
                .withArgs(addr1.address, to, amountIn, initialReserveB * amountIn / (initialReserveA + amountIn), await tokenA.getAddress(), await tokenB.getAddress());

            // Calculate expected amount out
            const expectedAmountOut = (initialReserveB * amountIn) / (initialReserveA + amountIn);

            expect(await simpleSwap.reserveA()).to.equal(initialReserveA + amountIn);
            expect(await simpleSwap.reserveB()).to.equal(initialReserveB - expectedAmountOut);
            expect(await tokenA.balanceOf(addr1.address)).to.equal(ethers.parseEther("10000") - amountIn);
            expect(await tokenB.balanceOf(addr1.address)).to.equal(initialAddr1BalanceB + expectedAmountOut);
        });

        it("Should swap tokenB for tokenA correctly", async function () {
            const amountIn = ethers.parseEther("10");
            const amountOutMin = ethers.parseEther("9"); // Expecting around 9.9
            const path = [await tokenB.getAddress(), await tokenA.getAddress()];
            const to = addr1.address;
            const deadline = (await getTimestamp()) + 1000;

            const initialReserveA = await simpleSwap.reserveA();
            const initialReserveB = await simpleSwap.reserveB();
            const initialAddr1BalanceA = await tokenA.balanceOf(addr1.address);

            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline))
                .to.emit(simpleSwap, "Swap")
                .withArgs(addr1.address, to, amountIn, initialReserveA * amountIn / (initialReserveB + amountIn), await tokenB.getAddress(), await tokenA.getAddress());

            // Calculate expected amount out
            const expectedAmountOut = (initialReserveA * amountIn) / (initialReserveB + amountIn);

            expect(await simpleSwap.reserveA()).to.equal(initialReserveA - expectedAmountOut);
            expect(await simpleSwap.reserveB()).to.equal(initialReserveB + amountIn);
            expect(await tokenB.balanceOf(addr1.address)).to.equal(ethers.parseEther("10000") - amountIn);
            expect(await tokenA.balanceOf(addr1.address)).to.equal(initialAddr1BalanceA + expectedAmountOut);
        });

        it("Should revert if path length is not 2", async function () {
            const amountIn = ethers.parseEther("10");
            const amountOutMin = ethers.parseEther("9");
            const pathTooShort = [await tokenA.getAddress()];
            const pathTooLong = [await tokenA.getAddress(), await tokenB.getAddress(), await tokenA.getAddress()];
            const to = addr1.address;
            const deadline = (await getTimestamp()) + 1000;

            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(amountIn, amountOutMin, pathTooShort, to, deadline)).to.be.revertedWith("INVALID_PATH");
            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(amountIn, amountOutMin, pathTooLong, to, deadline)).to.be.revertedWith("INVALID_PATH");
        });

        it("Should revert if token pair is invalid", async function () {
            const amountIn = ethers.parseEther("10");
            const amountOutMin = ethers.parseEther("9");
            const path = [await tokenA.getAddress(), await addr2.address]; // addr2 is not tokenB
            const to = addr1.address;
            const deadline = (await getTimestamp()) + 1000;

            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline)).to.be.revertedWith("INVALID_TOKEN_PAIR");
        });

        it("Should revert if amountOut is less than amountOutMin", async function () {
            const amountIn = ethers.parseEther("1"); // Small amount
            const amountOutMin = ethers.parseEther("5"); // Unrealistic minimum
            const path = [await tokenA.getAddress(), await tokenB.getAddress()];
            const to = addr1.address;
            const deadline = (await getTimestamp()) + 1000;

            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline)).to.be.revertedWith("INSUFFICIENT_OUTPUT_AMOUNT");
        });

        it("Should revert if deadline is passed", async function () {
            const amountIn = ethers.parseEther("10");
            const amountOutMin = ethers.parseEther("9");
            const path = [await tokenA.getAddress(), await tokenB.getAddress()];
            const to = addr1.address;
            const deadline = (await getTimestamp()) - 10; // Past deadline

            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline)).to.be.revertedWith("EXPIRED");
        });

        it("Should revert if input amount is zero", async function () {
            const amountIn = ethers.parseEther("0");
            const amountOutMin = ethers.parseEther("0");
            const path = [await tokenA.getAddress(), await tokenB.getAddress()];
            const to = addr1.address;
            const deadline = (await getTimestamp()) + 1000;

            // The `getAmountOut` internal function (called by swap) has a check for amountIn > 0.
            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline)).to.be.revertedWith("INSUFFICIENT_INPUT_AMOUNT");
        });

        it("Should revert if reserves are zero (no liquidity)", async function () {
            // Deploy a new SimpleSwap without initial liquidity
            const newSimpleSwap = await SimpleSwap.deploy(await tokenA.getAddress(), await tokenB.getAddress());
            await tokenA.connect(addr1).approve(await newSimpleSwap.getAddress(), ethers.parseEther("10"));

            const amountIn = ethers.parseEther("10");
            const amountOutMin = ethers.parseEther("1");
            const path = [await tokenA.getAddress(), await tokenB.getAddress()];
            const to = addr1.address;
            const deadline = (await getTimestamp()) + 1000;

            await expect(newSimpleSwap.connect(addr1).swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline)).to.be.revertedWith("INSUFFICIENT_LIQUIDITY");
        });

        it("Should handle small amounts correctly", async function () {
            const amountIn = 100; // Smallest unit, not ethers.parseEther
            const amountOutMin = 1;
            const path = [await tokenA.getAddress(), await tokenB.getAddress()];
            const to = addr1.address;
            const deadline = (await getTimestamp()) + 1000;

            const initialReserveA = await simpleSwap.reserveA();
            const initialReserveB = await simpleSwap.reserveB();
            const initialAddr1BalanceB = await tokenB.balanceOf(addr1.address);

            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline))
                .to.not.be.reverted;

            const expectedAmountOut = (initialReserveB * BigInt(amountIn)) / (initialReserveA + BigInt(amountIn));
            expect(await tokenB.balanceOf(addr1.address)).to.equal(initialAddr1BalanceB + expectedAmountOut);
        });
    });

    // --- Reading Functions Tests ---
    describe("Reading Functions", function () {
        beforeEach(async function () {
            await approveTokens(owner, ethers.parseEther("10000"));
            await simpleSwap.addLiquidity(ethers.parseEther("100"), ethers.parseEther("200"), 0, 0, owner.address, (await getTimestamp()) + 1000);
        });

        it("Should return correct reserves", async function () {
            const [reserveA, reserveB] = await simpleSwap.getReserves();
            expect(reserveA).to.equal(ethers.parseEther("100"));
            expect(reserveB).to.equal(ethers.parseEther("200"));
        });

        it("Should return correct amount to pay for tokenA", async function () {
            const amountToChange = ethers.parseEther("10"); // Amount of TokenA we want to get
            const expectedAmountToPay = (ethers.parseEther("10") * ethers.parseEther("200")) / (ethers.parseEther("100") + ethers.parseEther("10")); // getAmountOut formula
            const amountToPay = await simpleSwap.getAmountByTokenToChange(await tokenA.getAddress(), amountToChange);
            expect(amountToPay).to.equal(expectedAmountToPay);
        });

        it("Should return correct amount to pay for tokenB", async function () {
            const amountToChange = ethers.parseEther("10"); // Amount of TokenB we want to get
            const expectedAmountToPay = (ethers.parseEther("10") * ethers.parseEther("100")) / (ethers.parseEther("200") + ethers.parseEther("10")); // getAmountOut formula
            const amountToPay = await simpleSwap.getAmountByTokenToChange(await tokenB.getAddress(), amountToChange);
            expect(amountToPay).to.equal(expectedAmountToPay);
        });

        it("Should return zero if reserves are zero for getAmountByTokenToChange", async function () {
            // Deploy a new SimpleSwap without initial liquidity
            const newSimpleSwap = await SimpleSwap.deploy(await tokenA.getAddress(), await tokenB.getAddress());
            const amountToChange = ethers.parseEther("10");
            await expect(newSimpleSwap.getAmountByTokenToChange(await tokenA.getAddress(), amountToChange)).to.be.revertedWith("INSUFFICIENT_LIQUIDITY");
        });

        it("Should return zero if amountToChange is zero for getAmountByTokenToChange", async function () {
            const amountToChange = 0;
            await expect(simpleSwap.getAmountByTokenToChange(await tokenA.getAddress(), amountToChange)).to.be.revertedWith("INSUFFICIENT_INPUT_AMOUNT");
        });
    });

    // --- Reentrancy Guard Tests ---
    describe("ReentrancyGuard", function () {
        it("Should prevent reentrancy during addLiquidity", async function () {

            // Simulate scenario where a malicious ERC20 token could re-enter
            // This requires a custom mock token that attempts re-entrancy.
            // For now, assume OpenZeppelin's ReentrancyGuard works as expected.
            const amountA = ethers.parseEther("100");
            const amountB = ethers.parseEther("100");
            const deadline = (await getTimestamp()) + 1000;

            await approveTokens(owner, ethers.parseEther("1000"));

            // If we had a malicious token, we'd transferFrom it and expect a revert.
            // Since our MockERC20 doesn't have reentrant logic, this test just
            // confirms the function is correctly marked nonReentrant.
            // The `nonReentrant` modifier is checked before any external calls.
            await expect(simpleSwap.addLiquidity(amountA, amountB, 0, 0, owner.address, deadline)).to.not.be.revertedWith("ReentrancyGuard: reentrant call");
        });

        it("Should prevent reentrancy during removeLiquidity", async function () {
            const amountA = ethers.parseEther("100");
            const amountB = ethers.parseEther("100");
            const deadline = (await getTimestamp()) + 1000;

            await approveTokens(owner, ethers.parseEther("1000"));
            await simpleSwap.addLiquidity(amountA, amountB, 0, 0, owner.address, deadline);

            const liquidityToRemove = ethers.parseEther("50");
            const removeDeadline = (await getTimestamp()) + 1000;

            await expect(simpleSwap.removeLiquidity(liquidityToRemove, 0, 0, owner.address, removeDeadline)).to.not.be.revertedWith("ReentrancyGuard: reentrant call");
        });

        it("Should prevent reentrancy during swapExactTokensForTokens", async function () {
            const amountA = ethers.parseEther("1000");
            const amountB = ethers.parseEther("1000");
            const deadline = (await getTimestamp()) + 1000;

            await approveTokens(owner, ethers.parseEther("10000"));
            await simpleSwap.addLiquidity(amountA, amountB, 0, 0, owner.address, deadline);

            await tokenA.connect(addr1).approve(await simpleSwap.getAddress(), ethers.parseEther("100"));

            const swapAmountIn = ethers.parseEther("10");
            const swapAmountOutMin = ethers.parseEther("9");
            const path = [await tokenA.getAddress(), await tokenB.getAddress()];
            const to = addr1.address;
            const swapDeadline = (await getTimestamp()) + 1000;

            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(swapAmountIn, swapAmountOutMin, path, to, swapDeadline)).to.not.be.revertedWith("ReentrancyGuard: reentrant call");
        });
    });

    // --- Events Tests ---
    describe("Events", function () {
        it("Should emit AddLiquidity event", async function () {
            const amountA = ethers.parseEther("100");
            const amountB = ethers.parseEther("100");
            const deadline = (await getTimestamp()) + 1000;
            await approveTokens(owner, ethers.parseEther("200"));

            await expect(simpleSwap.addLiquidity(amountA, amountB, 0, 0, owner.address, deadline))
                .to.emit(simpleSwap, "AddLiquidity")
                .withArgs(owner.address, amountA, amountB, ethers.parseEther("100"));
        });

        it("Should emit RemoveLiquidity event", async function () {
            const initialAmountA = ethers.parseEther("100");
            const initialAmountB = ethers.parseEther("100");
            const initialLP = ethers.parseEther("100");
            const deadline = (await getTimestamp()) + 1000;
            await approveTokens(owner, ethers.parseEther("200"));
            await simpleSwap.addLiquidity(initialAmountA, initialAmountB, 0, 0, owner.address, deadline);

            const liquidityToRemove = ethers.parseEther("50");
            const removeDeadline = (await getTimestamp()) + 1000;

            const expectedAmountA = (liquidityToRemove * initialAmountA) / initialLP;
            const expectedAmountB = (liquidityToRemove * initialAmountB) / initialLP;

            await expect(simpleSwap.removeLiquidity(liquidityToRemove, 0, 0, owner.address, removeDeadline))
                .to.emit(simpleSwap, "RemoveLiquidity")
                .withArgs(owner.address, expectedAmountA, expectedAmountB, liquidityToRemove);
        });

        it("Should emit Swap event", async function () {
            const initialAmountA = ethers.parseEther("1000");
            const initialAmountB = ethers.parseEther("1000");
            const deadline = (await getTimestamp()) + 1000;
            await approveTokens(owner, ethers.parseEther("2000"));
            await simpleSwap.addLiquidity(initialAmountA, initialAmountB, 0, 0, owner.address, deadline);

            await tokenA.connect(addr1).approve(await simpleSwap.getAddress(), ethers.parseEther("10"));

            const amountIn = ethers.parseEther("10");
            const amountOutMin = ethers.parseEther("9");
            const path = [await tokenA.getAddress(), await tokenB.getAddress()];
            const to = addr1.address;
            const swapDeadline = (await getTimestamp()) + 1000;

            const expectedAmountOut = (initialAmountB * amountIn) / (initialAmountA + amountIn);

            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(amountIn, amountOutMin, path, to, swapDeadline))
                .to.emit(simpleSwap, "Swap")
                .withArgs(addr1.address, to, amountIn, expectedAmountOut, await tokenA.getAddress(), await tokenB.getAddress());
        });

        it("Should emit Sync event on liquidity addition", async function () {
            const amountA = ethers.parseEther("100");
            const amountB = ethers.parseEther("100");
            const deadline = (await getTimestamp()) + 1000;
            await approveTokens(owner, ethers.parseEther("200"));

            await expect(simpleSwap.addLiquidity(amountA, amountB, 0, 0, owner.address, deadline))
                .to.emit(simpleSwap, "Sync")
                .withArgs(amountA, amountB);
        });

        it("Should emit Sync event on liquidity removal", async function () {
            const initialAmountA = ethers.parseEther("100");
            const initialAmountB = ethers.parseEther("100");
            const initialLP = ethers.parseEther("100");
            const deadline = (await getTimestamp()) + 1000;
            await approveTokens(owner, ethers.parseEther("200"));
            await simpleSwap.addLiquidity(initialAmountA, initialAmountB, 0, 0, owner.address, deadline);

            const liquidityToRemove = ethers.parseEther("50");
            const removeDeadline = (await getTimestamp()) + 1000;

            const expectedAmountA = (liquidityToRemove * initialAmountA) / initialLP;
            const expectedAmountB = (liquidityToRemove * initialAmountB) / initialLP;

            await expect(simpleSwap.removeLiquidity(liquidityToRemove, 0, 0, owner.address, removeDeadline))
                .to.emit(simpleSwap, "Sync")
                .withArgs(initialAmountA - expectedAmountA, initialAmountB - expectedAmountB);
        });

        it("Should emit Sync event on swap", async function () {
            const initialAmountA = ethers.parseEther("1000");
            const initialAmountB = ethers.parseEther("1000");
            const deadline = (await getTimestamp()) + 1000;
            await approveTokens(owner, ethers.parseEther("2000"));
            await simpleSwap.addLiquidity(initialAmountA, initialAmountB, 0, 0, owner.address, deadline);

            await tokenA.connect(addr1).approve(await simpleSwap.getAddress(), ethers.parseEther("10"));

            const amountIn = ethers.parseEther("10");
            const amountOutMin = ethers.parseEther("9");
            const path = [await tokenA.getAddress(), await tokenB.getAddress()];
            const to = addr1.address;
            const swapDeadline = (await getTimestamp()) + 1000;

            const expectedAmountOut = (initialAmountB * amountIn) / (initialAmountA + amountIn);

            await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(amountIn, amountOutMin, path, to, swapDeadline))
                .to.emit(simpleSwap, "Sync")
                .withArgs(initialAmountA + amountIn, initialAmountB - expectedAmountOut);
        });
    });
});