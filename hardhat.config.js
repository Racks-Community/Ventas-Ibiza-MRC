require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
    ],
  },
  defaultNetwork: "polygon",
  networks: {
    polygon: {
      url: "https://polygon-rpc.com",
      chainId: 137,
    },
  },
};
