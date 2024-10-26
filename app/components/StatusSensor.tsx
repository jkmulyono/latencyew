import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Marker {
  tipe: string;
  last_latency: number;
}

const StatusSensorChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [totalSensors, setTotalSensors] = useState(0);

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
        const accelerographMarkers = data.filter(marker => 
          ['Accelerograph REIS Non-Collocated', 'Accelerograph Non-Collocated','Intensitymeter REIS', 'Intensitymeter Realshake','Accelerograph REIS', 'Accelerograph Non Colocated', 'Accelerograph Collocated', 'Accelerograph 2020','Intensitymeter REIS', 'Intensitymeter P-Alert', 'Intensitymeter P-Alert+'].includes(marker.tipe)
        );

        const counts = latencyRanges.map(range => 
          accelerographMarkers.filter(marker => marker.last_latency >= range.min && marker.last_latency < range.max).length
        );

        setTotalSensors(accelerographMarkers.length);

        setChartData({
          labels: latencyRanges.map(range => range.label),
          datasets: [{
            data: counts,
            backgroundColor: latencyRanges.map(range => range.color),
            borderWidth: 0,
            circumference: 270,
            rotation: 225,
          }]
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const options = {
    cutout: '75%',
    plugins: {
      legend: {
        display: true,
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / totalSensors) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  if (!chartData) return <div>Loading...</div>;
  return (
    <div style={{ 
      position: 'relative', 
      width: '400px', 
      height: '300px', 
      backgroundColor: 'white', 
      paddingLeft: '5px',
      borderRadius: '20px'
    }}>
      <Doughnut data={chartData} options={options} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '37.5%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color:'black' }}>{totalSensors}</div>
        <div style={{ color:'black' }}>Total Sensor</div>
      </div>
    </div>
  );
};

export default StatusSensorChart;
