export async function getPrice() {
  const coins = ["bitcoin", "ethereum", "tether", "bridged-usdc"].join(",")

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coins}&vs_currencies=usd`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("failed to fetch price")
  }

  const data = await res.json()
  return {
    BTC: data.bitcoin.usd as number,
    ETH: data.ethereum.usd as number,
    USDT: data.tether.usd as number,
    USDC: data["bridged-usdc"].usd as number,
    TSTLPX: 0.0,
    VAST: 0.0,
  }
}
