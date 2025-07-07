import wallet from "@/constance/wallet"
import dayjs from "dayjs"
import { NextRequest, NextResponse } from "next/server"

const defaultMetaData = [
  { asset: "BTC", network: "Bitcoin", lastId: null },
  { asset: "ETH", network: "Ethereum", lastId: null },
  { asset: "USDT", network: "Tether (ERC-20)", lastId: null },
  { asset: "USDC", network: "USD Coin (ERC-20)", lastId: null },
  {
    asset: "TSTLPX",
    network: "Chronicle Yellowstone - Lit Protocol Testnet",
    lastId: null,
  },
  { asset: "VAST", network: "Vast (ERC-20)", lastId: null },
]

async function getTransactions(
  asset: string,
  lastId: string | null
): Promise<HistoryResponse> {
  if (!Object.keys(wallet).includes(asset)) {
    throw new Error("invalid asset")
  }

  const walletAddress = wallet[asset].walletAddress

  const url =
    "https://staging.app.vastbase.vastlink.xyz/api/transaction/history" +
    `?address=${walletAddress}&tokenType=${asset}` +
    (lastId ? `&lastId=${lastId}` : "")

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("failed to fetch transations")
  }

  const data: HistoryResponse = await res.json()
  if (data.lastId === lastId) {
    data.lastId = null
    data.hasMore = false
  }

  return data
}

export async function POST(req: NextRequest) {
  let body: {
    asset: string
    lastId: string | null
  }[] = []

  try {
    body = await req.json()
  } catch {
    body = [...defaultMetaData]
  }

  try {
    const data = await Promise.all(
      body.map((v) =>
        getTransactions(v.asset.toUpperCase(), v.lastId).then((result) => ({
          asset: v.asset,
          lastId: result.lastId,
          transactions: result.transactions,
        }))
      )
    )

    const metadata = [...defaultMetaData]
    const transactions = []

    for (const item of data) {
      const pos = metadata.findIndex((v) => v.asset === item.asset)
      if (pos === -1) {
        continue
      }

      metadata[pos].lastId = item.lastId

      for (const t of item.transactions) {
        transactions.push({
          asset: metadata[pos].asset,
          network: metadata[pos].network,
          ...t,
        })
      }
    }

    transactions.sort((a, b) => {
      const d1 = dayjs(a.timestamp)
      const d2 = dayjs(b.timestamp)

      if (d1.isValid() && d2.isValid()) {
        return d2.diff(d1, "second")
      }

      return d1.isValid() ? -1 : 1
    })

    return NextResponse.json({
      code: 200,
      message: "ok",
      data: {
        metadata,
        transactions,
      },
    })
  } catch {
    return NextResponse.json({
      code: 500,
      message: "internal server error",
      data: null,
    })
  }
}
