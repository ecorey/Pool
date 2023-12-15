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
    const decodedData  = contractInterface.parseTransaction({ data: txInput })

    const functionName = decodedData.functionName
    
    const args = decodedData.args
    const params = args.params

    const data = args.data
    
    logFunctionName(functionName, txIdx, isMulticall)


    if (functionName === 'exactInputSingle') { return logExactInputSingle(params) }

    if (functionName === 'exactOutputSingle') { return logExactOutputSingle(params) }
    
    if (functionName === 'exactInput') { return logExactInput(params) }

    if (functionName === 'exactOutput') { return logExactOutput(params) }

    if (functionName === 'selfPermit') { return logSelfPermit(args) }

    if (functionName === 'refundETH') { return logRefundETH(args) }

    if (functionName === 'unwrapWETH9') { return logunwrapWETH9(args) }

    if (functionName === 'multicall') { return parseMulticall(data, txIdx) }


    console.log('ADD THIS FUNCTION:', functionName)
    console.log('decodedData', decodedData)
    

}

const logFunctionName = (functionName, txIdx, isMulticall) => {
    if(isMulticall) {
        console.log()
        console.log('---------', 'Fn: ${txIdx}', functionName);
        return
    }

    console.log()
    console.log('====================================================')
    console.log('=================', 'Tx: ${txIdx} - ${functionName}', '============' )
    console.log('=====================================================')
    
}


const parseMulticall = () => {

}

const logunwrapWETH9 = () => {
    
}

const logRefundETH = () => {
    
}

const logSelfPermit = () => {
    
}

const logExactOutput = () => {
    
}

const logExactInput = () => {
    
}

const logExactOutputSingle = () => {
    
}

const logExactInputSingle = () => {
    
}