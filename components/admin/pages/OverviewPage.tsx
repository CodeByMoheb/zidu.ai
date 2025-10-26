import React, { useMemo } from 'react';
import BarChart from '../BarChart';

interface GenerationLog {
  feature: 'hug' | 'artist' | 'magic';
  timestamp: number;
  userName?: string;
}

const StatCard: React.FC<{ title: string; value: string | number; gradient: string }> = ({ title, value, gradient }) => (
    <div className={`p-6 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-lg`}>
        <p className="text-sm text-gray-200">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);


const OverviewPage: React.FC = () => {
    const logs: GenerationLog[] = useMemo(() => {
        const storedLogsRaw = localStorage.getItem('zidu_user_logs');
        return storedLogsRaw ? JSON.parse(storedLogsRaw) : [];
    }, []);

    const stats = useMemo(() => {
        const uniqueUsers = new Set(logs.filter(l => l.feature === 'hug' && l.userName).map(l => l.userName)).size;
        return {
            total: logs.length,
            hug: logs.filter(l => l.feature === 'hug').length,
            artist: logs.filter(l => l.feature === 'artist').length,
            magic: logs.filter(l => l.feature === 'magic').length,
            uniqueUsers: uniqueUsers,
        }
    }, [logs]);

    const chartData = useMemo(() => {
        const data: { name: string; Generations: number }[] = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });

            const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
            const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

            const count = logs.filter(log => log.timestamp >= startOfDay && log.timestamp < endOfDay).length;
            data.push({ name: dayStr, Generations: count });
        }
        return data;
    }, [logs]);
    

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Generations" value={stats.total} gradient="from-fuchsia-500 to-indigo-600" />
          <StatCard title="Memory Hugs" value={stats.hug} gradient="from-rose-500 to-pink-600" />
          <StatCard title="AI Artist" value={stats.artist} gradient="from-cyan-500 to-blue-600" />
          <StatCard title="Unique Users (Hug)" value={stats.uniqueUsers} gradient="from-amber-500 to-orange-600" />
      </div>
      <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Last 7 Days Activity</h2>
          <div className="h-72">
            <BarChart data={chartData} />
          </div>
      </div>
    </div>
  );
};

export default OverviewPage;
