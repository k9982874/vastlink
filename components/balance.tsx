"use client"

import Image from "next/image"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Loader2Icon } from "lucide-react"

type Balance = {
  total: number
  details: {
    asset: string
    balance: number
    usd: number | string
  }[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("failed to fetch balance")
  }

  const { code, data } = await res.json()
  if (code !== 200) {
    throw new Error("failed to fetch balance")
  }
  return data
}

function formatNumber(value: string | number) {
  if (typeof value === "string") {
    return value
  }
  return parseFloat(value.toFixed(2)).toLocaleString() + " USD"
}

export default function Balance() {
  const { data, error, isLoading } = useSWR<Balance>("/api/balance", fetcher)

  if (isLoading) {
    return (
      <Button disabled variant="ghost">
        Total Balance:
        <Loader2Icon className="animate-spin" />
      </Button>
    )
  }

  if (error) {
    return (
      <Button disabled variant="ghost">
        Total Balance: Error
      </Button>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          Total Balance: {formatNumber(data!.total)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {data!.details.map((v) => (
          <div
            key={v.asset}
            className="grid grid-cols-[auto_1fr_1fr] items-center gap-4 leading-6"
          >
            <Image
              src={`/icons/${v.asset.toLowerCase()}.png`}
              alt={v.asset}
              width={16}
              height={16}
            />
            <Label htmlFor="asset">{v.asset}</Label>
            <span id="asset">
              {formatNumber(v.usd)}
            </span>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
