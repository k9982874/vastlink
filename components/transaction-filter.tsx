"use client"

import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Combobox } from "./ui/combox"

export function TransactionFilter({
  label,
  values,
  defaultValue,
}: {
  label: string
  values: string[]
  defaultValue?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const data = useMemo(() => {
    if (label === "Asset") {
      return values.map((v) => ({
        value: v.toLowerCase(),
        label: v,
        icon: `/icons/${v.toLowerCase()}.png`,
      }))
    }
    return values.map((v) => ({ value: v.toLowerCase(), label: v }))
  }, [label, values])

  const handleItemChanged = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "") {
      params.delete(label.toLowerCase())
    } else {
      params.set(label.toLowerCase(), value)
    }
    router.push(pathname + "?" + params.toString())
  }

  return (
    <Combobox
      hint={label}
      defaultValue={defaultValue}
      data={data}
      onItemChanged={handleItemChanged}
    />
  )
}
