import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend, Title, ChartOptions, Plugin } from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

interface Marker {
  tipe: string;
  last_latency: number;
}

const IntensitymeterCharts: React.FC = () => {
  const [chartData, setChartData] = useState<{ datasets: any[] }>({ datasets: [] });
  const [yAxisMax, setYAxisMax] = useState<number>(1);

  const latencyRanges = [
    { min: 0, max: 2, color: '#e27bdd', label: '0-2 ms' },
    { min: 2, max: 5, color: '#0506e4', label: '2-5 ms' },
    { min: 5, max: 15, color: '#7ca1ed', label: '5-15 ms' },
    { min: 15, max: 60, color: '#2de1e1', label: '15-60 ms' },
    { min: 60, max: 900, color: '#7de575', label: '60-900 ms' },
    { min: 900, max: Infinity, color: '#ebe8e4', label: '900+ ms' }
  ];

  useEffect(() => {
    fetch('/api/markers')
      .then(response => response.json())
      .then((data: Marker[]) => {
        const filteredData = data.filter(marker => 
          ['Intensitymeter REIS', 'Intensitymeter Realshake', 'Intensitymeter P-Alert+'].includes(marker.tipe)
        );

        const totalCount = filteredData.length;

        const datasets = latencyRanges.map((range, index) => {
          const count = filteredData.filter(marker => 
            marker.last_latency >= range.min && marker.last_latency < range.max
          ).length;
          const percentage = count / totalCount;
          return {
            label: range.label,
            data: [{ x: index, y: percentage, percentage }],
            backgroundColor: range.color,
            pointStyle: 'triangle',
            pointRadius: Math.sqrt(percentage) * 50,
            pointRotation: 0,
          };
        });

        const maxPercentage = Math.max(...datasets.map(dataset => dataset.data[0].percentage));
        setYAxisMax(maxPercentage > 0.5 ? 1 : 0.5);

        setChartData({ datasets });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const percentagePlugin: Plugin<'scatter'> = {
    id: 'percentagePlugin',
    afterDatasetsDraw: (chart) => {
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        if (!meta.hidden) {
          meta.data.forEach((element: any, index: number) => {
            const { x, y } = element.tooltipPosition();
            const percentage = dataset.data[index].percentage;
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${(percentage * 100).toFixed(1)}%`, x, y);
          });
        }
      });
    }
  };

  const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        min: -0.5,
        max: 5.5,
        ticks: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: yAxisMax,
        ticks: {
          callback: function(value) {
            return (value as number * 100).toFixed(0) + '%';
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const percentage = context.raw.percentage;
            return `${context.dataset.label}: ${(percentage * 100).toFixed(2)}%`;
          },
        },
      },
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          boxWidth: 12,
          padding: 8,
          font: {
            size: 10
          }
        }
      },
      title: {
        display: true,
        text: 'Intensitymeter',
        font: {
          size: 16,
        },
        padding: {
          top: 10,
          bottom: 10
        }
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 5,
        top: 0,
        bottom: 0
      }

    },
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '20px', 
      padding: '5px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: '100%',
      height: '50%'
    }}>
      <Scatter options={options} data={chartData} plugins={[percentagePlugin]} />
    </div>
  );
};

export default IntensitymeterCharts;
