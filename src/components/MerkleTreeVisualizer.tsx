
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TreePine, Layers, Hash } from "lucide-react";

interface MerkleTreeVisualizerProps {
  data: any;
  merkleRoot: string;
  depth: number;
}

const MerkleTreeVisualizer = ({ data, merkleRoot, depth }: MerkleTreeVisualizerProps) => {
  // Create a more visually appealing tree structure
  const createTreeLevel = (level: number, nodeCount: number) => {
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const isRoot = level === 0 && i === 0;
      const isLeaf = level === depth - 1;
      
      nodes.push(
        <div 
          key={i}
          className={`relative w-20 h-10 rounded-lg border-2 flex items-center justify-center text-xs font-semibold transition-all duration-300 hover:scale-110 hover:shadow-lg ${
            isRoot 
              ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white border-purple-400 shadow-lg' 
              : isLeaf
              ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white border-green-300'
              : 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white border-blue-300'
          }`}
          style={{
            animationDelay: `${(level * nodeCount + i) * 100}ms`
          }}
        >
          {isRoot ? (
            <div className="flex items-center space-x-1">
              <Hash className="w-3 h-3" />
              <span>ROOT</span>
            </div>
          ) : isLeaf ? (
            <div className="flex items-center space-x-1">
              <Layers className="w-3 h-3" />
              <span>L{i + 1}</span>
            </div>
          ) : (
            <span>N{level}-{i}</span>
          )}
          
          {/* Connection lines */}
          {level < depth - 1 && (
            <>
              <div className="absolute -bottom-4 left-1/2 w-0.5 h-4 bg-gradient-to-b from-slate-400 to-transparent transform -translate-x-0.5" />
              {i < nodeCount - 1 && (
                <div className="absolute -bottom-4 left-1/2 w-16 h-0.5 bg-gradient-to-r from-slate-400 to-slate-400 transform translate-x-0" />
              )}
            </>
          )}
        </div>
      );
    }
    return nodes;
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900 rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <TreePine className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl">Merkle Tree Structure</span>
          </div>
          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300">
            Depth: {depth} 🌳
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Merkle Root Display */}
          <div className="text-center animate-fade-in">
            <div className="text-sm text-muted-foreground mb-3 flex items-center justify-center space-x-2">
              <Hash className="w-4 h-4" />
              <span>Cryptographic Merkle Root</span>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-700">
              <code className="text-sm font-mono break-all bg-white dark:bg-slate-800 px-3 py-2 rounded border">
                {merkleRoot}
              </code>
            </div>
          </div>

          {/* Tree Visualization */}
          <div className="flex flex-col items-center space-y-8 animate-fade-in">
            {Array.from({ length: depth }, (_, level) => {
              const nodeCount = Math.pow(2, level);
              return (
                <div key={level} className="flex space-x-6 animate-fade-in" style={{ animationDelay: `${level * 200}ms` }}>
                  {createTreeLevel(level, Math.min(nodeCount, 8))}
                </div>
              );
            })}
          </div>

          {/* Tree Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="text-center hover:shadow-md transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{Math.pow(2, depth - 1)}</div>
                <div className="text-sm text-green-700 dark:text-green-300 font-medium flex items-center justify-center space-x-1">
                  <Layers className="w-4 h-4" />
                  <span>Leaf Nodes</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-md transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{Math.pow(2, depth) - 1}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Nodes</div>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-md transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{depth}</div>
                <div className="text-sm text-purple-700 dark:text-purple-300 font-medium flex items-center justify-center space-x-1">
                  <TreePine className="w-4 h-4" />
                  <span>Tree Depth</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Educational Note */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800 animate-fade-in">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">💡</span>
              </div>
              <div className="text-sm">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">How Merkle Trees Work</h4>
                <p className="text-amber-700 dark:text-amber-300">
                  Each leaf represents transaction data. Parent nodes contain cryptographic hashes of their children. 
                  The root hash proves the integrity of all transactions without revealing individual details - perfect for ZK proofs! 🔐
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MerkleTreeVisualizer;
