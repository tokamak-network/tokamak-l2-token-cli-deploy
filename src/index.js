#!/usr/bin/env node

const { Command } = require('commander');
const { getWallets } = require("./wallets");
const { L2ERC20Deployer } = require("./deployer/L2ERC20Deployer.js")
const { UsdcBridgeDeployer } = require("./deployer/UsdcBridgeDeployer.js")

async function main() {
    const command = process.argv[2]
    const program = new Command();
    program
    .name('cli')
    .description('CLI to deploy L2 tokens and usdc bridge')
    .usage("[command] [options]")

    if (command == undefined || command == "help") {
        console.log(`
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
    `);


    } else if (command == "l2-erc20-deploy") {
        program
            .description('Deploy L2 ERC20 ')
            .argument('[options]', 'options')
            .requiredOption('-r2, --rpc2 <rpc1>', '*L2 rpc url')
            .requiredOption('-l1t, --l1token <l1token>', '*L1 token address')
            .requiredOption('-n, --name <name>', '*token name')
            .requiredOption('-s, --symbol <symbol>', '*token symbol')
            .option('-d, --decimals <decimals>', 'token decimals', 18)
            .requiredOption('-p, --pk <pk>', '*private key of wallet')
            .parse();

        // console.log(program.opts().rpc2);
        // console.log(program.opts().l1token);
        // console.log(program.opts().name);
        // console.log(program.opts().symbol);
        // console.log(program.opts().decimals);

        const wallets = await getWallets(null, program.opts().rpc2, program.opts().pk);

        const tokens = await L2ERC20Deployer.deployL2ERC20(
            wallets.l2Wallet,
            program.opts().l1token,
            program.opts().name,
            program.opts().symbol,
            program.opts().decimals
        )
        console.log(tokens)

    } else if (command == "l2-usdt-deploy") {
        program
            .description('Deploy L2 USDT ')
            .argument('[options]', 'options')
            .requiredOption('-r2, --rpc2 <rpc1>', '*L2 rpc url')
            .requiredOption('-l1t, --l1token <l1token>', '*L1 token address')
            .requiredOption('-p, --pk <pk>', '*private key of wallet')
            .parse();

        // console.log(program.opts().rpc2);
        // console.log(program.opts().l1token);

        const wallets = await getWallets(null, program.opts().rpc2, program.opts().pk);

        const contracts = await L2ERC20Deployer.deployUSDT(
            wallets.l2Wallet,
            program.opts().l1token
        )

        const table = {}
        for (const item of Object.keys(contracts)) {
            table[item] = contracts[item].address;
        }

        console.info(table);

    } else if (command == "l1-usdc-bridge-deploy") {
        program
            .description('Deploy L1 usdc bridge ')
            .argument('[options]', 'options')
            .requiredOption('-r1, --rpc1 <rpc1>', '*L1 rpc url')
            .option('-a, --adminAddress <adminAddress>', 'admin address')
            .requiredOption('-p, --pk <pk>', '*private key of wallet')
            .parse();

        // console.log(program.opts().rpc1);
        // console.log(program.opts().adminAddress);
        // console.log(program.opts().pk);

        const wallets = await getWallets(program.opts().rpc1, null, program.opts().pk);
        const contracts = await UsdcBridgeDeployer.deployL1Bridge(wallets.l1Wallet)

        if (program.opts().adminAddress != null && program.opts().adminAddress != undefined && program.opts().adminAddress.length == 42
            && program.opts().adminAddress.toLocaleLowerCase() != wallets.l1Wallet.address.toLocaleLowerCase()) {
                await (await contracts.L1UsdcBridgeProxy.connect(wallets.l1Wallet).proxyChangeOwner(program.opts().adminAddress)).wait()
        }

        const table = {}
        for (const item of Object.keys(contracts)) {
            table[item] = contracts[item].address;
        }
        console.info(table);

    } else if (command == "l2-usdc-and-bridge-deploy") {
        program
            .description('Deploy L2 USDC and usdc bridge ')
            .argument('[options]', 'options')
            .requiredOption('-r2, --rpc2 <rpc2>', '*L2 rpc url')
            .requiredOption('-n, --networkName <networkName>', '*network name')
            .requiredOption('-m1, --l1CrossDomainMessenger <l1CrossDomainMessenger>', '*l1CrossDomainMessenger address')
            .requiredOption('-l1u, --l1Usdc <l1Usdc>', '*l1 usdc address')
            .requiredOption('-l1ub, --l1UsdcBridge <l1UsdcBridge>', '*L1 usdc bridge address')
            .requiredOption('-l2ua, --l2UsdcAdmin <l2UsdcAdmin>', '*L2 USDC owner address')
            .requiredOption('-l2uma, --l2UsdcMinterAdmin <l2UsdcMinterAdmin>', '*L2 USDC MasterMinter address ')
            .requiredOption('-l2upa, --l2UsdcProxyAdmin <l2UsdcProxyAdmin>', '*L2 USDC Proxy address ')
            .requiredOption('-p, --pk <pk>', '*private key of wallet')
            .parse();

        // console.log(program.opts().rpc2);
        // console.log(program.opts().networkName);
        // console.log(program.opts().l1CrossDomainMessenger);
        // console.log(program.opts().l1Usdc);
        // console.log(program.opts().l1UsdcBridge);
        // console.log(program.opts().adminAddress);
        // console.log(program.opts().pk);

        const wallets = await getWallets(null, program.opts().rpc2, program.opts().pk);

        if (program.opts().l2UsdcAdmin == wallets.l2Wallet.address) {
            console.log('l2UsdcAdmin must be different from deployer.')
            return;
        }

        if (program.opts().l2UsdcAdmin == program.opts().l2UsdcProxyAdmin) {
            console.log('l2UsdcAdmin must be different from l2UsdcProxyAdmin.')
            return;
        }


        console.log("deploy L2 Bridge ..")
        const bridgeContracts = await UsdcBridgeDeployer.deployL2Bridge(wallets.l2Wallet);

        console.log("deploy Bridged USDC ..")
        const usdcContracts = await UsdcBridgeDeployer.deployBridgedUsdc(
            wallets.l2Wallet,
            program.opts().l2UsdcAdmin,
            program.opts().networkName,
            wallets.l2Wallet.address,
            null, null, null, null
        );

        console.log("set L2 Bridge ..")
        const L2CrossDomainMessenger = "0x4200000000000000000000000000000000000007"
        await (await bridgeContracts.L2UsdcBridgeProxy.setAddress(
            L2CrossDomainMessenger,
            program.opts().l1UsdcBridge,
            program.opts().l1Usdc,
            usdcContracts.FiatTokenProxy.address,
            usdcContracts.MasterMinter.address
          )
        ).wait()

        console.log("MasterMinter configureController ..")
        await (await usdcContracts.MasterMinter.configureController(
            bridgeContracts.L2UsdcBridgeProxy.address,
            bridgeContracts.L2UsdcBridgeProxy.address
        )).wait()

        // let proxyAdmin = await usdcContracts.FiatTokenProxy.admin()
        // console.log("FiatTokenProxy.admin ", proxyAdmin)
        // console.log("program.opts().l2UsdcProxyAdmin ", program.opts().l2UsdcProxyAdmin)
        // if (program.opts().l2UsdcProxyAdmin !=null
        //     && program.opts().l2UsdcProxyAdmin != '0x0000000000000000000000000000000000000000'
        //     && program.opts().l2UsdcProxyAdmin.length == 42
        //     && proxyAdmin.toLocaleLowerCase() != program.opts().l2UsdcProxyAdmin.toLocaleLowerCase()
        // ){
        //     console.log("FiatTokenProxy(USDC) Proxy changeAdmin ..")
        //     await (await usdcContracts.FiatTokenProxy.changeAdmin(program.opts().l2UsdcProxyAdmin)).wait()
        // }

        let masterMinterOwner = await usdcContracts.MasterMinter.owner()
        if (program.opts().l2UsdcMinterAdmin !=null
            && program.opts().l2UsdcMinterAdmin != '0x0000000000000000000000000000000000000000'
            && program.opts().l2UsdcMinterAdmin.length == 42
            && masterMinterOwner.toLocaleLowerCase() != program.opts().l2UsdcMinterAdmin.toLocaleLowerCase()
        ){
            console.log("MasterMinter transferOwnership ..")
            await (await usdcContracts.MasterMinter.transferOwnership(program.opts().l2UsdcMinterAdmin)).wait()
        }

        const table = {}
        for (const item of Object.keys(bridgeContracts)) {
            table[item] = bridgeContracts[item].address;
        }
        for (const item of Object.keys(usdcContracts)) {
            table[item] = usdcContracts[item].address;
        }
        console.info(table);

    } else if (command == "l1-usdc-bridge-set") {
        program
            .description('Set inforamtion of L1 usdc bridge ')
            .argument('[options]', 'options')
            .requiredOption('-r1, --rpc1 <rpc1>', '*L1 rpc url')
            .requiredOption('-m1, --l1CrossDomainMessenger <l1CrossDomainMessenger>', '*l1CrossDomainMessenger address')
            .requiredOption('-l1u, --l1Usdc <l1Usdc>', '*L1 usdc address')
            .requiredOption('-l1ub, --l1UsdcBridge <l1UsdcBridge>', '*L1 usdc bridge address')
            .requiredOption('-l2u, --l2Usdc <l2Usdc>', '*L2 usdc address')
            .requiredOption('-l2ub, --l2UsdcBridge <l2UsdcBridge>', '*L2 usdc bridge address')
            .requiredOption('-p, --pk <pk>', '*private key of wallet')
            .parse();

        // console.log(program.opts().rpc1);
        // console.log(program.opts().l1CrossDomainMessenger);
        // console.log(program.opts().l1Usdc);
        // console.log(program.opts().l1UsdcBridge);
        // console.log(program.opts().l2Usdc);
        // console.log(program.opts().l2UsdcBridge);
        // console.log(program.opts().pk);

        const wallets = await getWallets(program.opts().rpc1, null, program.opts().pk);

        const contract = await UsdcBridgeDeployer.setL1Bridge(
            wallets.l1Wallet,
            program.opts().l1CrossDomainMessenger,
            program.opts().l1Usdc,
            program.opts().l1UsdcBridge,
            program.opts().l2Usdc,
            program.opts().l2UsdcBridge
            );

        console.info('l1-usdc-bridge-set  done')


    } else if (command == "l2-usdc-l1-l2-bridge-deploy") {
            program
                .description('Deploy L2 USDC and L1/L2 usdc bridge ')
                .argument('[options]', 'options')
                .requiredOption('-r1, --rpc1 <rpc1>', '*L1 rpc url')
                .requiredOption('-r2, --rpc2 <rpc2>', '*L2 rpc url')
                .requiredOption('-n, --networkName <networkName>', '*network name')
                .requiredOption('-m1, --l1CrossDomainMessenger <l1CrossDomainMessenger>', '*l1CrossDomainMessenger address')
                .requiredOption('-l1u, --l1Usdc <l1Usdc>', '*l1 usdc address')
                .option('-l1ba, --l1bridgeAddress <l1bridgeAddress>', 'admin address for L1 Bridge')
                .requiredOption('-l2ua, --l2UsdcAdmin <l2UsdcAdmin>', '*L2 USDC owner address')
                .requiredOption('-l2uma, --l2UsdcMinterAdmin <l2UsdcMinterAdmin>', '*L2 USDC MasterMinter address ')
                .requiredOption('-l2upa, --l2UsdcProxyAdmin <l2UsdcProxyAdmin>', '*L2 USDC Proxy address ')
                .requiredOption('-p, --pk <pk>', '*private key of wallet')
                .parse();

            // console.log(program.opts().rpc1);
            // console.log(program.opts().rpc2);
            // console.log(program.opts().networkName);
            // console.log(program.opts().l1CrossDomainMessenger);
            // console.log(program.opts().l1Usdc);
            // console.log(program.opts().l1bridgeAddress);
            // console.log(program.opts().l2UsdcAdmin);
            // console.log(program.opts().l2UsdcMinterAdmin);
            // console.log(program.opts().pk);

            const wallets = await getWallets(program.opts().rpc1, program.opts().rpc2, program.opts().pk);
            if (program.opts().l2UsdcAdmin == wallets.l2Wallet.address) {
                console.log('Admin address for L2 USDC must be different from deployer.')
                return;
            }
            console.log("deploy L1 Bridge ..")
            const l1Contracts = await UsdcBridgeDeployer.deployL1Bridge(wallets.l1Wallet)

            console.log("deploy L2 Bridge ..")
            const bridgeContracts = await UsdcBridgeDeployer.deployL2Bridge(wallets.l2Wallet);

            console.log("deploy Bridged USDC ..")
            const usdcContracts = await UsdcBridgeDeployer.deployBridgedUsdc(
                wallets.l2Wallet,
                program.opts().l2UsdcAdmin,
                program.opts().networkName,
                wallets.l2Wallet.address,
                null, null, null, null
            );

            console.log("set L2 Bridge ..")
            const L2CrossDomainMessenger = "0x4200000000000000000000000000000000000007"
            await (await bridgeContracts.L2UsdcBridgeProxy.setAddress(
                L2CrossDomainMessenger,
                l1Contracts.L1UsdcBridgeProxy.address,
                program.opts().l1Usdc,
                usdcContracts.FiatTokenProxy.address,
                usdcContracts.MasterMinter.address
              )
            ).wait()

            console.log("MasterMinter configureController ..")
            await (await usdcContracts.MasterMinter.configureController(
                bridgeContracts.L2UsdcBridgeProxy.address,
                bridgeContracts.L2UsdcBridgeProxy.address
            )).wait()

            // let proxyAdmin = await usdcContracts.FiatTokenProxy.admin()
            // if (program.opts().l2UsdcProxyAdmin !=null
            //     && program.opts().l2UsdcProxyAdmin != '0x0000000000000000000000000000000000000000'
            //     && program.opts().l2UsdcProxyAdmin.length == 42
            //     && proxyAdmin.toLocaleLowerCase() != program.opts().l2UsdcProxyAdmin.toLocaleLowerCase()
            // ){
            //     console.log("FiatTokenProxy(USDC) Proxy changeAdmin ..")
            //     await (await usdcContracts.FiatTokenProxy.changeAdmin(program.opts().l2UsdcProxyAdmin)).wait()
            // }

            let masterMinterOwner = await usdcContracts.MasterMinter.owner()
            if (program.opts().l2UsdcMinterAdmin !=null
                && program.opts().l2UsdcMinterAdmin != '0x0000000000000000000000000000000000000000'
                && program.opts().l2UsdcMinterAdmin.length == 42
                && masterMinterOwner.toLocaleLowerCase() != program.opts().l2UsdcMinterAdmin.toLocaleLowerCase()
            ){
                console.log("MasterMinter transferOwnership ..")
                await (await usdcContracts.MasterMinter.transferOwnership(program.opts().l2UsdcMinterAdmin)).wait()
            }

            console.log("set L1 Bridge ..")
            const contract = await UsdcBridgeDeployer.setL1Bridge(
                wallets.l1Wallet,
                program.opts().l1CrossDomainMessenger,
                program.opts().l1Usdc,
                l1Contracts.L1UsdcBridgeProxy.address,
                usdcContracts.FiatTokenProxy.address,
                bridgeContracts.L2UsdcBridgeProxy.address
                );

            if (program.opts().l1bridgeAddress != null && program.opts().l1bridgeAddress != undefined && program.opts().l1bridgeAddress.length == 42
                && program.opts().l1bridgeAddress.toLocaleLowerCase() != wallets.l1Wallet.address.toLocaleLowerCase()) {
                    console.log("L1 Bridge proxyChangeOwner ..")
                    await (await l1Contracts.L1UsdcBridgeProxy.connect(wallets.l1Wallet).proxyChangeOwner(program.opts().l1bridgeAddress)).wait()
            }

            const table = {}
            for (const item of Object.keys(usdcContracts)) {
                table[item] = usdcContracts[item].address;
            }
            for (const item of Object.keys(l1Contracts)) {
                table[item] = l1Contracts[item].address;
            }
            for (const item of Object.keys(bridgeContracts)) {
                table[item] = bridgeContracts[item].address;
            }
            console.info(table);
    } else {
        console.log("co command")
    }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

