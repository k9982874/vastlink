"use client"

import { useMemo, useState } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils"

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

interface ComboboxProps extends React.HTMLAttributes<HTMLDivElement> {
  hint?: string
  defaultValue?: string
  data: { value: string; label: string; icon?: string }[]
  onItemChanged?: (value: string) => void
}

export function Combobox({
  hint,
  data,
  defaultValue,
  onItemChanged,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(defaultValue ?? "")

  const buttonText = useMemo(() => {
    const item = data.find((v) => v.value === value)
    if (item) {
      return item.label
    }
    return hint ?? "Select item..."
  }, [data, value, hint])

  const buttonIcon = useMemo(() => {
    return data.find((v) => v.value === value)?.icon
  }, [data, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          {buttonIcon && (
            <Image
              src={buttonIcon}
              alt={buttonText}
              width={20}
              height={20}
              className="mr-2"
            />
          )}
          {buttonText}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {data.map((v, i) => (
                <CommandItem
                  key={i}
                  value={v.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    onItemChanged?.(currentValue === value ? "" : currentValue)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      v.value === value ? "visible" : "invisible"
                    )}
                  />
                  {v.icon && (
                    <Image src={v.icon} alt={v.label} width={20} height={20} />
                  )}
                  {v.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
