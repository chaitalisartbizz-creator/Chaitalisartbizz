import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Package, Tag, Image as ImageIcon, Percent, Plus, TrendingUp, Users, Activity, Calendar, Loader2, Award, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ScrollReveal from '../../components/ScrollReveal';
import LiveBackground from '../../components/LiveBackground';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [serverStats, setServerStats] = useState(null);
  const [dateRange, setDateRange] = useState('7d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats');
        setServerStats(response.data);
      } catch (error) {
        console.error("Failed to fetch server stats:", error);
      }
    };
    fetchStats();
  }, []);

  const fetchAnalytics = async () => {
    setIsAnalyticsLoading(true);
    try {
      let url = `/api/analytics/stats?range=${dateRange}`;
      if (dateRange === 'custom' && customStart && customEnd) {
        url += `&start=${customStart}&end=${customEnd}`;
      }
      const response = await axios.get(url);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange === 'custom' && (!customStart || !customEnd)) return;
    fetchAnalytics();
  }, [dateRange, customStart, customEnd]);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = [
    { label: 'Total Artworks', value: serverStats?.database?.products || 0, icon: Package, path: '/admin/products', color: 'from-[#2C2C2C] to-[#1A1A1A]', shadow: 'shadow-[#2C2C2C]/20' },
    { label: 'Registered Clients', value: serverStats?.database?.users || 0, icon: Users, path: '/admin/customers', color: 'from-[#C9A84C] to-[#A8873A]', shadow: 'shadow-[#C9A84C]/20' },
    { label: 'Active Offers', value: serverStats?.database?.deals || 0, icon: Percent, path: '/admin/deals', color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
    { label: 'Art Categories', value: serverStats?.database?.categories || 0, icon: Tag, path: '/admin/categories', color: 'from-[#8B5E7A] to-[#603E53]', shadow: 'shadow-[#8B5E7A]/20' },
    { label: 'Media Assets Storage', value: formatBytes(serverStats?.cloudinary?.storageUsage || 0), limit: ' / 25 GB', icon: ImageIcon, path: '/admin/settings', color: 'from-purple-600 to-indigo-700', shadow: 'shadow-purple-500/20' },
    { label: 'Server Bandwidth', value: formatBytes(serverStats?.cloudinary?.bandwidthUsage || 0), limit: ' / 25 GB', icon: Activity, path: '/admin/settings', color: 'from-teal-600 to-emerald-600', shadow: 'shadow-teal-500/20' }
  ];

  return (
    <div className="relative min-h-screen animate-fade-in">
      <div className="relative z-10 space-y-8">
      {/* Welcome Banner */}
      <ScrollReveal>
        <div className="bg-gradient-to-r from-[#C9A84C] via-[#A8873A] to-[#C9A84C] rounded-3xl p-8 text-[#2C2C2C] shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#A8873A]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[#2C2C2C]/70 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={16} /> Artbizz Studio HQ
            </div>
            <h2 className="font-cinzel font-bold text-3xl mb-1 text-white">Artbizz Admin Hub ✨</h2>
            <p className="text-[#2C2C2C]/80 text-sm max-w-lg font-medium">
              Manage custom portraits, resin artworks, client requests, and track your gallery's creative performance.
            </p>
          </div>
          <div className="relative z-10 grid grid-cols-2 gap-3">
            <button onClick={() => navigate('/admin/products')} className="flex items-center justify-center gap-2 bg-[#2C2C2C]/80 text-white hover:bg-[#2C2C2C] px-4 py-2.5 rounded-xl font-bold text-xs transition-colors border border-white/10">
              <Plus size={16} /> Add Art
            </button>
            <button onClick={() => navigate('/admin/deals')} className="flex items-center justify-center gap-2 bg-white text-[#2C2C2C] hover:bg-stone-100 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-lg">
              <Plus size={16} /> Create Offer
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <ScrollReveal key={idx} delay={idx * 100} animation="scale-up-smooth">
              <Link to={stat.path} className="block h-full bg-white p-6 rounded-3xl border border-[#C9A84C]/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`}></div>
                <div className="flex items-center gap-5 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-stone-900 flex items-baseline gap-1">
                      {stat.value}
                      {stat.limit && <span className="text-xs font-bold text-stone-400">{stat.limit}</span>}
                    </p>
                    <p className="text-xs text-stone-600 font-bold mt-0.5">{stat.label}</p>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Web Analytics Chart */}
        <ScrollReveal delay={150} className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 border border-[#C9A84C]/30 shadow-sm h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="font-cinzel font-bold text-base text-stone-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#C9A84C]" /> Store Traffic & Customer Activity
              </h3>
              
              {/* Date Filters */}
              <div className="flex flex-wrap items-center gap-2 bg-[#F2EDE4]/50 p-1 rounded-xl border border-[#C9A84C]/30">
                <button 
                  onClick={() => setDateRange('7d')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${dateRange === '7d' ? 'bg-[#2C2C2C] text-[#C9A84C] shadow' : 'text-stone-600'}`}
                >
                  7 Days
                </button>
                <button 
                  onClick={() => setDateRange('1m')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${dateRange === '1m' ? 'bg-[#2C2C2C] text-[#C9A84C] shadow' : 'text-stone-600'}`}
                >
                  1 Month
                </button>
                <div className="flex items-center gap-2 px-2">
                  <button 
                    onClick={() => setDateRange('custom')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${dateRange === 'custom' ? 'bg-[#2C2C2C] text-[#C9A84C] shadow' : 'text-stone-600'}`}
                  >
                    <Calendar size={13} /> Custom
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full" style={{ minHeight: '280px' }}>
              {isAnalyticsLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-3">
                  <Loader2 size={32} className="animate-spin text-[#C9A84C]" />
                  <p className="text-xs font-bold">Loading store analytics...</p>
                </div>
              ) : analyticsData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-400">
                  <Activity size={32} className="opacity-20 mb-2" />
                  <p className="text-xs font-bold">No store traffic recorded for this period</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fef3c7" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#78350f', fontSize: 11}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#78350f', fontSize: 11}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: '1px solid #fde68a', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Area type="monotone" name="Page Views" dataKey="visits" stroke="#C9A84C" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Live Visitors widget */}
        <ScrollReveal delay={200} className="lg:col-span-1">
          <div className="bg-gradient-to-b from-[#2C2C2C] to-[#2a1405] rounded-3xl p-6 text-[#F2EDE4] shadow-lg flex flex-col items-center justify-center text-center h-full relative overflow-hidden border border-[#C9A84C]/30">
            <div className="bg-[#C9A84C]/20 p-4 rounded-full mb-3 backdrop-blur-sm border border-[#C9A84C]/30">
              <Activity size={28} className="text-[#C9A84C]" />
            </div>
            <h3 className="font-cinzel font-bold text-lg mb-1">Live Storefront Visitors</h3>
            <p className="text-[#C9A84C]/80 text-xs mb-5 max-w-[240px]">
              Real-time monitoring of clients browsing custom artworks & resin decor.
            </p>
            
            <button 
              onClick={() => navigate('/admin/live')}
              className="bg-[#C9A84C] text-stone-950 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#A8873A] transition-all shadow-md flex items-center gap-2"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </div>
              Open Live Monitor
            </button>
          </div>
        </ScrollReveal>
      </div>
      </div>
    </div>
  );
}
