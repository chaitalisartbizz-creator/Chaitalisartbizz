import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, Mail, Phone, Calendar, Shield } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';

export default function AdminCustomers() {
  const auth = useAuth?.() || {};
  const [usersDb, setUsersDb] = useState(auth.usersDb || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('/api/customers');
        if (Array.isArray(response.data)) setUsersDb(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);
  
  // Filter and sort users (newest first)
  const filteredUsers = useMemo(() => {
    return (usersDb || [])
      .filter(user => {
        const search = (searchTerm || '').toLowerCase();
        const name = user.name ? String(user.name).toLowerCase() : '';
        const email = user.email ? String(user.email).toLowerCase() : '';
        const phone = user.phone ? String(user.phone).toLowerCase() : '';
        
        return name.includes(search) || email.includes(search) || phone.includes(search);
      })
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [usersDb, searchTerm]);

  const stats = [
    { label: 'Total Users/Leads', value: usersDb?.length || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'New This Week', value: filteredUsers.filter(u => (new Date() - new Date(u.createdAt)) < 7*24*60*60*1000).length, icon: Calendar, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Admin Accounts', value: usersDb?.filter(u => u.role === 'admin').length || 0, icon: Shield, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Customers & Leads</h1>
            <p className="text-gray-500 font-medium">View users registered through the store or captured by the Chatbot.</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <ScrollReveal delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-500 font-semibold">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">User Database</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search name, email, phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all w-64 md:w-80 text-sm"
              />
            </div>
          </div>
                    <div>
              {/* Mobile View */}
              <div className="block lg:hidden space-y-4 p-4">
                {loading ? (
                  <div className="p-8 text-center text-gray-500"><Loader2 className="animate-spin mx-auto mb-2" size={24} /> Loading...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="py-12 text-center bg-gray-50/50 rounded-2xl border border-gray-100">
                    <Users size={42} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-bold">No users found.</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col relative">
                      <div className="flex items-center gap-3 mb-3 border-b border-gray-50 pb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold border border-gray-300 shrink-0">
                          {user.name ? String(user.name).charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-base">{user.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500 font-medium">ID: {user.id ? String(user.id).slice(-6) : 'N/A'}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' : (user.role === 'lead' ? 'bg-[#F2EDE4] text-[#2C2C2C]' : 'bg-green-100 text-green-700')
                        }`}>
                          {user.role === 'admin' ? 'Admin' : (user.role === 'lead' ? 'Lead' : 'Customer')}
                        </span>
                      </div>
                      
                      <div className="space-y-1.5 mb-3">
                        {user.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} className="text-gray-400 shrink-0" /> <span className="truncate">{user.email}</span>
                          </div>
                        )}
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} className="text-gray-400 shrink-0" /> <span className="truncate">{user.phone}</span>
                          </div>
                        )}
                        {!user.email && !user.phone && <span className="text-sm text-gray-400 italic">No contact provided</span>}
                      </div>

                      <div className="flex justify-between items-center bg-gray-50 rounded-xl p-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Total Spend</span>
                          <span className="font-bold text-[#C9A84C]">₹{user.totalSpend || 0}</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Orders</span>
                          <span className="font-bold text-gray-700">{user.orders || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Contact Info</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Joined At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No customers or leads found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold border border-gray-300">
                            {user.name ? String(user.name).charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{user.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500 font-medium">ID: {user.id ? String(user.id).slice(-6) : 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        {user.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} className="text-gray-400" /> {user.email}
                          </div>
                        )}
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} className="text-gray-400" /> {user.phone}
                          </div>
                        )}
                        {!user.email && !user.phone && <span className="text-sm text-gray-400 italic">No contact provided</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' : (user.role === 'lead' ? 'bg-[#F2EDE4] text-[#2C2C2C]' : 'bg-green-100 text-green-700')
                        }`}>
                          {user.role === 'admin' ? 'Admin' : (user.role === 'lead' ? 'Lead' : 'Customer')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-500">
                        {new Date(user.createdAt).toLocaleString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
