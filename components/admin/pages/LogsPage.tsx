import React, { useMemo, useState } from 'react';

interface GenerationLog {
  feature: 'hug' | 'artist' | 'magic';
  timestamp: number;
  userName?: string;
}

const ITEMS_PER_PAGE = 10;

const LogsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const logs: GenerationLog[] = useMemo(() => {
        const storedLogsRaw = localStorage.getItem('zidu_user_logs');
        // Sort by most recent first
        return storedLogsRaw ? JSON.parse(storedLogsRaw).reverse() : [];
    }, []);

    const filteredLogs = useMemo(() => {
        return logs.filter(log =>
            (log.userName && log.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            log.feature.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [logs, searchTerm]);

    const paginatedLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredLogs, currentPage]);

    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

    const downloadCSV = () => {
        const headers = ['Timestamp', 'Feature', 'User Name'];
        const rows = logs.map(log => [
            new Date(log.timestamp).toLocaleString(),
            log.feature,
            log.userName || 'N/A'
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "zidu_ai_user_logs.csv");
        document.body.appendChild(link); 
        link.click();
        document.body.removeChild(link);
    };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">User Generation Logs</h1>
        <button onClick={downloadCSV} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors w-full md:w-auto">
            Download CSV
        </button>
      </div>
      
      <div className="bg-gray-900 p-4 rounded-lg">
          <input
            type="text"
            placeholder="Search by user or feature..."
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
            }}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
          />
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">Timestamp</th>
                        <th scope="col" className="px-6 py-3">Feature</th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">User Name</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedLogs.map((log, index) => (
                        <tr key={index} className="border-b border-gray-700 hover:bg-gray-800/50">
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                            <td className="px-6 py-4 capitalize">{log.feature}</td>
                            <td className="px-6 py-4">{log.userName || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {filteredLogs.length === 0 && <p className="text-center p-8 text-gray-500">No logs found.</p>}
      </div>

       {totalPages > 1 && (
        <div className="flex justify-between items-center text-sm text-gray-400">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="disabled:opacity-50">Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

export default LogsPage;