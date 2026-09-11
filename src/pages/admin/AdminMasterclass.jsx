import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, GraduationCap, Edit3 } from 'lucide-react';
import { useData } from '../../context/DataContext';

const EMPTY = {
  id: null,
  title: '',
  instructor: '',
  level: 'Beginner',
  duration: '',
  price: '',
  tag: '',
  rating: 4.9,
  students: 0,
  img: '',
  modules: '',   // newline-separated list
};

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced'];

export default function AdminMasterclass() {
  const { masterclasses, saveMasterclasses } = useData();
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (masterclasses && masterclasses.length > 0) {
      setList(masterclasses.map(c => ({
        ...c,
        modules: Array.isArray(c.modules) ? c.modules.join('\n') : (c.modules || ''),
      })));
    }
  }, [masterclasses]);

  const openNew = () => setEditing({ ...EMPTY, id: Date.now() });
  const openEdit = (c) => setEditing({ ...c, modules: Array.isArray(c.modules) ? c.modules.join('\n') : (c.modules || '') });
  const cancelEdit = () => setEditing(null);

  const saveEdit = () => {
    const updated = {
      ...editing,
      price: Number(editing.price),
      rating: Number(editing.rating),
      students: Number(editing.students),
      modules: editing.modules.split('\n').map(m => m.trim()).filter(Boolean),
    };
    setList(prev => {
      const exists = prev.find(c => c.id === updated.id);
      return exists ? prev.map(c => c.id === updated.id ? updated : c) : [...prev, updated];
    });
    setEditing(null);
  };

  const deleteItem = (id) => setList(prev => prev.filter(c => c.id !== id));

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await saveMasterclasses(list);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert('Failed to save: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-cinzel font-bold text-gray-800 flex items-center gap-2">
            <GraduationCap className="text-[#C9A84C]" /> Featured Masterclass
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage courses shown on the Training Academy page</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openNew}
            className="flex items-center gap-2 bg-[#2C2C2C] text-[#C9A84C] px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1A1A1A] transition-colors">
            <Plus size={16} /> Add Course
          </button>
          <button onClick={handleSaveAll} disabled={saving}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${saved ? 'bg-emerald-600 text-white' : 'bg-[#C9A84C] text-[#2C2C2C] hover:bg-[#A8873A]'}`}>
            <Save size={16} /> {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Edit / Add Form */}
      {editing && (
        <div className="bg-white border border-[#C9A84C]/30 rounded-2xl p-6 shadow-lg">
          <h2 className="font-bold text-gray-800 mb-4 text-lg">{editing.id && list.find(c => c.id === editing.id) ? 'Edit Course' : 'New Course'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1">Course Title *</label>
              <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none"
                placeholder="e.g. Resin Art Masterclass" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Instructor *</label>
              <input value={editing.instructor} onChange={e => setEditing({ ...editing, instructor: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none"
                placeholder="e.g. Chaitali (Lead Artist)" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Level</label>
              <select value={editing.level} onChange={e => setEditing({ ...editing, level: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none bg-white">
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Price (₹) *</label>
              <input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none"
                placeholder="4999" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Duration</label>
              <input value={editing.duration} onChange={e => setEditing({ ...editing, duration: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none"
                placeholder="e.g. 4 Weeks" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Badge / Tag</label>
              <input value={editing.tag} onChange={e => setEditing({ ...editing, tag: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none"
                placeholder="e.g. Bestseller / New" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Rating (out of 5)</label>
              <input type="number" step="0.1" min="1" max="5" value={editing.rating} onChange={e => setEditing({ ...editing, rating: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none"
                placeholder="4.9" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Students Enrolled</label>
              <input type="number" value={editing.students} onChange={e => setEditing({ ...editing, students: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none"
                placeholder="1240" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1">Cover Image URL</label>
              <input value={editing.img} onChange={e => setEditing({ ...editing, img: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none"
                placeholder="https://..." />
              {editing.img && <img src={editing.img} alt="preview" className="mt-2 h-24 rounded-xl object-cover border border-gray-200" />}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1">Course Modules <span className="text-gray-400 font-normal">(one per line)</span></label>
              <textarea value={editing.modules} onChange={e => setEditing({ ...editing, modules: e.target.value })}
                rows={5}
                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C] outline-none resize-y"
                placeholder={"Safety & Setup\nMixing & Pigments\nGeode & Ocean Pours\nFinishing & Polishing"} />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={saveEdit}
              className="bg-[#C9A84C] text-[#2C2C2C] font-bold px-5 py-2.5 rounded-xl hover:bg-[#A8873A] transition-colors text-sm">
              ✓ Save Course
            </button>
            <button onClick={cancelEdit}
              className="text-gray-500 hover:text-gray-700 font-bold px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Course List */}
      {list.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl">
          <GraduationCap size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No masterclasses yet.</p>
          <p className="text-gray-400 text-sm mt-1">Click <strong>Add Course</strong> to create your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((course, idx) => (
            <div key={course.id} className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${idx === 0 ? 'border-[#C9A84C] ring-1 ring-[#C9A84C]/30' : 'border-gray-200'}`}>
              {idx === 0 && (
                <div className="bg-[#C9A84C] text-[#2C2C2C] text-[10px] font-black uppercase px-3 py-1 text-center">
                  ⭐ Featured (shown first)
                </div>
              )}
              {course.img && <img src={course.img} alt={course.title} className="w-full h-32 object-cover" />}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-gray-800 text-sm leading-tight">{course.title}</h3>
                  {course.tag && <span className="text-[10px] bg-[#C9A84C]/20 text-[#A8873A] font-bold px-2 py-0.5 rounded-full flex-shrink-0">{course.tag}</span>}
                </div>
                <p className="text-xs text-gray-500 mb-1">By {course.instructor}</p>
                <p className="text-xs text-gray-400 mb-3">{course.level} · {course.duration}</p>
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#2C2C2C] text-lg">₹{Number(course.price).toLocaleString()}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(course)}
                      className="p-2 text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded-lg transition-colors">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => deleteItem(course.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
