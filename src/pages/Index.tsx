
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import TransactionExplorer from "@/components/TransactionExplorer";
import CompressionAnalyzer from "@/components/CompressionAnalyzer";
import ProofBuilder from "@/components/ProofBuilder";
import ResultsDashboard from "@/components/ResultsDashboard";
import { Upload, Database, Shield, BarChart3, Sparkles } from "lucide-react";

const Index = () => {
  const [activeStep, setActiveStep] = useState("explore");
  const [uploadedData, setUploadedData] = useState(null);
  const [compressionResults, setCompressionResults] = useState(null);
  const [proofResults, setProofResults] = useState(null);

  const steps = [
    { id: "explore", title: "Transaction Explorer", icon: Database, completed: !!uploadedData },
    { id: "compress", title: "Compression Analysis", icon: BarChart3, completed: !!compressionResults },
    { id: "proof", title: "ZK Proof Builder", icon: Shield, completed: !!proofResults },
    { id: "results", title: "Results Dashboard", icon: Upload, completed: false },
  ];

  const getProgressValue = () => {
    const completedSteps = steps.filter(step => step.completed).length;
    return (completedSteps / steps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                  ProofPack
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Zero-Knowledge Blockchain Optimizer & Visualizer
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4 shadow-sm border animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
            <span className="text-sm font-bold text-primary">{Math.round(getProgressValue())}%</span>
          </div>
          <Progress value={getProgressValue()} className="h-2" />
        </div>
      </div>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8 bg-card/40 backdrop-blur-sm rounded-xl p-6 shadow-sm border">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            const isCompleted = step.completed;
            
            return (
              <div key={step.id} className="flex items-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div 
                  className={`flex items-center space-x-3 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isActive ? 'text-primary' : isCompleted ? 'text-emerald-600' : 'text-muted-foreground'
                  }`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive ? 'border-primary bg-primary/10 shadow-lg' : 
                    isCompleted ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'border-muted hover:border-primary/50'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-semibold text-sm">{step.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {isCompleted ? '✓ Complete' : isActive ? 'In Progress' : 'Pending'}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-6 rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-gradient-to-r from-emerald-500 to-blue-500' : 'bg-muted'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="animate-fade-in">
          <Tabs value={activeStep} className="w-full">
            <TabsContent value="explore" className="mt-0">
              <div className="transform transition-all duration-500 ease-out">
                <TransactionExplorer 
                  onDataUploaded={setUploadedData}
                  onNext={() => setActiveStep("compress")}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="compress" className="mt-0">
              <div className="transform transition-all duration-500 ease-out">
                <CompressionAnalyzer 
                  data={uploadedData}
                  onCompressionComplete={setCompressionResults}
                  onNext={() => setActiveStep("proof")}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="proof" className="mt-0">
              <div className="transform transition-all duration-500 ease-out">
                <ProofBuilder 
                  compressionData={compressionResults}
                  onProofGenerated={setProofResults}
                  onNext={() => setActiveStep("results")}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="results" className="mt-0">
              <div className="transform transition-all duration-500 ease-out">
                <ResultsDashboard 
                  uploadedData={uploadedData}
                  compressionResults={compressionResults}
                  proofResults={proofResults}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
