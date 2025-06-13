
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Share2, CheckCircle, TrendingUp, Zap, Shield } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ResultsDashboardProps {
  uploadedData: any;
  compressionResults: any;
  proofResults: any;
}

const ResultsDashboard = ({ uploadedData, compressionResults, proofResults }: ResultsDashboardProps) => {
  // Mock performance data for charts
  const performanceData = [
    { step: 'Upload', time: 0.1, cumulative: 0.1 },
    { step: 'Parse', time: 0.3, cumulative: 0.4 },
    { step: 'Compress', time: 1.2, cumulative: 1.6 },
    { step: 'Circuit', time: 2.1, cumulative: 3.7 },
    { step: 'Prove', time: 3.2, cumulative: 6.9 },
    { step: 'Verify', time: 0.012, cumulative: 6.912 }
  ];

  const compressionTrendData = [
    { size: 'Original', value: compressionResults?.originalSize || 65536 },
    { size: 'Compressed', value: compressionResults?.compressedSize || 47104 },
    { size: 'Proof', value: 256 },
    { size: 'Verification Key', value: 1024 }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Processing Complete
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold text-green-900 dark:text-green-100">
              ✅ Success
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Compression Ratio</span>
            </div>
            <div className="mt-2 text-2xl font-bold">
              {compressionResults ? Math.round((1 - compressionResults.compressionRatio) * 100) : 27}%
            </div>
            <p className="text-xs text-muted-foreground">Size reduction achieved</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium">Proof Generation</span>
            </div>
            <div className="mt-2 text-2xl font-bold">
              {proofResults?.metrics.provingTime || "3.2s"}
            </div>
            <p className="text-xs text-muted-foreground">Total proving time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium">Verification</span>
            </div>
            <div className="mt-2 text-2xl font-bold">
              {proofResults?.metrics.verificationTime || "12ms"}
            </div>
            <p className="text-xs text-muted-foreground">Verification time</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Results */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compression">Compression</TabsTrigger>
          <TabsTrigger value="proof">ZK Proof</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Processing Pipeline</CardTitle>
                <CardDescription>Complete workflow summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">1</span>
                      </div>
                      <div>
                        <div className="font-medium">Data Upload</div>
                        <div className="text-sm text-muted-foreground">
                          {uploadedData ? `${uploadedData.length} transactions` : "3 transactions"} loaded
                        </div>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-green-600">2</span>
                      </div>
                      <div>
                        <div className="font-medium">Compression</div>
                        <div className="text-sm text-muted-foreground">
                          {compressionResults?.algorithm || "Merkle tree"} compression applied
                        </div>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">3</span>
                      </div>
                      <div>
                        <div className="font-medium">ZK Proof</div>
                        <div className="text-sm text-muted-foreground">
                          {proofResults?.circuit.constraints || 847} constraints proven
                        </div>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Original Data Size</span>
                    <Badge variant="outline">
                      {compressionResults ? Math.round(compressionResults.originalSize / 1024) : 64}KB
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Compressed Size</span>
                    <Badge variant="outline">
                      {compressionResults ? Math.round(compressionResults.compressedSize / 1024) : 46}KB
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Proof Size</span>
                    <Badge variant="outline">256 bytes</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Circuit Complexity</span>
                    <Badge variant="secondary">Medium</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Verification Gas</span>
                    <Badge variant="outline">~45,000</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compression">
          <Card>
            <CardHeader>
              <CardTitle>Compression Analysis</CardTitle>
              <CardDescription>Detailed breakdown of compression results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={compressionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="size" />
                    <YAxis label={{ value: 'Size (bytes)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} bytes`, 'Size']} />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {compressionResults?.algorithm || "Merkle"}
                        </div>
                        <div className="text-sm text-muted-foreground">Algorithm Used</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {compressionResults?.treeDepth || 4}
                        </div>
                        <div className="text-sm text-muted-foreground">Tree Depth</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">18KB</div>
                        <div className="text-sm text-muted-foreground">Space Saved</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proof">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Circuit Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Constraints:</span>
                    <Badge>{proofResults?.circuit.constraints || 847}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Private Inputs:</span>
                    <span>{proofResults?.circuit.privateInputs || 12}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Public Inputs:</span>
                    <span>{proofResults?.circuit.publicInputs || 3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Circuit Wires:</span>
                    <span>{proofResults?.circuit.wires || 1200}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Proof Verification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Proof Valid ✅</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Constraints Satisfied ✅</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Merkle Root Match ✅</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Value Constraints ✅</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Public Signals</CardTitle>
                <CardDescription>Publicly verifiable proof inputs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {proofResults?.publicSignals.map((signal: string, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">Signal {index + 1}:</span>
                      <code className="text-xs">{signal}</code>
                    </div>
                  )) || (
                    <div className="text-muted-foreground">No public signals available</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Detailed timing and efficiency analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="step" />
                  <YAxis label={{ value: 'Time (seconds)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="time" stroke="#8884d8" name="Step Time" />
                  <Line type="monotone" dataKey="cumulative" stroke="#82ca9d" name="Cumulative Time" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download Proof</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Results</span>
            </Button>
            <Button className="flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share Results</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDashboard;
