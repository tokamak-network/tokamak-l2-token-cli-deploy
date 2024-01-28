# Deploy using CLI (Command Line Interface )

There are two ways to deploy L2 USDC.

- First method: Using the ***l2-usdc-l1-l2-bridge-deploy*** command, you can deploy L2 USDC, L1 usdc bridge, and L2 usdt bridge at once.
- Second method: You can deploy by executing the **l1-usdc-bridge-deploy, l2-usdc-and-bridge-deploy, and l1-usdc-bridge-set** commands in order.

Of the two methods above, we recommend the first method.

## Install

`npm install @tokamak-network/tokamak-l2-token-cli-deploy`

`npm i -g`

run `cli` or `cli help` and you should see:

```jsx
Usage: cli [command] [options]

Command:
  l2-erc20-deploy             [options]    Deploy ERC20 on L2
  l2-usdt-deploy              [options]    Deploy USDT on L2
  l1-usdc-bridge-deploy       [options]    Deploy L1 usdc bridge
  l1-usdc-bridge-set          [options]    Set information of L1 usdc bridge
  l2-usdc-and-bridge-deploy   [options]    Deploy L2 USDC and L2 usdc bridge
  l2-usdc-l1-l2-bridge-deploy [options]    Deploy L2 USDC and L1/L2 usdc bridge
  help    	                             Display commands

To want to know options of command: use 'cli [command] -h'
```

## Deploy ERC20

run `cli l2-erc20-deploy -h`

****and you should see:

```jsx
Usage: cli [command] [options]

Deploy L2 ERC20

Arguments:
  options                    options

Options:
  -r2, --rpc2 <rpc1>         *L2 rpc url
  -l1t, --l1token <l1token>  *L1 token address
  -n, --name <name>          *token name
  -s, --symbol <symbol>      *token symbol
  -d, --decimals <decimals>  token decimals (default: 18)
  -p, --pk <pk>              *private key of wallet
  -h, --help                 display help for command
```

**example**

To test on localhost, run local node with forking titan-sepolia-test

> `npx hardhat node --fork https://rpc.titan-sepolia-test.tokamak.network/`
>

after check the L1 token information

- L1 : sepolia
- L1 TOS : 0xff3ef745d9878afe5934ff0b130868afddbc58e8

run

> `cli l2-erc20-deploy -r2 http://127.0.0.1:8545/ -l1t 0xff3ef745d9878afe5934ff0b130868afddbc58e8 -n TONStarter -s TOS -p 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
>

you can get L2 ERC20 address.


<aside>
💡 ***additional task:***

If a token with the same address has already been created, an error will occur, so do not run it, but display a message that it has already been created.

</aside>

## Deploy USDT

run `cli l2-usdt-deploy -h`

****and you should see:

```jsx
Usage: cli [command] [options]

Deploy L2 USDT

Arguments:
  options                    options

Options:
  -r2, --rpc2 <rpc1>         *L2 rpc url
  -l1t, --l1token <l1token>  *L1 token address
  -p, --pk <pk>              *private key of wallet
  -h, --help                 display help for command
```

**example**

To test on localhost, run local node with forking titan-sepolia-test

> `npx hardhat node --fork https://rpc.titan-sepolia-test.tokamak.network/`
>

after check the L1 token information

- L1 : sepolia
- L1 USDT :  0x42d3b260c761cD5da022dB56Fe2F89c4A909b04A

run

> `cli l2-usdt-deploy -r2 http://127.0.0.1:8545/ -l1t 0x42d3b260c761cD5da022dB56Fe2F89c4A909b04A  -p 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
>

you can get L2 USDT address.


to verify

> git clone https://github.com/tokamak-network/tokamak-testnet-token.git
>

> touch .env
>
>
> ```jsx
> ETH_NODE_URI_TITAN=https://rpc.titan.tokamak.network
> ETH_NODE_URI_TITAN_GOERLI=https://rpc.titan-goerli.tokamak.network
> ETH_NODE_URI_TITAN_SEPOLIA=https://rpc.titan-sepolia-test.tokamak.network
> ETH_NODE_URI_OP_SEPOLIA=https://sepolia.optimism.io
> ETHERSCAN_API_KEY=
> INFURA_API_KEY=
> OPTIMISTIC_ETHERSCAN_API_KEY=
> PRIVATE_KEY=
> ```
>

> npm install
>

> npx hardhat compile
>

> npx hardhat verify {deployed usdt address} {l1token} —network {networkanme}
>

## Deploy L2 USDC  and L1/L2 usdc bridge at once

  run `cli l2-usdc-l1-l2-bridge-deploy -h`

****and you should see:

```jsx
Usage: cli [command] [options]

Deploy L2 USDC and L1/L2 usdc bridge

Arguments:
  options                                                 options

Options:
-r1, --rpc1 <rpc1>                                      *L1 rpc url
-r2, --rpc2 <rpc2>                                      *L2 rpc url
-n, --networkName <networkName>                         *network name
-m1, --l1CrossDomainMessenger <l1CrossDomainMessenger>  *l1CrossDomainMessenger address
-l1u, --l1Usdc <l1Usdc>                                 *l1 usdc address
-l1ba, --l1bridgeAddress <l1bridgeAddress>              admin address for L1 Bridge
-l2ua, --l2UsdcAdmin <l2UsdcAdmin>                      *L2 USDC owner address
-l2uma, --l2UsdcMinterAdmin <l2UsdcMinterAdmin>         *L2 USDC MasterMinter address
-l2upa, --l2UsdcProxyAdmin <l2UsdcProxyAdmin>           *L2 USDC Proxy address
-p, --pk <pk>                                           *private key of wallet
-h, --help                                              display help for command
```

<aside>
💡 ***notice :***

l2UsdcAdmin must be different from deployer.

l2UsdcAdmin must be different from l2UsdcProxyAdmin.

</aside>

<aside>
💡 ***additional task:***

 transfer admin of USDC proxy using FiatTokenProxy.changeAdmin (l2UsdcProxyAdmin )

</aside>

**example**

after check the L1 token information

- L1 : sepolia
- L2 : New Titan sepolia testnet
- L1 rpc :   https://sepolia.infura.io/v3/e4b3b2781dd34bc4817a1221b8a3b50a
- L2 rpc : [`https://rpc.titan-sepolia-test.tokamak.network/`](https://rpc.titan-sepolia-test.tokamak.network/)
- L1 USDC (sepolia) :  0x693a591A27750eED2A0e14BC73bB1F313116a1cb
- L1 CrossDomainMessenger  (sepolia): 0xa94B847AAc9F00f10dA2F5c476408Fd5477D7d49
- admin2 address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

**run**

> `cli l2-usdc-l1-l2-bridge-deploy -r1 https://sepolia.infura.io/v3/e4b3b2781dd34bc4817a1221b8a3b50a -r2 https://rpc.titan-sepolia-test.tokamak.network/ -n 'New Titan' -m1 0xa94B847AAc9F00f10dA2F5c476408Fd5477D7d49 -l1u 0x693a591A27750eED2A0e14BC73bB1F313116a1cb -a2 0xc1eba383D94c6021160042491A5dfaF1d82694E6 -p a30b1ac9c594193766647e2fca84bb78d545ca16fbb9518f4ad9c79ed8b60768`
>

```jsx
{
  SignatureChecker: '0xe86fCf5213C785AcF9a8BFfEeDEfA9a2199f7Da6',
  FiatTokenV2_2: '0x9828935d1778D82B1120f592f77810244AeecA70',
  **FiatTokenProxy(L2 USDC): '0x68808D5379763fA07FDb53c707100e1930900F5c',**
  MasterMinter: '0xe05d62c21f4bba610F411A6F9BddF63cffb43B63',
  L1UsdcBridge: '0x5d5644cc85f8A0D43a059B79374B47eeE1914077',
  **L1UsdcBridgeProxy: '0xE7DaA0DB3F2114099D7728e1075Ec70c1A602071',**
  L2UsdcBridge: '0x68c1F9620aeC7F2913430aD6daC1bb16D8444F00',
  **L2UsdcBridgeProxy: '0x3d15587A41851749982CDcB2880B0D3C380F84c9'**
}
```

**verify**

- to verify L2 USDC

    git clone https://github.com/tokamak-network/tokamak-usdc.git

    yarn

    touch .env

    ```jsx
    MAINNET_RPC_URL=
    SEPOLIA_RPC_URL=
    POLYGON_MAINNET_RPC_URL=
    PRIVATE_KEY=
    PRIVATE_KEY2=
    ETHERSCAN_API_KEY=
    COINMARKETCAP_API_KEY=
    ETH_NODE_URI_TITAN_SEPOLIA=https://rpc.titan-sepolia-test.tokamak.network
    ```

    > SignatureChecker
    >
    >
    > `npx hardhat verify 0xe86fCf5213C785AcF9a8BFfEeDEfA9a2199f7Da6 --network titansepolia`
    >

    > FiatTokenV2_2
    >
    >
    > `npx hardhat verify 0x9828935d1778D82B1120f592f77810244AeecA70 --contract contracts/v2/FiatTokenV2_2.sol:FiatTokenV2_2 --libraries ./deploy-libraries/SignatureChecker.js --network titansepolia`
    >

    > **FiatTokenProxy(L2 USDC)**
    >
    >
    > `npx hardhat verify 0x68808D5379763fA07FDb53c707100e1930900F5c --contract contracts/v1/FiatTokenProxy.sol:FiatTokenProxy 0x9828935d1778D82B1120f592f77810244AeecA70 --network titansepolia`
    >

    > MasterMinter
    >
    >
    > `npx hardhat verify 0xe05d62c21f4bba610F411A6F9BddF63cffb43B63 --contract contracts/minting/MasterMinter.sol:MasterMinter 0x68808D5379763fA07FDb53c707100e1930900F5c --network titansepolia`
    >
- to verify UsdcBridge

    git clone https://github.com/tokamak-network/titan-usdc-bridge.git

    npm install

    npx hardhat compile

    npx hardhat verify 0x5d5644cc85f8A0D43a059B79374B47eeE1914077 --network sepolia

    npx hardhat verify 0x68c1F9620aeC7F2913430aD6daC1bb16D8444F00 --network titansepolia

    npx hardhat verify **0x3d15587A41851749982CDcB2880B0D3C380F84c9** 0x68c1F9620aeC7F2913430aD6daC1bb16D8444F00 0x757DE9c340c556b56f62eFaE859Da5e08BAAE7A2 0x --network titansepolia


## Deploy L1 usdc bridge

Deploy the L1 usdc bridge, it don’t set necessary storages in deployed L1 usdc bridge contract.   you need to set using *l1-usdc-bridge-set* command after.

  run `cli l1-usdc-bridge-deploy -h`

****and you should see:

```jsx
Usage: cli [command] [options]

Deploy L1 usdc bridge

Arguments:
  options                            options

Options:
  -r1, --rpc1 <rpc1>                 *L1 rpc url
  -a, --adminAddress <adminAddress>  admin address
  -p, --pk <pk>                      *private key of wallet
  -h, --help                         display help for command
```

**example**

To test on localhost, run local node with forking sepolia

> `npx hardhat node --fork https://ethereum-sepolia.publicnode.com`
>

run

> `cli l1-usdc-bridge-deploy -r1 http://127.0.0.1:8545/ -p 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
>




## Deploy L2 USDC and usdc bridge

  run `cli l2-usdc-and-bridge-deploy -h`

****and you should see:

```jsx
Usage: cli [command] [options]

Deploy L2 USDC and usdc bridge

Arguments:
  options                                                 options

Options:
-r2, --rpc2 <rpc2>                                      *L2 rpc url
-n, --networkName <networkName>                         *network name
-m1, --l1CrossDomainMessenger <l1CrossDomainMessenger>  *l1CrossDomainMessenger address
-l1u, --l1Usdc <l1Usdc>                                 *l1 usdc address
-l1ub, --l1UsdcBridge <l1UsdcBridge>                    *L1 usdc bridge address
-l2ua, --l2UsdcAdmin <l2UsdcAdmin>                      *L2 USDC owner address
-l2uma, --l2UsdcMinterAdmin <l2UsdcMinterAdmin>         *L2 USDC MasterMinter address
-l2upa, --l2UsdcProxyAdmin <l2UsdcProxyAdmin>           *L2 USDC Proxy address
-p, --pk <pk>                                           *private key of wallet
-h, --help                                              display help for command
```

<aside>
💡 ***notice :***

l2UsdcAdmin must be different from deployer.

l2UsdcAdmin must be different from l2UsdcProxyAdmin.

</aside>

<aside>
💡 ***additional task:***

 transfer admin of USDC proxy using FiatTokenProxy.changeAdmin (l2UsdcProxyAdmin )

</aside>

for **example**

To test on localhost, run local node with forking sepolia

> `npx hardhat node --fork https://rpc.titan-sepolia-test.tokamak.network/`
>

after check the L1 information

- L1 : sepolia
- L1 USDC (sepolia) :  0x693a591A27750eED2A0e14BC73bB1F313116a1cb
- L1 usdc bridge (at example 2) :  0x6e27e1aC608C2E4bb716362c6DF34ef3dFE4BE51
- L1 CrossDomainMessenger : 0xa94B847AAc9F00f10dA2F5c476408Fd5477D7d49



**example**

l2UsdcAdmin must be different from deployer.

> `cli l2-usdc-and-bridge-deploy -r2 http://127.0.0.1:8545/ -n 'new titan' -m1 0xa94B847AAc9F00f10dA2F5c476408Fd5477D7d49 -l1u 0x693a591A27750eED2A0e14BC73bB1F313116a1cb -l1ub 0x6e27e1aC608C2E4bb716362c6DF34ef3dFE4BE51 -l2ua 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 -l2uma 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 -l2upa 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC -p 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
>


**example**

l2UsdcAdmin must be different from l2UsdcProxyAdmin.

> `cli l2-usdc-and-bridge-deploy -r2 http://127.0.0.1:8545/ -n 'new titan' -m1 0xa94B847AAc9F00f10dA2F5c476408Fd5477D7d49 -l1u 0x693a591A27750eED2A0e14BC73bB1F313116a1cb -l1ub 0x6e27e1aC608C2E4bb716362c6DF34ef3dFE4BE51 -l2ua 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 -l2uma 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 -l2upa 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 -p 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
>

![스크린샷 2024-01-27 오후 3.10.47.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e94ad917-bfd4-4e6e-a065-3f681b5fabb2/18d91d1f-1e2d-495b-acf7-b7b785e04973/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-01-27_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_3.10.47.png)

**example**

> `cli l2-usdc-and-bridge-deploy -r2 http://127.0.0.1:8545/ -n 'new titan' -m1 0xa94B847AAc9F00f10dA2F5c476408Fd5477D7d49 -l1u 0x693a591A27750eED2A0e14BC73bB1F313116a1cb -l1ub 0x6e27e1aC608C2E4bb716362c6DF34ef3dFE4BE51 -l2ua 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 -l2uma 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 -l2upa 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC -p 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
>


## Set L1 usdc bridge

Set necessary storages in deployed L1 usdc bridge contract.

  run `cli l1-usdc-bridge-set -h`

****and you should see:

```jsx
Usage: cli [command] [options]

Set inforamtion of L1 usdc bridge

Arguments:
  options                                                 options

Options:
-r1, --rpc1 <rpc1>                                      *L1 rpc url
-m1, --l1CrossDomainMessenger <l1CrossDomainMessenger>  *l1CrossDomainMessenger address
-l1u, --l1Usdc <l1Usdc>                                 *L1 usdc address
-l1ub, --l1UsdcBridge <l1UsdcBridge>                    *L1 usdc bridge address
-l2u, --l2Usdc <l2Usdc>                                 *L2 usdc address
-l2ub, --l2UsdcBridge <l2UsdcBridge>                    *L2 usdc bridge address
-p, --pk <pk>                                           *private key of wallet
-h, --help                                              display help for command
```

**example**

To test on localhost, run local node with forking sepolia

> `npx hardhat node --fork https://ethereum-sepolia.publicnode.com`
>

after check the L1 & L2 information

{
L1UsdcBridge: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
L1UsdcBridgeProxy: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
}

{
L2UsdcBridge: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
L2UsdcBridgeProxy: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
SignatureChecker: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
FiatTokenV2_2: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
FiatTokenProxy: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
MasterMinter: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e'
}

- L1 : sepolia
- L1 USDC (sepolia) :  0x693a591A27750eED2A0e14BC73bB1F313116a1cb
- L1 usdc bridge  :  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
- L1 CrossDomainMessenger : 0xa94B847AAc9F00f10dA2F5c476408Fd5477D7d49
- L2 USDC : 0x610178dA211FEF7D417bC0e6FeD39F05609AD788
- L2 usdc bridge : 0x610178dA211FEF7D417bC0e6FeD39F05609AD788

run

> `cli l1-usdc-bridge-set -r1 http://127.0.0.1:8545/ -m1 0xa94B847AAc9F00f10dA2F5c476408Fd5477D7d49  -l1u  0x693a591A27750eED2A0e14BC73bB1F313116a1cb -l1ub 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 -l2u 0x610178dA211FEF7D417bC0e6FeD39F05609AD788  -l2ub 0x610178dA211FEF7D417bC0e6FeD39F05609AD788 -p 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
>
