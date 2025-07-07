const wallet: {
  [key: string]: {
    rpcUrl?: string
    contractAddress?: string
    walletAddress: string
  }
} = {
  BTC: {
    walletAddress: "n3kB18Zk3mGXhWsy6Q6ftAu8LdNXjmDp8S",
  },
  ETH: {
    walletAddress: "0xec6715f2073c7c846c447aA14A67ebb0b0f806C0",
  },
  USDT: {
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
    contractAddress: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06",
    walletAddress: "0x6f1fEb0f30f9dd7F75cAA2903350dE7F6CF33a01",
  },
  USDC: {
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
    contractAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    walletAddress: "0x6f1fEb0f30f9dd7F75cAA2903350dE7F6CF33a01",
  },
  TSTLPX: {
    walletAddress: "0xCa3c64e7D8cA743aeD2B2d20DCA3233f400710E2",
  },
  VAST: {
    rpcUrl: "https://sepolia.base.org",
    contractAddress: "0x64ea10a5e10c820876697793acf25107ec83c6c5",
    walletAddress: "0x6f1fEb0f30f9dd7F75cAA2903350dE7F6CF33a01",
  },
}

export default wallet
