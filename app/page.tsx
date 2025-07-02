import Image from "next/image"
import dayjs from "dayjs"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { CopyButton } from "@/components/copy-button"
import { TransactionCalendar } from "@/components/transaction-calendar"
import { TransactionFilter } from "@/components/transaction-filter"

import { cn } from "@/lib/utils"

import { WalletIcon } from "lucide-react"

function generatePagedUrl(url: string, page: number) {
  const params = new URLSearchParams(url)
  params.set("page", page.toString())
  return `/?${params.toString()}`
}

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const searchParams = await props.searchParams

  const params = new URLSearchParams()
  if ("asset" in searchParams) {
    params.set("asset", searchParams.asset as string)
  }
  if ("type" in searchParams) {
    params.set("type", searchParams.type as string)
  }
  if ("status" in searchParams) {
    params.set("status", searchParams.status as string)
  }
  if ("from" in searchParams && "to" in searchParams) {
    params.set("from", searchParams.from as string)
    params.set("to", searchParams.to as string)
  }

  if ("page" in searchParams) {
    params.set("page", searchParams.page as string)
  } else {
    params.set("page", "1")
  }

  if ("size" in searchParams) {
    params.set("size", searchParams.size as string)
  } else {
    params.set("size", "20")
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/transactions?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) {
    return <div>Somthing went wrong</div>
  }

  const { data, filters, page, totalPages } = (await res.json()) as {
    code: number
    message: string
    filters: {
      label: string
      values: string[]
    }[]
    data: {
      transactionId: string
      timestamp: string
      walletAddress: string
      blockchain: string
      asset: string
      assetType: string
      type: string
      amount: number
      usdValue: number
      status: string
      fromAddress: string
      toAddress: string
    }[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-4 p-4">
      <div className="text-muted-foreground flex flex-row items-center">
        <WalletIcon className="mr-2 inline-block h-6 w-6" />
        <h1 className="text-lg">VastBase Alpha</h1>
      </div>

      <ToggleGroup type="single" className="w-full" size="lg">
        <ToggleGroupItem value="transactions">
          Transaction History
        </ToggleGroupItem>
        <ToggleGroupItem value="proposals">Proposals</ToggleGroupItem>
      </ToggleGroup>
      <div className="flex w-full flex-row items-start gap-4">
        {filters.map(({ label, values }) => (
          <TransactionFilter
            key={label}
            label={label}
            values={values}
            defaultValue={params.get(label.toLowerCase()) ?? undefined}
          />
        ))}
        <div className="flex-1" />
        <TransactionCalendar from={searchParams.from} to={searchParams.to} />
      </div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
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
          {data.map((v, i) => (
            <TableRow key={i}>
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
                    v.type === "Receive" ? "text-green-500" : null,
                    v.type === "Send" ? "text-red-500" : null
                  )}
                >
                  {v.type === "Receive" && "+"}
                  {v.type === "Send" && "-"}
                  {`${v.amount.toLocaleString()} ${v.asset}`}
                </div>
              </TableCell>
              <TableCell>{v.blockchain}</TableCell>
              <TableCell>
                <div className="text-muted-foreground w-[200px] truncate">
                  {v.fromAddress}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-muted-foreground w-[200px] truncate">
                  {v.toAddress}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-muted-foreground flex w-[200px] flex-row flex-nowrap items-center">
                  <span className="truncate">{v.transactionId}</span>
                  <CopyButton text={v.transactionId} />
                </div>
              </TableCell>
              <TableCell className="text-right">
                {dayjs(v.timestamp).format("MM/DD/YYYY, HH:mm")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem className={page <= 1 ? "pointer-events-none" : ""}>
            <PaginationPrevious
              href={
                page > 1
                  ? generatePagedUrl(params.toString(), page - 1)
                  : undefined
              }
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((v) => (
            <PaginationItem key={v}>
              <PaginationLink
                isActive={v === page}
                href={generatePagedUrl(params.toString(), v)}
              >
                {v}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem className={page >= totalPages ? "pointer-events-none" : ""}>
            <PaginationNext
              href={
                page < totalPages
                  ? generatePagedUrl(params.toString(), page + 1)
                  : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
