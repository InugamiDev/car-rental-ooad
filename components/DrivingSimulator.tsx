'use client';

import { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';

interface DrivingSimulatorProps {
  distance: number; // in kilometers
  onSimulationComplete?: (results: SimulationResult) => void;
}

interface SimulationResult {
  originalPoints: number;
  adjustedPoints: number;
  breakdown: {
    distance: number;
    baseFormula: string;
    factors: {
      base: number;
      drivingStyle: number;
      traffic: number;
      timeOfDay: number;
      weather: number;
    };
    totalMultiplier: number;
  };
  estimatedTier: string;
  message: string;
}

export default function DrivingSimulator({ distance, onSimulationComplete }: DrivingSimulatorProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [drivingStyle, setDrivingStyle] = useState<'safe' | 'normal' | 'aggressive'>('normal');
  const [trafficConditions, setTrafficConditions] = useState<'light' | 'moderate' | 'heavy'>('moderate');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');
  const [weather, setWeather] = useState<'clear' | 'rain' | 'snow'>('clear');

  const runSimulation = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/simulation/driving', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          distance,
          drivingStyle,
          trafficConditions,
          timeOfDay,
          weather,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to run simulation');
      }

      const data = await response.json();
      setResults(data.simulation);
      onSimulationComplete?.(data.simulation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Driving Simulation</h3>
        <Badge variant="info">{distance} km</Badge>
      </div>

      <div className="space-y-4">
        {/* Driving Style */}
        <div>
          <label className="block text-sm font-medium mb-2">Driving Style</label>
          <div className="grid grid-cols-3 gap-2">
            {(['safe', 'normal', 'aggressive'] as const).map(style => (
              <Button
                key={style}
                variant={drivingStyle === style ? 'primary' : 'outline'}
                onClick={() => setDrivingStyle(style)}
                className="capitalize"
              >
                {style}
              </Button>
            ))}
          </div>
        </div>

        {/* Traffic Conditions */}
        <div>
          <label className="block text-sm font-medium mb-2">Traffic Conditions</label>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'moderate', 'heavy'] as const).map(traffic => (
              <Button
                key={traffic}
                variant={trafficConditions === traffic ? 'primary' : 'outline'}
                onClick={() => setTrafficConditions(traffic)}
                className="capitalize"
              >
                {traffic}
              </Button>
            ))}
          </div>
        </div>

        {/* Time of Day */}
        <div>
          <label className="block text-sm font-medium mb-2">Time of Day</label>
          <div className="grid grid-cols-2 gap-2">
            {(['day', 'night'] as const).map(time => (
              <Button
                key={time}
                variant={timeOfDay === time ? 'primary' : 'outline'}
                onClick={() => setTimeOfDay(time)}
                className="capitalize"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div>
          <label className="block text-sm font-medium mb-2">Weather</label>
          <div className="grid grid-cols-3 gap-2">
            {(['clear', 'rain', 'snow'] as const).map(condition => (
              <Button
                key={condition}
                variant={weather === condition ? 'primary' : 'outline'}
                onClick={() => setWeather(condition)}
                className="capitalize"
              >
                {condition}
              </Button>
            ))}
          </div>
        </div>

        {/* Run Simulation Button */}
        <Button 
          onClick={runSimulation} 
          className="w-full"
          disabled={loading}
          variant="primary"
        >
          {loading ? 'Simulating...' : 'Run Simulation'}
        </Button>

        {/* Results */}
        {results && (
          <div className="mt-6 space-y-4 p-4 bg-secondary rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm">Base Points:</span>
              <Badge variant="info">{results.originalPoints}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Adjusted Points:</span>
              <Badge variant="primary">{results.adjustedPoints}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Multiplier:</span>
              <Badge variant="success">×{results.breakdown.totalMultiplier}</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {results.message}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}
      </div>
    </Card>
  );
}