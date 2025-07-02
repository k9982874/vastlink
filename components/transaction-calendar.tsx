"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import dayjs from "dayjs"
import Calendar from "react-calendar"
import { Range, Value } from "react-calendar/dist/shared/types.js"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { ChevronDownIcon } from "lucide-react"

import "react-calendar/dist/Calendar.css"

export function TransactionCalendar({
  from,
  to,
}: {
  from?: string
  to?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)
  // const [date, setDate] = useState<Date | undefined>(undefined);

  const handleChange = (value: Value) => {
    const [from, to] = value as Range<Date>

    const params = new URLSearchParams(searchParams.toString())
    params.set("from", dayjs(from).format("YYYY-MM-DD"))
    params.set("to", dayjs(to).format("YYYY-MM-DD"))
    router.push(pathname + "?" + params.toString())

    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-56 justify-between font-normal"
          >
            {from && to ? `${from} - ${to}` : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar selectRange onChange={handleChange} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
