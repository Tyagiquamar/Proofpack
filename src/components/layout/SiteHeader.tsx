import { Button } from "@/components/ui/button";
import { Shield, Sparkles, Github } from "lucide-react";
import { Link } from "react-router-dom";

export function SiteHeader() {
  return (
    <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                ProofPack
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/explorer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Explorer
            </Link>
            <Link to="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com/Qoder12/proofpack-insight-forge" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
            {/* <Button size="sm" className="gap-1">
              <Link to="/explorer" className="flex items-center">
                <Sparkles className="w-4 h-4 mr-1" />
                Launch App
              </Link>
            </Button> */}
          </div>
        </div>
      </div>
    </header>
  );
}
