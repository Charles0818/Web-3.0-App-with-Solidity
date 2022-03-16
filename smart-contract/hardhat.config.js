require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/37Qwb48-Qeo3zljNEy2PHNxwKWSJFE6w",
      accounts: [
        "c23d01373dfc945636759150ab7a1434b1562ccc322453c838ba00f3ac1c98e5",
      ],
    },
  },
};
