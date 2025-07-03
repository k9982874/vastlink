"use client"

import { useCallback, useMemo, useState } from "react"
import Image from "next/image"
import dayjs from "dayjs"
import useInfiniteScroll from "react-infinite-scroll-hook"
import useSWRInfinite from "swr/infinite"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CopyButton } from "@/components/copy-button"

import { cn } from "@/lib/utils"

import { AssetFilter } from "./asset-filter"

type Transaction = {
  metadata: {
    asset: string
    network?: string
    lastId: string | null
  }[]
  transactions: {
    asset: string
    network?: string
    txid: string
    value: string
    from: string
    to: string
    timestamp: string
    status: string
    type: string
  }[]
}

const fetcher = async (
  args: [
    string,
    {
      asset: string
      lastId: string | null
    }[],
  ]
): Promise<Transaction> => {
  const url = args[0]
  const assets = args[1]

  console.log(assets)

  const res = await fetch(url, {
    method: "POST",
    body: assets.length > 0 ? JSON.stringify(assets) : null,
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (!res.ok) {
    throw new Error("An error occurred while fetching the data.")
  }

  const { code, data } = (await res.json()) as {
    code: number
    message: string
    data: Transaction
  }
  if (code !== 200) {
    throw new Error("An error occurred while fetching the data.")
  }
  return data
}

const getKey = (
  pageIndex: number,
  previousPageData: Transaction | null,
  asset?: string
) => {
  if (pageIndex === 0) {
    if (asset) {
      return ["/api/transactions", [{ asset, lastId: null }]]
    }
    return ["/api/transactions", []]
  }

  if (!previousPageData) {
    return null
  }

  const hasMore = previousPageData.metadata.some((meta) => meta.lastId !== null)
  if (!hasMore) {
    return null
  }

  let assetsForNextPage = previousPageData.metadata
    .filter((meta) => meta.lastId !== null)
    .map(({ asset, lastId }) => ({ asset, lastId }))

  if (asset) {
    assetsForNextPage = assetsForNextPage.filter((v) => v.asset === asset)
    if (assetsForNextPage.length === 0) {
      return null
    }
  }

  return ["/api/transactions", assetsForNextPage]
}

export function TransactionTable() {
  const [asset, setAsset] = useState<string | undefined>(undefined)

  const { data, error, isLoading, isValidating, setSize, mutate } =
    useSWRInfinite<Transaction>(
      (pageIndex, previousPageData) =>
        getKey(pageIndex, previousPageData, asset),
      fetcher,
      {
        revalidateFirstPage: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }
    )

  const loadMore = useCallback(() => {
    if (!isValidating) {
      setSize((prevSize) => prevSize + 1)
    }
  }, [isValidating, setSize])

  const hasNextPage = useMemo(() => {
    if (!data?.length) return false
    const lastPage = data[data.length - 1]

    if (asset) {
      const item = lastPage.metadata.find((v) => v.asset === asset)
      return !!item?.lastId
    }
    return lastPage.metadata.some(({ lastId }) => lastId !== null)
  }, [data, asset])

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading || isValidating,
    hasNextPage,
    onLoadMore: loadMore,
    disabled: Boolean(error),
    rootMargin: "0px 0px 400px 0px",
  })

  const allTransactions = useMemo(() => {
    return data?.flatMap((page) => page.transactions) || []
  }, [data])

  const metadata = useMemo(() => {
    if (!data || data.length === 0) return []
    const lastPage = data[data.length - 1]
    return lastPage.metadata
  }, [data])

  const handleFilterChange = useCallback(
    (value?: string) => {
      setAsset(value)
      mutate()
    },
    [mutate]
  )

  return (
    <>
      <div className="flex w-full flex-row items-start gap-4">
        {metadata.length > 0 && (
          <AssetFilter data={metadata} onChange={handleFilterChange} />
        )}
      </div>
      <div ref={rootRef} className="h-full w-full overflow-auto">
        {!isLoading && allTransactions.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[32px]"></TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Network</TableHead>
                <TableHead className="w-[200px]">From</TableHead>
                <TableHead className="w-[200px]">To</TableHead>
                <TableHead className="w-[200px]">Transaction Hash</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((v, i) => (
                <TableRow key={`${v.txid}-${i}`}>
                  <TableCell>
                    <Image
                      src={`/icons/${v.asset.toLowerCase()}.png`}
                      alt={v.asset}
                      width={20}
                      height={20}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{v.type}</TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        v.type === "receive" ? "text-green-500" : null,
                        v.type === "send" ? "text-red-500" : null
                      )}
                    >
                      {v.type === "Receive" && "+"}
                      {v.type === "Send" && "-"}
                      {`${v.value.toLocaleString()} ${v.asset}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-muted-foreground w-[200px] truncate">
                      {v.network}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-muted-foreground w-[200px] truncate">
                      {v.from}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-muted-foreground w-[200px] truncate">
                      {v.to}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-muted-foreground flex w-[200px] flex-row flex-nowrap items-center">
                      <span className="truncate">{v.txid}</span>
                      <CopyButton text={v.txid} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {dayjs(v.timestamp).format("MM/DD/YYYY, HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!isLoading && allTransactions.length === 0 && (
          <div ref={infiniteRef} className="w-full text-center">
            No transactions found
          </div>
        )}
        {(isLoading || isValidating || hasNextPage) && (
          <div ref={infiniteRef} className="w-full text-center">
            Loading...
          </div>
        )}
      </div>
    </>
  )
}
