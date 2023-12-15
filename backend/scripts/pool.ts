const { abi: SwapRouterAbi } = require('@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json')
const ethers = require("ethers");

const contractInterface = new ethers.utils.Interface(SwapRouterAbi);

require('dotenv').config()
const provider = new ethers.providers.WebSocketProvider(process.env.WEBSOCKET_URL)

const main = async () => {
    provider.on('pending', async (hash) => {
        getTransaction(hash)
    });
};

const delay = (ms) => new Promise( resolve => setTimeout(resolve, ms))
const UNISWAP_ADDRESSES = [
    '', //sap router
    // '', // swap router 2
    // '', // universal router  
]

let txIdx = 0
const getTransaction = async (transactionHash) => {
    for (let attempt  = 1; attempt <= 3; attempt++) {
        const tx = await provider.getTransaction(transactionHash);
        if (tx) {
            if (UNISWAP_ADDRESSES.includes(tx.to)) {
                txIdx += 1
                const data = tx.data
                decodeTransaction(data, txIdx)
            }
        }

        await delay(1000);
    }
}

const decodeTransaction = (txInput, txIdx, isMulticall = false) => {
    const decodedData  = 
}


