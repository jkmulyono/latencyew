// src/app/components/SummaryCard.tsx
import React from "react";

type SummaryCardProps = {
    title: string;
    value: number;
    color: string;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, color }) => (
    <div style={{ backgroundColor: color, padding: '20px', borderRadius: '10px', marginBottom: '10px' }}>
        <h3>{title}</h3>
        <h2>{value}</h2>
    </div>
);

export default SummaryCard;
