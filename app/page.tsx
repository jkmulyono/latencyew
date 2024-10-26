'use client'

// src/app/page.tsx

import React from "react";
//import MapChart from "./components/MapChart";

import SummaryCard from "./components/SummaryCard";
import MapComponent from "./components/MapComponent";
//import ChartComponent from "./components/ChartComponent";
import DataTable from "./components/DataTabls";
import AccelerographCharts from "./components/AccelerographCharts"; 
import IntensitymeterCharts from "./components/IntensitymeterCharts";
import StatusSensor from "./components/StatusSensor";
import LocationDetails from "./components/LocationDetails";

// Sample data for the data table with the correct type


const HomePage = () => (
    <div className="p-5">
        <div className="grid grid-cols-3 gap-5 mb-5">
            <div className="col-span-2">
                <MapComponent />
            </div>
            <div className="col-span-1">
                <SummaryCard title="Jumlah  Sensor Aktif" value={271} color="#DFF5E9" />
                <SummaryCard title="Jumlah Sensor Mati" value={30} color="#FADBD8" />
                
                <LocationDetails />
                
            </div>
        </div>
        
        <div className="flex justify-between gap-5">
            <div className="w-1/4">
                <AccelerographCharts />
                <IntensitymeterCharts />
            </div>
            <div className="w-1/2">
                <DataTable />
            </div>
            <div className="w-1/4">
                {/* You can add another component here if needed */}
                <StatusSensor />
            </div>
        </div>
    </div>
);

export default HomePage;
