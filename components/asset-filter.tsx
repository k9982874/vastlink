"use client"

import { useMemo } from "react"

import { Combobox } from "./ui/combox"

export function AssetFilter({
  data,
  defaultValue,
  onChange,
}: {
  data: { asset: string; network?: string }[]
  defaultValue?: string
  onChange?: (value: string) => void
}) {
  const items = useMemo(() => {
    return data.map(({ asset, network }) => ({
      value: asset,
      label: network ? `${asset} (${network})` : asset,
      icon: `/icons/${asset.toLowerCase()}.png`,
    }))
  }, [data])

  return (
    <Combobox
      hint="Asset"
      defaultValue={defaultValue}
      data={items}
      onItemChanged={onChange}
    />
  )
}
