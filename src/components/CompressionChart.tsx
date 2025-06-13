
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingDown, PieChart as PieChartIcon, BarChart3 } from "lucide-react";

interface CompressionChartProps {
  data: {
    originalSize: number;
    methods: Array<{
      method: string;
      description: string;
      technique: string;
      originalSize: number;
      compressedSize: number;
      spaceSaved: number;
      compressionRatio: number;
      compressionPercentage: string;
      timeMs: number;
      efficiency: string;
    }>;
    transactionCount: number;
    isRealData: boolean;
    fileName: string;
  };
}

const CompressionChart = ({ data }: CompressionChartProps) => {
  // Use the best compression method for visualization
  const bestMethod = data.methods.reduce((best, current) => 
    parseFloat(current.compressionPercentage) > parseFloat(best.compressionPercentage) ? current : best
  );

  const barData = data.methods.map(method => ({
    name: method.method.replace(' Encoding', '').replace(' Tree', '').replace(' Filter', ''),
    original: Math.round(method.originalSize / 1024),
    compressed: Math.round(method.compressedSize / 1024),
    saved: Math.round(method.spaceSaved / 1024),
    percentage: parseFloat(method.compressionPercentage)
  }));

  const pieData = [
    { name: 'Compressed Data', value: bestMethod.compressedSize, color: '#22c55e' },
    { name: 'Space Saved', value: bestMethod.spaceSaved, color: '#3b82f6' }
  ];

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];
  const compressionRatio = bestMethod.compressionPercentage;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{`${label}`}</p>
          <p className="text-sm text-green-600">{`Compressed: ${payload[0]?.payload?.compressed} KB`}</p>
          <p className="text-sm text-blue-600">{`Saved: ${payload[0]?.payload?.saved} KB (${payload[0]?.payload?.percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">{Math.round(data.value / 1024)} KB ({((data.value / bestMethod.originalSize) * 100).toFixed(1)}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-lg">
          <CardTitle className="text-lg flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span>Compression Methods Comparison</span>
          </CardTitle>
          <div className="flex items-center space-x-2 mt-2">
            <TrendingDown className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-600">Best: {compressionRatio}% reduction</span>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                fontSize={12}
                fontWeight={500}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                label={{ value: 'Size (KB)', angle: -90, position: 'insideLeft' }}
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="compressed" 
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                stroke="#16a34a"
                strokeWidth={1}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <div className="text-xs text-muted-foreground">
              Analyzing <span className="font-semibold text-blue-600">{data.transactionCount}</span> transactions from <span className="font-semibold">{data.fileName}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-t-lg">
          <CardTitle className="text-lg flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <PieChartIcon className="w-5 h-5 text-white" />
            </div>
            <span>Best Method Breakdown</span>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {bestMethod.method} - {bestMethod.technique}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                stroke="#ffffff"
                strokeWidth={2}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-sm font-semibold text-green-700 dark:text-green-300">Efficiency</div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{compressionRatio}%</div>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">Saved</div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {Math.round(bestMethod.spaceSaved / 1024)} KB
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompressionChart;
