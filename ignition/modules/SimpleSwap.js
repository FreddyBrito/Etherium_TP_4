const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const tokenA = "0x978110ED33f7c45874CDF13Df4c3D12148FD94A8";
const tokenB = "0x54F291892c6c9be28149e65731d6988A97fb04fd";

const SimpleSwapModule = buildModule("SimpleSwapModule", (m) => {
  const simpleSwap = m.contract("SimpleSwap", [tokenA,tokenB]);

  return { simpleSwap };
});

module.exports = SimpleSwapModule;