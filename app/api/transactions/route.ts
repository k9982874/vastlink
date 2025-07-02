import { NextRequest, NextResponse } from "next/server"
import dayjs from "dayjs"

import mockData from "./mock_data.json"

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1")
  const size = parseInt(req.nextUrl.searchParams.get("size") || "20")
  const asset = req.nextUrl.searchParams.get("asset")
  const type = req.nextUrl.searchParams.get("type")
  const status = req.nextUrl.searchParams.get("status")
  const from = req.nextUrl.searchParams.get("from")
  const to = req.nextUrl.searchParams.get("to")

  const assets: string[] = []
  const types: string[] = []
  const statuses: string[] = []

  for (const item of mockData) {
    if (!assets.includes(item.asset)) {
      assets.push(item.asset)
    }
    if (!types.includes(item.type)) {
      types.push(item.type)
    }
    if (!statuses.includes(item.status)) {
      statuses.push(item.status)
    }
  }

  let data = [...mockData]
  if (asset) {
    data = data.filter(
      (transaction) => transaction.asset.toLowerCase() === asset
    )
  }
  if (type) {
    data = data.filter((transaction) => transaction.type.toLowerCase() === type)
  }
  if (status) {
    data = data.filter(
      (transaction) => transaction.status.toLowerCase() === status
    )
  }

  data.sort((a, b) => {
    return dayjs(b.timestamp).unix() - dayjs(a.timestamp).unix()
  })

  if (from && to) {
    let startDate = dayjs(from)
    let endDate = dayjs(to)
    if (startDate.isValid() && endDate.isValid()) {
      startDate = startDate.startOf("day")
      endDate = endDate.endOf("day")

      data = data.filter((transaction) => {
        const transactionDate = dayjs(transaction.timestamp)
        return (
          transactionDate.isAfter(startDate) &&
          transactionDate.isBefore(endDate)
        )
      })
    }
  }

  const total = data.length
  const totalPages = Math.ceil(total / size)

  if (data.length > size) {
    data = data.slice((page - 1) * size, page * size)
  }

  return NextResponse.json({
    code: 200,
    message: "ok",
    filters: [
      {
        label: "Asset",
        values: assets.sort(),
      },
      {
        label: "Type",
        values: types.sort(),
      },
      {
        label: "Status",
        values: statuses.sort(),
      },
    ],
    data,
    total,
    page,
    pageSize: size,
    totalPages,
  })
}
