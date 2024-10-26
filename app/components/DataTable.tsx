import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Sensor {
  id: number;
  kode_sta: string;
  lat: string;
  lon: string;
  kota: string;
  prov: string;
  tipe: string;
  last_latency: string;
}

type SortKey = keyof Sensor;

const DataTable: React.FC = () => {
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data, isLoading, error } = useQuery<Sensor[]>({
    queryKey: ['sensors'],
    queryFn: async () => {
      const response = await axios.get('/api/markers');
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  const sortedData = [...(data || [])].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: SortKey) => {
    setSortOrder(currentOrder => key === sortKey && currentOrder === 'asc' ? 'desc' : 'asc');
    setSortKey(key);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white text-2xs">
        <thead className="bg-gray-100">
          <tr>
            {['id', 'kode_sta', 'lat', 'lon', 'kota', 'prov', 'tipe', 'last_latency'].map((key) => (
              <th 
                key={key} 
                className="px-1 py-0.5 text-2xs font-medium cursor-pointer"
                onClick={() => handleSort(key as SortKey)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
                {sortKey === key && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((sensor) => (
            <tr key={sensor.id} className={sensor.id % 2 === 0 ? 'bg-gray-50' : ''}>
              {Object.values(sensor).map((value, index) => (
                <td key={index} className="px-1 py-0.5 text-2xs">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
