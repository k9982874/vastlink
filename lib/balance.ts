import { ethers } from "ethers"

const erc20Abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
]

export default async function getBalance(
  asset: string,
  wallet: {
    rpcUrl?: string
    contractAddress?: string
    walletAddress: string
  }
): Promise<number> {
  if (asset === "BTC") {
    return getBtcBalance(wallet.walletAddress)
  }
  if (asset === "ETH") {
    return getEthBalance(wallet.walletAddress)
  }
  if (asset === "TSTLPX") {
    return getTstlpxBalance(wallet.walletAddress)
  }
  return getErc20Balance(
    wallet.rpcUrl!,
    wallet.contractAddress!,
    wallet.walletAddress
  )
}

export async function getBtcBalance(walletAddress: string) {
  const url = `https://blockstream.info/testnet/api/address/${walletAddress}/utxo`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("failed to fetch btc balance")
  }

  const data = await res.json()

  return data[0].value / 100000000
}

export async function getEthBalance(walletAddress: string) {
  const rpcUrl = "https://ethereum-sepolia-rpc.publicnode.com"

  const provider = new ethers.JsonRpcProvider(rpcUrl)

  const balanceInWei = await provider.getBalance(walletAddress)

  const balanceInEth = ethers.formatEther(balanceInWei)

  return parseFloat(balanceInEth)
}

export async function getErc20Balance(
  rpcUrl: string,
  contractAddress: string,
  walletAddress: string
) {
  const provider = new ethers.JsonRpcProvider(rpcUrl)

  const contract = new ethers.Contract(contractAddress, erc20Abi, provider)

  const balance = await contract.balanceOf(walletAddress)

  const decimals = await contract.decimals()

  const formattedBalance = ethers.formatUnits(balance, decimals)

  return parseFloat(formattedBalance)
}

export async function getTstlpxBalance(walletAddress: string) {
  const rpcUrl = "https://yellowstone-rpc.litprotocol.com/"
  const provider = new ethers.JsonRpcProvider(rpcUrl)

  const balanceWei = await provider.getBalance(walletAddress)

  const balanceTstLPX = ethers.formatUnits(balanceWei, 18)

  return parseFloat(balanceTstLPX)
}
