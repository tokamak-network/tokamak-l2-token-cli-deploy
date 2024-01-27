const ethers = require("ethers");
const { Wallet } = require("ethers");
const artifacts = {
    OptimismMintableERC20Factory: require("../../artifacts-deploy/optimism/contracts/OptimismMintableERC20Factory.json"),
    OptimismMintableERC20: require("../../artifacts-deploy/optimism/contracts/OptimismMintableERC20.json"),
  };


const buildCreate2Address = (factory, _remoteToken, _name, _symbol, _decimals, byteCode) => {

    const salt = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
        ["address","string","string","uint8"],[_remoteToken,_name,_symbol,_decimals]));

    return `0x${ethers.utils
        .keccak256(
        `0x${['ff', factory, salt, ethers.utils.keccak256(byteCode)]
            .map((x) => x.replace(/0x/, ''))
            .join('')}`,
        )
    .slice(-40)}`.toLowerCase()
}

class L2ERC20Deployer {

    deployer;
    constructor(deployer) {
      this.deployer = deployer;
    }

    static async deployL2ERC20(
        actor,
        l1TokenAddress,
        l2TokenName,
        l2TokenSymbol,
        l2TokenDecimals
      ){
        const StandardBridge = "0x4200000000000000000000000000000000000010"
        const OptimismMintableERC20Factory = "0x4200000000000000000000000000000000000012"

        // const createdAddress = buildCreate2Address(
        //     StandardBridge,
        //     l1TokenAddress,
        //     l2TokenName,
        //     l2TokenSymbol,
        //     l2TokenDecimals,
        //     artifacts.OptimismMintableERC20.bytecode.object
        // )
        // console.log('createdAddress', createdAddress)

        const optimismMintableERC20Factory = new ethers.Contract(
          OptimismMintableERC20Factory,
          artifacts.OptimismMintableERC20Factory.abi,
          actor)

        const receipt = await (await optimismMintableERC20Factory.createOptimismMintableERC20WithDecimals(
          l1TokenAddress, l2TokenName, l2TokenSymbol, l2TokenDecimals
        )).wait();

        const topic = optimismMintableERC20Factory.interface.getEventTopic('StandardL2TokenCreated');
        const log = receipt.logs.find(x => x.topics.indexOf(topic) >= 0);
        const deployedEvent = optimismMintableERC20Factory.interface.parseLog(log);
        const L1Token = deployedEvent.args.remoteToken;
        const L2Token = deployedEvent.args.localToken;

        return {
          L1Token,
          L2Token
        };
    }
}

module.exports ={
    L2ERC20Deployer
}