
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Zap, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProofBuilderProps {
  compressionData: any;
  onProofGenerated: (proof: any) => void;
  onNext: () => void;
}

const ProofBuilder = ({ compressionData, onProofGenerated, onNext }: ProofBuilderProps) => {
  const [constraints, setConstraints] = useState({
    maxValue: "2.0",
    balanceCheck: true,
    noDoubleSpend: true,
    gasLimit: "100000"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [proof, setProof] = useState<any>(null);
  const { toast } = useToast();

  const generateProof = async () => {
    setIsGenerating(true);
    setProgress(0);

    const steps = [
      "Initializing circuit compiler...",
      "Building constraint system...",
      "Generating witness...",
      "Computing proof...",
      "Verifying proof..."
    ];

    for (let i = 0; i < steps.length; i++) {
      toast({
        title: "ZK Proof Generation",
        description: steps[i],
      });
      
      for (let j = 0; j <= 20; j++) {
        setProgress(i * 20 + j);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    const mockProof = {
      proof: {
        pi_a: ["0x1234567890abcdef...", "0xfedcba0987654321...", "0x1111111111111111..."],
        pi_b: [["0x2222222222222222...", "0x3333333333333333..."], ["0x4444444444444444...", "0x5555555555555555..."]],
        pi_c: ["0x6666666666666666...", "0x7777777777777777...", "0x8888888888888888..."]
      },
      publicSignals: [
        compressionData?.merkleRoot || "0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730",
        constraints.maxValue,
        constraints.gasLimit
      ],
      verificationKey: {
        vk_alpha_1: ["0xaaaaaaaaaaaaaaaa...", "0xbbbbbbbbbbbbbbbb..."],
        vk_beta_2: [["0xcccccccccccccccc...", "0xdddddddddddddddd..."], ["0xeeeeeeeeeeeeeeee...", "0xffffffffffffffff..."]],
        vk_gamma_2: [["0x1010101010101010...", "0x2020202020202020..."], ["0x3030303030303030...", "0x4040404040404040..."]],
        vk_delta_2: [["0x5050505050505050...", "0x6060606060606060..."], ["0x7070707070707070...", "0x8080808080808080..."]],
        vk_alphabeta_12: "processed",
        IC: ["0x9090909090909090...", "0xa0a0a0a0a0a0a0a0..."]
      },
      circuit: {
        constraints: compressionData?.constraints || 847,
        privateInputs: 12,
        publicInputs: 3,
        wires: 1200
      },
      metrics: {
        provingTime: "3.2s",
        verificationTime: "12ms",
        proofSize: "256 bytes",
        circuitSize: "15.2KB"
      }
    };

    setProof(mockProof);
    onProofGenerated(mockProof);
    setIsGenerating(false);
    
    toast({
      title: "Proof Generated Successfully! ✅",
      description: `Circuit with ${mockProof.circuit.constraints} constraints compiled and proven`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>ZK Proof Configuration</span>
          </CardTitle>
          <CardDescription>
            Define constraints and claims for your zero-knowledge proof
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="max-value">Maximum Transaction Value (ETH)</Label>
                <Input
                  id="max-value"
                  value={constraints.maxValue}
                  onChange={(e) => setConstraints(prev => ({ ...prev, maxValue: e.target.value }))}
                  placeholder="2.0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Prove no transaction exceeds this value
                </p>
              </div>
              
              <div>
                <Label htmlFor="gas-limit">Gas Limit Constraint</Label>
                <Input
                  id="gas-limit"
                  value={constraints.gasLimit}
                  onChange={(e) => setConstraints(prev => ({ ...prev, gasLimit: e.target.value }))}
                  placeholder="100000"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum gas used per transaction
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Integrity Constraints</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="balance-check"
                      checked={constraints.balanceCheck}
                      onChange={(e) => setConstraints(prev => ({ ...prev, balanceCheck: e.target.checked }))}
                    />
                    <Label htmlFor="balance-check" className="text-sm">Balance Conservation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="double-spend"
                      checked={constraints.noDoubleSpend}
                      onChange={(e) => setConstraints(prev => ({ ...prev, noDoubleSpend: e.target.checked }))}
                    />
                    <Label htmlFor="double-spend" className="text-sm">No Double Spending</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {compressionData && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-2">Compression Data Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Algorithm:</span>
                    <Badge variant="outline">{compressionData.algorithm}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Merkle Root:</span>
                    <code className="text-xs">{compressionData.merkleRoot?.slice(0, 12)}...</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Compression Ratio:</span>
                    <span>{Math.round((1 - compressionData.compressionRatio) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Constraints:</span>
                    <span>{compressionData.constraints}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Proof Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Generate ZK Proof</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isGenerating && !proof && (
            <Button 
              onClick={generateProof}
              size="lg"
              className="w-full"
              disabled={!compressionData}
            >
              Generate Zero-Knowledge Proof
            </Button>
          )}
          
          {isGenerating && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Generating proof...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
          
          {proof && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Proof Generated Successfully!</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Circuit Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Constraints:</span>
                      <Badge>{proof.circuit.constraints}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Private Inputs:</span>
                      <span>{proof.circuit.privateInputs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Public Inputs:</span>
                      <span>{proof.circuit.publicInputs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Wires:</span>
                      <span>{proof.circuit.wires}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Proving Time:</span>
                      <span>{proof.metrics.provingTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Verification Time:</span>
                      <span>{proof.metrics.verificationTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proof Size:</span>
                      <span>{proof.metrics.proofSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Circuit Size:</span>
                      <span>{proof.metrics.circuitSize}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Proof Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={JSON.stringify(proof.proof, null, 2)}
                    readOnly
                    className="font-mono text-xs h-32"
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {proof && (
        <div className="flex justify-end">
          <Button onClick={onNext} size="lg">
            View Results Dashboard →
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProofBuilder;
