import wallet from "@/constance/wallet"

import getBalance from "@/lib/balance"
import { getPrice } from "@/lib/price"

export async function GET() {
  const tasks = [
    getBalance("BTC", wallet.BTC),
    getBalance("ETH", wallet.ETH),
    getBalance("USDT", wallet.USDT),
    getBalance("USDC", wallet.USDC),
    getBalance("TSTLPX", wallet.TSTLPX),
    getBalance("VAST", wallet.VAST),
  ]

  const [
    btcBalance,
    ethBalance,
    usdtBalance,
    usdcBalance,
    tstlpxBalance,
    vastBalance,
  ] = await Promise.all(tasks)

  const price = await getPrice()

  const btcUSD = btcBalance * price.BTC
  const ethUSD = ethBalance * price.ETH
  const usdtUSD = usdtBalance * price.USDT
  const usdcUSD = usdcBalance * price.USDC

  return Response.json({
    code: 200,
    message: "ok",
    data: {
      details: [
        { asset: "BTC", balance: btcBalance, usd: btcUSD },
        { asset: "ETH", balance: ethBalance, usd: ethUSD },
        { asset: "USDT", balance: usdtBalance, usd: usdtUSD },
        { asset: "USDC", balance: usdcBalance, usd: usdcUSD },
        { asset: "TSTLPX", balance: tstlpxBalance, usd: "-" },
        { asset: "VAST", balance: vastBalance, usd: "-" },
      ],
      total: btcUSD + ethUSD + usdtUSD + usdcUSD,
    },
  })
}
