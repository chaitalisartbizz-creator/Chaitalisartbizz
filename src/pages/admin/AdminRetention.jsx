import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Repeat, TrendingUp, DollarSign, Calendar, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';

function ScrollReveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

const StatCard = ({ title, value, subtitle, icon: Icon, color, delay, onClick }) => (
  <ScrollReveal delay={delay}>
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-all active:scale-[0.98]' : ''}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${color} shadow-sm flex-shrink-0`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  </ScrollReveal>
);

export default function AdminRetention() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalType, setModalType] = useState(null); // 'REPEAT', 'RATE', 'LTV'

  useEffect(() => {
    fetchRetention();
  }, []);

  const fetchRetention = async () => {
    try {
      const res = await axios.get('/api/analytics/retention');
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch retention data', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = data?.topCustomers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Retention & Billing</h1>
          <p className="text-gray-500 mt-1">Track customer loyalty and lifetime value</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-400">Loading analytics...</div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard 
              title="Total Customers" 
              value={data.totalCustomers} 
              icon={Users} 
              color="from-blue-500 to-blue-600"
              delay={0}
            />
            <StatCard 
              title="Repeat Customers" 
              value={data.repeatCustomers} 
              icon={Repeat} 
              color="from-purple-500 to-purple-600"
              delay={0.1}
              onClick={() => setModalType('REPEAT')}
            />
            <StatCard 
              title="Retention Rate" 
              value={`${data.retentionRate}%`} 
              subtitle="Ordered more than once"
              icon={TrendingUp} 
              color="from-green-500 to-green-600"
              delay={0.2}
              onClick={() => setModalType('RATE')}
            />
            <StatCard 
              title="Total LTV Revenue" 
              value={`₹${data.totalRevenue.toLocaleString()}`} 
              icon={DollarSign} 
              color="from-[#C9A84C] to-[#C9A84C]"
              delay={0.3}
              onClick={() => setModalType('LTV')}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">Top Customers</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] transition-all text-sm"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                    <th className="p-4 pl-6">Customer</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Orders</th>
                    <th className="p-4">Lifetime Value</th>
                    <th className="p-4 pr-6">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCustomers?.map((customer, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{customer.name}</p>
                            {customer.visitorId && (
                              <p className="text-xs text-gray-400">Profile: {customer.visitorId.substring(0,8)}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-700 font-medium">{customer.phone}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${customer.orderCount > 1 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                          {customer.orderCount}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-900 font-bold">₹{customer.totalSpent.toLocaleString()}</p>
                      </td>
                      <td className="p-4 pr-6">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Calendar size={14} />
                          {new Date(customer.lastOrderDate).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">
                        No customers found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}

      {/* Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative max-h-[80vh] flex flex-col">
            <button 
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              {modalType === 'REPEAT' && <><Repeat size={20} className="text-purple-500"/> Repeat Customers Data</>}
              {modalType === 'RATE' && <><TrendingUp size={20} className="text-green-500"/> Retention Rate Breakdown</>}
              {modalType === 'LTV' && <><DollarSign size={20} className="text-[#C9A84C]"/> LTV Revenue Breakdown</>}
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-4">
              {modalType === 'REPEAT' && (
                <div>
                  <p className="text-gray-600 mb-4">You have <span className="font-bold">{data?.repeatCustomers}</span> customers who have ordered more than once.</p>
                  <div className="space-y-2">
                    {data?.topCustomers.filter(c => c.orderCount > 1).map((c, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="font-medium text-gray-800">{c.name}</span>
                        <span className="text-sm font-bold text-purple-600">{c.orderCount} Orders</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {modalType === 'RATE' && (
                <div>
                  <p className="text-gray-600 mb-4">Your current retention rate is <span className="font-bold text-green-600">{data?.retentionRate}%</span>.</p>
                  <p className="text-sm text-gray-500">This means that out of {data?.totalCustomers} total unique customers, {data?.repeatCustomers} have returned to make a second purchase or more. An excellent retention rate is typically around 20-30% in e-commerce.</p>
                </div>
              )}
              {modalType === 'LTV' && (
                <div>
                  <p className="text-gray-600 mb-4">Total Lifetime Value (LTV) Revenue is <span className="font-bold text-[#C9A84C]">₹{data?.totalRevenue.toLocaleString()}</span>.</p>
                  <div className="space-y-2">
                    {data?.topCustomers.slice(0, 10).map((c, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="font-medium text-gray-800">{c.name}</span>
                        <span className="text-sm font-bold text-green-600">₹{c.totalSpent.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
