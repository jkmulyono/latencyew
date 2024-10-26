import React, { useState, useMemo } from 'react';
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

const hexToRgba = (hex: string, alpha: number = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getLatencyColor = (last_latency: number) => {
  if (last_latency < 2) return hexToRgba('#e27bdd', 0.3);
  if (last_latency < 5) return hexToRgba('#0506e4', 0.3);
  if (last_latency < 15) return hexToRgba('#7ca1ed', 0.3);
  if (last_latency < 60) return hexToRgba('#2de1e1', 0.3);
  if (last_latency < 900) return hexToRgba('#7de575', 0.3);
  return hexToRgba('#ebe8e4', 0.3);
};

const DataTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<SortKey>('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const itemsPerPage = 10;
  
    const { data, isLoading, error } = useQuery<Sensor[]>({
      queryKey: ['sensors'],
      queryFn: async () => {
        const response = await axios.get('/api/markers');
        return response.data;
      },
    });
  
    const filteredAndSortedData = useMemo(() => {
      if (!data) return [];
      
      let result = data.filter(sensor =>
        Object.values(sensor).some(value =>
          value != null && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      return result.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        if (aValue == null) return sortOrder === 'asc' ? -1 : 1;
        if (bValue == null) return sortOrder === 'asc' ? 1 : -1;
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }, [data, searchTerm, sortKey, sortOrder]);
  
    const pageCount = Math.ceil(filteredAndSortedData.length / itemsPerPage);
    const paginatedData = filteredAndSortedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const handleSort = (key: SortKey) => {
      setSortOrder(currentOrder => key === sortKey && currentOrder === 'asc' ? 'desc' : 'asc');
      setSortKey(key);
    };
  
    if (isLoading) return <div className="text-xs text-black">Loading...</div>;
    if (error) return <div className="text-xs text-red-500">An error occurred: {(error as Error).message}</div>;
  
    return (
      <div className="text-xs text-black bg-white rounded-lg p-4" >
        <input
          type="text"
          placeholder="Search..."
          className="mb-2 p-1 border border-gray-300 rounded text-xs w-full"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              {['id', 'kode_sta', 'lat', 'lon', 'kota', 'prov', 'tipe', 'last_latency'].map((key) => (
                <th 
                  key={key} 
                  className="p-1 text-left text-xs cursor-pointer"
                  onClick={() => handleSort(key as SortKey)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  {sortKey === key && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((sensor) => (
              <tr 
                key={sensor.id} 
                className="border-b border-gray-200"
                style={{ backgroundColor: getLatencyColor(parseFloat(sensor.last_latency)) }}
              >
                {Object.values(sensor).map((value, index) => (
                  <td key={index} className="p-0.5 text-xs">{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 flex justify-between items-center text-xs">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-1 py-0.5 border border-gray-300 rounded disabled:text-gray-400 text-xs"
          >
            Previous
          </button>
          <span>Page {currentPage} of {pageCount}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
            disabled={currentPage === pageCount}
            className="px-1 py-0.5 border border-gray-300 rounded disabled:text-gray-400 text-xs"
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  
  export default DataTable;
