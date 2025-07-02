"use client"

import { toast } from "react-toastify"

import { cn } from "@/lib/utils"

import { CopyIcon } from "lucide-react"

interface CopyButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
  text: string
}

export function CopyButton({ className, text }: CopyButtonProps) {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard")
    }
  }
  return (
    <div
      className={cn("h-8 w-8 cursor-pointer", className)}
      onClick={handleClick}
    >
      <CopyIcon className="h-full w-full" />
    </div>
  )
}
