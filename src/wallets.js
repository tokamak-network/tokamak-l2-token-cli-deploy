const ethers = require("ethers");

async function getWallets (l1Url, l2Url, pk) {
    let wallets = {
        l1Wallet: null,
        l2Wallet: null
    }

    if (pk != null) {
        if (l1Url != null) wallets.l1Wallet = new ethers.Wallet(pk, new ethers.providers.JsonRpcProvider(l1Url))
        if (l2Url != null) wallets.l2Wallet = new ethers.Wallet(pk, new ethers.providers.JsonRpcProvider(l2Url))
    }
    return wallets;
}

module.exports ={
    getWallets
}