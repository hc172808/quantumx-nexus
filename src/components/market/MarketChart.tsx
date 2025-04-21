
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  tokenId: string;
}

interface ChartData {
  name: string;
  value: number;
}

export function MarketChart({ tokenId }: ChartProps) {
  const [timeframe, setTimeframe] = useState('24h');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock data based on timeframe
        const dataPoints = timeframe === '24h' ? 24 : 
                          timeframe === '7d' ? 7 : 
                          timeframe === '30d' ? 30 : 90;
        
        const mockData: ChartData[] = [];
        const baseValue = Math.random() * 100 + 50; // Random starting value
        const volatility = timeframe === '24h' ? 0.01 : 
                          timeframe === '7d' ? 0.03 : 
                          timeframe === '30d' ? 0.05 : 0.08;
        
        for (let i = 0; i < dataPoints; i++) {
          // Calculate time label based on timeframe
          const label = timeframe === '24h' ? `${i}:00` : 
                      timeframe === '7d' ? `Day ${i+1}` : 
                      timeframe === '30d' ? `Week ${Math.floor(i/7)+1}` : `Month ${Math.floor(i/30)+1}`;
          
          // Random walk with drift for price simulation
          const randomChange = (Math.random() - 0.45) * volatility; // Slight upward bias
          const previousValue = i > 0 ? mockData[i-1].value : baseValue;
          const newValue = previousValue * (1 + randomChange);
          
          mockData.push({
            name: label,
            value: newValue
          });
        }
        
        setChartData(mockData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChartData();
  }, [timeframe, tokenId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Chart</CardTitle>
        <CardDescription>
          Historical performance data
        </CardDescription>
        <TabsList className="mt-2">
          <TabsTrigger 
            value="24h" 
            className={timeframe === '24h' ? 'bg-quantum/20' : ''}
            onClick={() => setTimeframe('24h')}
          >
            24H
          </TabsTrigger>
          <TabsTrigger 
            value="7d" 
            className={timeframe === '7d' ? 'bg-quantum/20' : ''}
            onClick={() => setTimeframe('7d')}
          >
            7D
          </TabsTrigger>
          <TabsTrigger 
            value="30d" 
            className={timeframe === '30d' ? 'bg-quantum/20' : ''}
            onClick={() => setTimeframe('30d')}
          >
            30D
          </TabsTrigger>
          <TabsTrigger 
            value="90d" 
            className={timeframe === '90d' ? 'bg-quantum/20' : ''}
            onClick={() => setTimeframe('90d')}
          >
            90D
          </TabsTrigger>
        </TabsList>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse h-full w-full bg-muted rounded-md"></div>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 20,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  tickLine={{ stroke: 'rgba(156, 163, 175, 0.5)' }}
                  axisLine={{ stroke: 'rgba(156, 163, 175, 0.5)' }}
                  // Show fewer ticks on smaller screens
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={{ stroke: 'rgba(156, 163, 175, 0.5)' }}
                  axisLine={{ stroke: 'rgba(156, 163, 175, 0.5)' }}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(24, 24, 27, 0.8)', 
                    border: '1px solid rgba(156, 163, 175, 0.2)',
                    borderRadius: '6px',
                    color: '#e4e4e7'
                  }} 
                  formatter={(value: number) => [`$${value.toFixed(4)}`, 'Price']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--quantum))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
