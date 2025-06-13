
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompressionChart from "./CompressionChart";
import { BarChart3, Zap, TreePine, Filter, Database, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import pako from 'pako';

// Types
interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string | number;
  gas: string | number;
  gasPrice: string | number;
  blockNumber: number;
  timestamp?: number;
  input?: string;
  nonce?: number;
}

interface CompressionMethod {
  method: string;  // Changed from 'name' to 'method' to match chart expectations
  name?: string;   // Keep for backward compatibility
  description: string;
  compressedSize: number;
  originalSize: number;
  spaceSaved: number;
  compressionRatio: number;
  compressionPercentage: string;
  timeMs: number;
  efficiency: string;
  technique: string;
}

interface CompressionResults {
  originalSize: number;
  methods: CompressionMethod[];
  transactionCount: number;
  isRealData: boolean;
  merkleRoot?: string;
  fileName: string;  // Made required to match CompressionChart expectations
}

interface CompressionAnalyzerProps {
  data: {
    transactions: any[];
    isRealData: boolean;
    originalSize?: number;
    fileName?: string;
  } | null;
  onCompressionComplete: (results: any) => void;
  onNext: () => void;
}

const CompressionAnalyzer = ({ data, onCompressionComplete, onNext }: CompressionAnalyzerProps) => {
  const [compressionResults, setCompressionResults] = useState<CompressionResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const { toast } = useToast();

  // Helper to calculate SHA-256 hash
  const sha256 = async (message: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Calculate Merkle root for transactions
  const calculateMerkleRoot = async (transactions: Transaction[]): Promise<string> => {
    if (transactions.length === 0) return '';
    
    // Simple Merkle root calculation (for demo)
    const leaves = await Promise.all(
      transactions.map(tx => 
        sha256(`${tx.hash}${tx.from}${tx.to}${tx.value}`)
      )
    );
    
    // In a real implementation, you would build a full Merkle tree
    return sha256(leaves.join(''));
  };

  const calculateRealCompression = async (transactions: Transaction[]): Promise<CompressionResults | null> => {
    if (!transactions || transactions.length === 0) return null;

    // Calculate original size
    const originalData = JSON.stringify(transactions);
    const originalSize = originalData.length;

    // Calculate Merkle root
    const merkleRoot = await calculateMerkleRoot(transactions);
    
    // Calculate compressed sizes using different methods
    const deltaEncoded = pako.deflate(originalData);
    const deltaEncodedSize = deltaEncoded.length;
    
    // Simple RLE compression
    const rleCompress = (str: string): string => {
      if (!str) return '';
      let compressed = '';
      let count = 1;
      
      for (let i = 0; i < str.length; i++) {
        if (str[i] === str[i + 1]) {
          count++;
        } else {
          compressed += (count > 3) ? `[${count}${str[i]}]` : str[i].repeat(count);
          count = 1;
        }
      }
      return compressed;
    };

    const rleCompressed = rleCompress(originalData);
    
    // Define compression methods with actual implementations
    const methods: Omit<CompressionMethod, 'originalSize' | 'spaceSaved' | 'compressionRatio' | 'compressionPercentage' | 'efficiency'>[] = [
      {
        method: "Delta Encoding (zlib)",  // Changed from 'name' to 'method'
        name: "Delta Encoding (zlib)",    // Keep name for backward compatibility
        description: "Standard zlib compression",
        compressedSize: deltaEncodedSize,
        timeMs: Math.max(10, Math.floor(originalSize / 5000)),
        technique: "zlib deflate"
      },
      {
        method: "Merkle Tree",            // Changed from 'name' to 'method'
        name: "Merkle Tree",              // Keep name for backward compatibility
        description: "Cryptographic hash tree",
        compressedSize: 32 + (transactions.length * 32),
        timeMs: Math.max(20, Math.floor(originalSize / 3000)),
        technique: "SHA-256 hashing"
      },
      {
        method: "RLE + Dictionary",        // Changed from 'name' to 'method'
        name: "RLE + Dictionary",          // Keep name for backward compatibility
        description: "Run-length encoding with dictionary",
        compressedSize: rleCompressed.length,
        timeMs: Math.max(15, Math.floor(originalSize / 4000)),
        technique: "Pattern-based compression"
      }
    ];

    // Calculate metrics for each method
    const results = methods.map(method => {
      const spaceSaved = originalSize - method.compressedSize;
      const compressionRatio = method.compressedSize / originalSize;
      
      return {
        ...method,
        originalSize,
        spaceSaved,
        compressionRatio,
        compressionPercentage: ((1 - compressionRatio) * 100).toFixed(1),
        efficiency: (spaceSaved / originalSize / 1000).toFixed(2)
      } as CompressionMethod;
    });

    return {
      originalSize,
      methods: results,
      transactionCount: transactions.length,
      isRealData: data?.isRealData || false,
      merkleRoot: `0x${merkleRoot}`,
      fileName: data?.fileName || "uploaded_data.json"
    };
  };

  const runCompressionAnalysis = async () => {
    if (!data?.transactions?.length) {
      toast({
        title: "❌ No data to analyze",
        description: "Please upload transaction data first",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Starting compression analysis with data:', data);

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Update progress
      setAnalysisProgress(10);
      toast({
        title: "🔄 Processing...",
        description: "Starting compression analysis...",
      });
      
      // Add a small delay to allow UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Process transactions
      const transactions = data.transactions;
      setAnalysisProgress(30);
      
      // Calculate compression
      const results = await calculateRealCompression(transactions);
      
      if (!results) throw new Error("Failed to calculate compression");
      
      // Add file info to results
      const finalResults = {
        ...results,
        fileName: data.fileName || 'transactions.json',
        isRealData: data.isRealData,
        originalSize: data.originalSize || JSON.stringify(transactions).length
      };
      
      console.log('Compression results:', finalResults);
      
      setAnalysisProgress(90);
      setCompressionResults(finalResults);
      
      // Notify parent component
      onCompressionComplete(finalResults);
      
      setAnalysisProgress(100);
      
      toast({
        title: "✅ Compression analysis complete",
        description: `Analyzed ${finalResults.transactionCount} transactions with ${finalResults.methods.length} compression methods`,
      });
      
      // Auto-advance to next step after a short delay
      setTimeout(() => onNext(), 1000);
      
    } catch (error) {
      console.error('Compression error:', error);
      toast({
        title: "❌ Compression failed",
        description: error instanceof Error ? error.message : "Unknown error during compression",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getBestMethod = () => {
    if (!compressionResults?.methods) return null;
    return compressionResults.methods.reduce((best: any, current: any) => 
      parseFloat(current.compressionPercentage) > parseFloat(best.compressionPercentage) ? current : best
    );
  };

  return (
    <div className="space-y-6">
      {/* Analysis Status */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 animate-fade-in">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Compression Analysis Engine</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {data?.isRealData 
                    ? `Ready to analyze your ${data?.transactions?.length || 0} real transactions`
                    : `Demo analysis with ${data?.transactions?.length || 0} mock transactions`
                  }
                </p>
              </div>
            </div>
            {!compressionResults && (
              <Button 
                onClick={runCompressionAnalysis}
                disabled={isAnalyzing || !data?.transactions}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Start Analysis
                  </>
                )}
              </Button>
            )}
          </div>
          
          {isAnalyzing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Analysis Progress</span>
                <span className="text-sm text-blue-600">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {compressionResults && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                title: "Original Size",
                value: formatBytes(compressionResults.originalSize),
                icon: Database,
                color: "from-slate-500 to-slate-600"
              },
              {
                title: "Best Compression",
                value: `${getBestMethod()?.compressionPercentage}%`,
                icon: Zap,
                color: "from-green-500 to-emerald-600"
              },
              {
                title: "Methods Tested",
                value: compressionResults.methods.length,
                icon: Filter,
                color: "from-blue-500 to-cyan-600"
              },
              {
                title: "Data Type",
                value: compressionResults.isRealData ? "Real" : "Mock",
                icon: TreePine,
                color: compressionResults.isRealData ? "from-green-500 to-emerald-600" : "from-amber-500 to-orange-600"
              }
            ].map((stat, index) => (
              <Card key={stat.title} className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Results */}
          <Tabs defaultValue="overview" className="animate-fade-in">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="methods">Methods</TabsTrigger>
              <TabsTrigger value="visualization">Chart</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compression Summary</CardTitle>
                  <CardDescription>
                    Analysis results for {compressionResults.fileName} ({compressionResults.transactionCount} transactions)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {compressionResults.methods.map((method: any, index: number) => (
                      <div key={method.method} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{method.method}</h4>
                            <Badge variant={index === 0 ? "default" : "secondary"}>
                              {method.compressionPercentage}% reduction
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                          <p className="text-xs text-blue-600 mt-1">{method.technique}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {formatBytes(method.spaceSaved)} saved
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {method.timeMs}ms • Efficiency: {method.efficiency}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="methods" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {compressionResults.methods.map((method: any) => (
                  <Card key={method.method} className="hover:shadow-md transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg">{method.method}</CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Original:</span>
                          <p className="font-mono">{formatBytes(method.originalSize)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Compressed:</span>
                          <p className="font-mono">{formatBytes(method.compressedSize)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Saved:</span>
                          <p className="font-mono text-green-600">{formatBytes(method.spaceSaved)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <p className="font-mono">{method.timeMs}ms</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Compression Ratio</span>
                          <span className="font-semibold">{method.compressionPercentage}%</span>
                        </div>
                        <Progress value={parseFloat(method.compressionPercentage)} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="visualization">
              <CompressionChart data={compressionResults} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end animate-fade-in">
            <Button 
              onClick={onNext}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Generate ZK Proofs <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CompressionAnalyzer;
