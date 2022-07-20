//contract where users can pay
// we can withdraw

//SPDX-License-Identifier:MIT
pragma solidity ^0.8.4;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./library.sol";
import "hardhat/console.sol";
error FundMe__NotOwner(); //https://blog.soliditylang.org/2021/04/21/custom-errors/
error FundMe__NotEnoughEth();

contract FundMe {
    /*How to make a contract gas efficient?
    constant and immutable concept
    custom error (using if and revert() instead of require)
  */
    using PriceConverter for uint256;
    address[] public addressArray;
    mapping(address => uint256) public addressToFunding;
    uint public constant minimumUSD = 50 * 1e18; // constant keyword for gas efficiency
    address public immutable owner; // gas efficiency
    AggregatorV3Interface public priceFeed;

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress) {
        // constructor setting owner whoever deployed the contract
        //address msgSender=_msgSender();
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // function _msgSender()internal view returns (address){
    //   return msg.sender;
    // }

    function fund() public payable {
        console.log("value sent", msg.value);
        // "payable" keyword makes a function payable
        // we want to recieve ether in our wallets and we want it should be greater than 1
        // if (msg.value.getConversionRate(priceFeed) < minimumUSD) {
        //     revert FundMe__NotEnoughEth();
        // } else {}
        require(
            msg.value.getConversionRate(priceFeed) >= minimumUSD,
            "Not Enough"
        );
        addressArray.push(msg.sender); //msg.sender contains sender address
        addressToFunding[msg.sender] = msg.value; // storing the funding across the address
        // if user didn't fund minimum ether the "not enough message will be displayed"
        // and all the progress will be reverted and transaction will be cancelled
        // 'require' keyword makes sure the above condition
    }

    /*function getBitcoinPrice() public view returns (uint256){
      //website : https://docs.chain.link/docs/ethereum-addresses/
      //btc/usd chainlink rinkby test net address:	0xECe365B379E1dD183B20fc5f022230C044d51404
      AggregatorV3Interface obj = AggregatorV3Interface(0xECe365B379E1dD183B20fc5f022230C044d51404);
      (,int price,,,)=obj.latestRoundData();
      return uint256(price);
    }

    function getBTCConversion(uint256 btcAmount) public view returns(uint){
      uint256 btcPrice=getBitcoinPrice();
      uint256 amountPrice=(btcAmount*btcPrice)/1e8;
      return amountPrice;
    }
  */
    function withDraw() public onlyOwner {
        // using only owner as modifier

        for (uint i = 0; i < addressArray.length; i++) {
            addressToFunding[addressArray[i]] = 0;
        }
        addressArray = new address[](0);

        //transfering native token to contract creator
        //3 ways
        //transfer
        //send
        //call
        //send
        // reference : https://solidity-by-example.org/sending-ether
        // payable(msg.sender).send(address(this).balance);
        // //transfer
        // bool flag=payable(msg.sender).transfer(address(this).balance);
        // require(flag,"Error");
        //call
        (bool flag2, ) = payable(msg.sender).call{value: address(this).balance}(
            ""
        );
        require(flag2, "Error aa gia");
    }

    function cheaperWithDraw() public onlyOwner {
        address[] memory funders = addressArray;
        //uint256 size = funders.length;
        for (uint i = 0; i < funders.length; i++) {
            addressToFunding[funders[i]] = 0;
        }
        // funders = new address[](0);
        addressArray = new address[](0);
        //mapings can't be used in memory
        (bool flag2, ) = payable(msg.sender).call{value: address(this).balance}(
            ""
        );
        require(flag2, "Error aa gia");
    }

    /*
     any function using this modifier will first check if call is made by contract owner if yes
     then it will execute the contract 
    
    */

    //receive() and fallback()
    /*
     what if someone sends your contract some eth without calling fund function
     and you want to record everyone who funded to award them
     in such scenario
     if eth or any native token is sent receive() special function will be triggered
     receive() external payable{
       }
       and what if someone sends some data to cater that fallback() is used
       fallback() external payable{
       }
    */
    // receive() external payable {
    //     fund();
    // }

    // fallback() external payable {
    //     fund();
    // }
}
