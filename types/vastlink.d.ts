interface HistoryResponse {
  transactions: {
    txid: string
    value: string
    from: string
    to: string
    timestamp: string
    status: string
    type: string
  }[]
  lastId: null
  hasMore: boolean
}
