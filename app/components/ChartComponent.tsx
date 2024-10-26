// src/app/components/ChartComponent.tsx
import React from "react";
import { Line } from "react-chartjs-2";

const ChartComponent = () => {
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Sent',
                data: [100, 200, 150, 300, 250, 400, 350],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
            },
            {
                label: 'Opened',
                data: [50, 150, 100, 200, 300, 250, 400],
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
            }
        ],
    };

    return (
        <div style={{ width: '100%', height: '300px' }}>
            <Line data={data} />
        </div>
    );
};

export default ChartComponent;
