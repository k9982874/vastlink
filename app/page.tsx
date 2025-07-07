import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import Balance from "@/components/balance"
import { TransactionTable } from "@/components/transaction-table"

import { WalletIcon } from "lucide-react"

export default async function Home() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-4 p-4">
      <div className="text-muted-foreground flex flex-row items-center">
        <WalletIcon className="mr-2 inline-block h-6 w-6" />
        <h1 className="text-lg">VastBase Alpha</h1>
      </div>

      <Balance />

      <ToggleGroup type="single" className="w-full" size="lg">
        <ToggleGroupItem value="transactions">
          Transaction History
        </ToggleGroupItem>
        <ToggleGroupItem value="proposals">Proposals</ToggleGroupItem>
      </ToggleGroup>

      <TransactionTable />
    </div>
  )
}
