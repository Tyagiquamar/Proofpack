// Test comment for Git push
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Upload, ArrowRight, CheckCircle2, ExternalLink, Database, ChevronRight } from "lucide-react"

// Mock transaction data for type reference and initial state
const MOCK_TRANSACTIONS = [
  {
    hash: '0x1234...5678',
    blockNumber: 12345678,
    timestamp: 1678901234,
    from: '0x1234...abcd',
    to: '0x5678...efgh',
    value: '1000000000000000000', // 1 ETH in weis
    gasUsed: 21000,
    gasPrice: '2000000000', // 2 Gwei
    status: 'success',
    method: 'Transfer',
    nonce: 42,
    input: '0x',
    confirmations: 12
  },
  {
    hash: '0x5678...90ab',
    blockNumber: 12345679,
    timestamp: 1678902234,
    from: '0x5678...efgh',
    to: '0x1234...abcd',
    value: '500000000000000000', // 0.5 ETH in wei
    gasUsed: 25000,
    gasPrice: '3000000000', // 3 Gwei
    status: 'pending',
    method: 'Swap',
    nonce: 43,
    input: '0x',
    confirmations: 2
  }
]

interface Transaction {
  hash: string
  blockNumber: number
  timestamp: number
  from: string
  to: string
  value: string
  gasUsed: number
  gasPrice: string
  status: 'success' | 'pending' | 'failed' | string
  method: string
  nonce: number
  input: string
  confirmations: number
}

// Utility functions
const formatEther = (wei: string): string => {
  return (parseInt(wei) / 1e18).toFixed(4)
}

const formatGwei = (gwei: string): string => {
  return (parseInt(gwei) / 1e9).toFixed(2)
}

const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString()
}

interface TransactionExplorerProps {
  onDataUploaded: (data: any) => void
  onNext: () => void
}

const steps = [
  { id: 'explorer', name: 'Transaction Explorer', status: 'current' },
  { id: 'analysis', name: 'Compression Analysis', status: 'upcoming' },
  { id: 'builder', name: 'ZK Proof Builder', status: 'upcoming' },
  { id: 'dashboard', name: 'Results Dashboard', status: 'upcoming' },
];

const TransactionExplorer = ({ onDataUploaded, onNext }: TransactionExplorerProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [isLoading, setIsLoading] = useState(false)
  const [isRealData, setIsRealData] = useState(false)
  const { toast } = useToast()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        let transactionData: Transaction[] = []

        // Handle different JSON formats
        if (Array.isArray(data)) {
          transactionData = data
        } else if (data.transactions && Array.isArray(data.transactions)) {
          transactionData = data.transactions
        } else if (data.result && Array.isArray(data.result)) {
          transactionData = data.result
        } else {
          throw new Error('Unsupported JSON format')
        }

        setTransactions(transactionData)
        onDataUploaded(transactionData)
        
        toast({
          title: 'Success',
          description: `Successfully loaded ${transactionData.length} transactions`,
        })
      } catch (error) {
        console.error('Error parsing JSON:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to parse the uploaded file. Please check the format and try again.',
        })
      } finally {
        setIsLoading(false)
      }
    }

    reader.onerror = () => {
      setIsLoading(false)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to read the file. Please try again.',
      })
    }

    reader.readAsText(file)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Success
        </Badge>
      case 'pending':
        return <Badge variant="outline" className="border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Pending
        </Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      'Transfer': 'from-blue-500 to-blue-600',
      'Swap': 'from-purple-500 to-indigo-600',
      'Approve': 'from-emerald-500 to-teal-600',
      'Deposit': 'from-amber-500 to-orange-600',
      'Withdraw': 'from-rose-500 to-pink-600',
      'default': 'from-gray-500 to-gray-600'
    }
    return colors[method] || colors['default']
  }

  const totalValue = transactions.reduce((sum, tx) => sum + parseFloat(tx.value), 0)
  const totalGasUsed = transactions.reduce((sum, tx) => sum + tx.gasUsed, 0)

  return (
    <div className="space-y-8">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-8">
        <a href="/" className="group flex items-center space-x-2 no-underline">
          <motion.div 
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Database className="w-5 h-5 text-white" />
          </motion.div>
          <motion.span 
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            ProofPack
          </motion.span>
        </a>
      </div>

      {/* Step Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            onMouseEnter={() => setHoveredCard(step.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className="relative"
          >
            <Card 
              className={`h-full transition-all duration-300 ${
                step.status === 'current' 
                  ? 'border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/30 dark:to-slate-900'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-md'
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.status === 'current' 
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                  {step.status === 'current' && (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      In Progress
                    </Badge>
                  )}
                  {step.status === 'upcoming' && (
                    <Badge variant="outline" className="text-slate-400">
                      Pending
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <h3 className={`text-lg font-medium ${
                  step.status === 'current' 
                    ? 'text-slate-900 dark:text-white' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}>
                  {step.name}
                </h3>
              </CardContent>
              {hoveredCard === step.id && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Card>
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 right-0 -mr-2">
                <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Transaction Explorer
          </h2>
          <p className="text-muted-foreground">
            Analyze and optimize your blockchain transactions
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="file"
            id="file-upload"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isLoading}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isLoading}
            className="w-full md:w-auto bg-white/80 hover:bg-white/90 dark:bg-slate-800/80 dark:hover:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload JSON
              </>
            )}
          </Button>
          <Button 
            onClick={onNext} 
            disabled={transactions.length === 0}
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/20 dark:shadow-purple-500/20 transition-all duration-300 group"
          >
            Analyze Transactions
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {transactions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-800 dark:text-blue-300 text-lg">Total Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                    {totalValue.toFixed(4)} ETH
                  </div>
                  <p className="text-xs text-blue-700/70 dark:text-blue-300/70 mt-1">
                    Across {transactions.length} transactions
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border-purple-200 dark:border-purple-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-purple-800 dark:text-purple-300 text-lg">Gas Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                    {totalGasUsed.toLocaleString()}
                  </div>
                  <p className="text-xs text-purple-700/70 dark:text-purple-300/70 mt-1">
                    Average: {Math.round(totalGasUsed / transactions.length)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-indigo-800 dark:text-indigo-300 text-lg">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge('success')}
                    <span className="text-indigo-900/70 dark:text-indigo-200/70 text-sm">
                      {transactions.filter(tx => tx.status === 'success').length} successful
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    {getStatusBadge('pending')}
                    <span className="text-indigo-900/70 dark:text-indigo-200/70 text-sm">
                      {transactions.filter(tx => tx.status === 'pending').length} pending
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg">Transaction Details</CardTitle>
                <CardDescription>
                  {transactions.length} transactions found
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                      <TableRow className="border-b-0">
                        <TableHead className="w-[180px]">Transaction</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {transactions.map((tx, index) => (
                          <motion.tr 
                            key={tx.hash + index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className={`border-t border-slate-100 dark:border-slate-800/50 transition-colors ${isHovered === tx.hash ? 'bg-slate-50/50 dark:bg-slate-800/30' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/20'}`}
                            onMouseEnter={() => setIsHovered(tx.hash)}
                            onMouseLeave={() => setIsHovered(null)}
                          >
                            <TableCell className="font-medium p-3">
                              <div className="flex items-center gap-2 group">
                                <span className="font-mono text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {tx.hash}
                                </span>
                                <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-70 text-slate-400 hover:text-blue-500 transition-all duration-200" />
                              </div>
                            </TableCell>
                            <TableCell className="p-3">
                              <Badge 
                                className={`bg-gradient-to-r ${getMethodColor(tx.method)} text-white border-0 shadow-sm`}
                              >
                                {tx.method}
                              </Badge>
                            </TableCell>
                            <TableCell className="p-3 font-mono text-sm text-slate-600 dark:text-slate-400">
                              {tx.from}
                            </TableCell>
                            <TableCell className="p-3 font-mono text-sm text-slate-600 dark:text-slate-400">
                              {tx.to}
                            </TableCell>
                            <TableCell className="p-3 text-right font-mono font-medium">
                              {parseFloat(formatEther(tx.value)).toFixed(4)} ETH
                            </TableCell>
                            <TableCell className="p-3 text-right">
                              {getStatusBadge(tx.status)}
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center"
          >
            <Card className="text-center p-12 max-w-md w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 border-slate-200 dark:border-slate-800/50 shadow-sm">
              <div className="mx-auto flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">No transactions yet</h3>
                <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
                  Upload a JSON file containing transaction data to get started with analysis.
                </p>
                <Button 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <Upload className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  Upload Transaction File
                </Button>
                <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                  Supported formats: JSON array or object with 'transactions' array
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TransactionExplorer
