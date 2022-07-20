//SPDX-License-Identifier:MIT
pragma solidity ^0.8.4;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//creating a library
library PriceConverter {
    // function getVersion() internal view returns (uint256) {
    //     //address 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
    //     AggregatorV3Interface priceFeed = AggregatorV3Interface(
    //         0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
    //     );
    //     return priceFeed.version();
    // }

    function getPrice(AggregatorV3Interface obj)
        internal
        view
        returns (uint256)
    {
        AggregatorV3Interface priceFeed = obj;
        (
            ,
            /*uint80 roundID*/
            int price, /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/
            ,
            ,

        ) = priceFeed.latestRoundData();
        return uint256(price * 1e10);
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUSD = (ethAmount * ethPrice) / 1e18;
        return ethAmountInUSD;
    }
}
