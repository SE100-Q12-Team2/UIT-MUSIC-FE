import React, { useState, useMemo } from 'react';
import { DailyStatItem } from '@/core/api/admin.api';

interface StreamingChartProps {
  data: DailyStatItem[];
}

const StreamingChart: React.FC<StreamingChartProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; x: number; y: number } | null>(null);

  const chartConfig = {
    width: 800,
    height: 300,
    padding: { top: 20, right: 20, bottom: 40, left: 60 },
  };

  const { chartWidth, chartHeight } = useMemo(() => ({
    chartWidth: chartConfig.width - chartConfig.padding.left - chartConfig.padding.right,
    chartHeight: chartConfig.height - chartConfig.padding.top - chartConfig.padding.bottom,
  }), []);

  const { points, maxValue, minValue } = useMemo(() => {
    if (!data || data.length === 0) {
      return { points: [], maxValue: 0, minValue: 0 };
    }

    const values = data.map(d => d.totalPlays);
    const max = Math.max(...values);
    const min = Math.min(...values);

    const calculatedPoints = data.map((item, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y = chartHeight - ((item.totalPlays - min) / (max - min || 1)) * chartHeight;
      return { x, y, value: item.totalPlays, date: item.statDate };
    });

    return { points: calculatedPoints, maxValue: max, minValue: min };
  }, [data, chartWidth, chartHeight]);

  const pathData = useMemo(() => {
    if (points.length === 0) return '';
    
    const path = points.map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${point.x} ${point.y}`;
    }).join(' ');
    
    return path;
  }, [points]);

  const areaData = useMemo(() => {
    if (points.length === 0) return '';
    
    const path = pathData;
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    
    return `${path} L ${lastPoint.x} ${chartHeight} L ${firstPoint.x} ${chartHeight} Z`;
  }, [pathData, points, chartHeight]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const yAxisLabels = useMemo(() => {
    const labelCount = 5;
    const step = (maxValue - minValue) / (labelCount - 1);
    return Array.from({ length: labelCount }, (_, i) => {
      const value = minValue + step * i;
      const y = chartHeight - ((value - minValue) / (maxValue - minValue || 1)) * chartHeight;
      return { value, y };
    }).reverse();
  }, [maxValue, minValue, chartHeight]);

  const xAxisLabels = useMemo(() => {
    if (points.length === 0) return [];
    const labelCount = Math.min(6, points.length);
    const step = Math.floor(points.length / (labelCount - 1));
    return Array.from({ length: labelCount }, (_, i) => {
      const index = i === labelCount - 1 ? points.length - 1 : i * step;
      return { ...points[index], index };
    });
  }, [points]);

  if (!data || data.length === 0) {
    return (
      <div className="streaming-chart-empty">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="streaming-chart mb-10">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${chartConfig.width} ${chartConfig.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${chartConfig.padding.left}, ${chartConfig.padding.top})`}>
          {/* Grid lines */}
          {yAxisLabels.map((label, i) => (
            <line
              key={i}
              x1={0}
              y1={label.y}
              x2={chartWidth}
              y2={label.y}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Y-axis labels */}
          {yAxisLabels.map((label, i) => (
            <text
              key={i}
              x={-10}
              y={label.y}
              textAnchor="end"
              dominantBaseline="middle"
              fill="rgba(255, 255, 255, 0.6)"
              fontSize="11"
              fontFamily="'Inter', sans-serif"
            >
              {formatNumber(label.value)}
            </text>
          ))}

          {/* X-axis labels */}
          {xAxisLabels.map((label, i) => (
            <text
              key={i}
              x={label.x}
              y={chartHeight + 25}
              textAnchor="middle"
              fill="rgba(255, 255, 255, 0.6)"
              fontSize="11"
              fontFamily="'Inter', sans-serif"
            >
              {formatDate(label.date)}
            </text>
          ))}

          {/* Area fill */}
          <path
            d={areaData}
            fill="url(#chartGradient)"
            opacity="0.8"
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={hoveredPoint?.index === index ? 5 : 3}
              fill="#3B82F6"
              stroke="#ffffff"
              strokeWidth="2"
              style={{ cursor: 'pointer', transition: 'r 0.2s' }}
              onMouseEnter={() => setHoveredPoint({ index, x: point.x, y: point.y })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* Tooltip */}
          {hoveredPoint !== null && (
            <g transform={`translate(${hoveredPoint.x}, ${hoveredPoint.y})`}>
              <rect
                x={hoveredPoint.x > chartWidth / 2 ? -120 : 10}
                y={-40}
                width="110"
                height="50"
                rx="6"
                fill="rgba(30, 30, 40, 0.95)"
                stroke="rgba(59, 130, 246, 0.5)"
                strokeWidth="1"
              />
              <text
                x={hoveredPoint.x > chartWidth / 2 ? -65 : 65}
                y={-20}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.9)"
                fontSize="11"
                fontFamily="'Inter', sans-serif"
                fontWeight="600"
              >
                {formatDate(points[hoveredPoint.index].date)}
              </text>
              <text
                x={hoveredPoint.x > chartWidth / 2 ? -65 : 65}
                y={-5}
                textAnchor="middle"
                fill="#3B82F6"
                fontSize="13"
                fontFamily="'Inter', sans-serif"
                fontWeight="700"
              >
                {formatNumber(points[hoveredPoint.index].value)} plays
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

export default StreamingChart;
