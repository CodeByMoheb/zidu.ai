import React from 'react';

interface ChartData {
  name: string;
  [key: string]: number | string;
}

interface BarChartProps {
  data: ChartData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const dataKey = Object.keys(data[0] || {}).find(key => key !== 'name') || '';
  const maxValue = Math.max(...data.map(d => d[dataKey] as number), 1); // Avoid division by zero
  const barWidth = 80; 
  const gap = 20;

  return (
    <div className="w-full h-full overflow-x-auto">
      <svg width={`${(barWidth + gap) * data.length - gap}px`} height="100%">
        <g>
          {data.map((item, index) => {
            const value = item[dataKey] as number;
            const barHeight = (value / maxValue) * 100;
            const x = index * (barWidth + gap);

            return (
              <g key={item.name} transform={`translate(${x}, 0)`}>
                {/* Bar */}
                <rect
                  y={`${100 - barHeight}%`}
                  width={barWidth}
                  height={`${barHeight}%`}
                  className="fill-fuchsia-500"
                  rx="4"
                />
                {/* Value Label */}
                <text
                  x={barWidth / 2}
                  y={`${95 - barHeight}%`}
                  textAnchor="middle"
                  className="fill-white text-sm font-bold"
                >
                  {value}
                </text>
                {/* Name Label */}
                <text
                  x={barWidth / 2}
                  y="100%"
                  dy="-5"
                  textAnchor="middle"
                  className="fill-gray-400 text-xs"
                >
                  {item.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default BarChart;
