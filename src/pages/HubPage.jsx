import React, { useState } from 'react';
import { Play, Sparkles, ArrowRight, Video, Calendar, Star, CheckCircle, ChevronRight, GraduationCap } from 'lucide-react';
import Header from '../components/Header';
import ScrollReveal from '../components/ScrollReveal';
import LiveBackground from '../components/LiveBackground';

const COURSES = [
  { 
    id: 1, 
    title: 'Resin Art Masterclass', 
    level: 'Beginner to Advanced', 
    duration: '4 Weeks', 
    price: '₹4,999',
    img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=320&fit=crop', 
    instructor: 'Chaitali (Lead Artist)',
    tag: 'Bestseller', 
    rating: 4.9, 
    students: 1240,
    modules: ['Safety & Setup', 'Mixing & Pigments', 'Geode & Ocean Pours', 'Finishing & Polishing']
  },
  { 
    id: 2, 
    title: 'Digital Portrait Illustration 101', 
    level: 'Beginner', 
    duration: '3 Weeks', 
    price: '₹2,499',
    img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=320&fit=crop', 
    instructor: 'Artbizz Digital Team',
    tag: 'New', 
    rating: 4.8, 
    students: 450,
    modules: ['Procreate Basics', 'Sketching Faces', 'Coloring & Shading', 'Exporting for Print']
  },
  { 
    id: 3, 
    title: 'The Business of Custom Art', 
    level: 'Intermediate', 
    duration: '2 Weeks', 
    price: '₹1,999',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=320&fit=crop', 
    instructor: 'Chaitali (Founder)',
    tag: 'Business', 
    rating: 5.0, 
    students: 890,
    modules: ['Pricing Strategy', 'Instagram Marketing', 'Packaging & Shipping', 'Handling Clients']
  }
];

export default function HubPage() {
  const [activeTab, setActiveTab] = useState('All Courses');

  const featured = COURSES[0];
  const rest = COURSES.slice(1);

  return (
    <div className="min-h-screen mesh-bg">
      <Header />
      <main className="pb-24 md:pb-12">

        {/* Hero Section */}
        <ScrollReveal>
          <div className="relative z-10 overflow-hidden border-b border-[#C9A84C]/40 shadow-2xl">
            <LiveBackground theme="kintsugi-fluid" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
              <div className="inline-flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md border border-[#F0DFA0]/30 px-4 py-1.5 rounded-full shadow-xl">
                <GraduationCap size={18} className="text-[#F0DFA0]" />
                <span className="text-[#F0DFA0] text-xs font-bold uppercase tracking-widest">Artbizz Training Academy</span>
              </div>
              <h1 className="font-cinzel font-black text-4xl md:text-6xl text-[#F0DFA0] leading-tight mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                Master the Art of Creation
              </h1>
              <p className="text-[#C9A84C] text-sm md:text-lg max-w-2xl mx-auto font-medium mb-8 drop-shadow-md">
                Learn directly from Chaitali and the Artbizz team. Unlock premium courses on Resin Art, Digital Design, and building a successful art business.
              </p>
              <div className="flex justify-center gap-4">
                <button className="bg-[#C9A84C] hover:bg-[#F0DFA0] text-[#2C2C2C] font-black text-sm px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(201,168,76,0.4)] transition-all flex items-center gap-2">
                  Explore Courses <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-12">
          
          <ScrollReveal animation="fade-down" delay={100}>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-10">
              {['All Courses', 'Resin Art', 'Digital Design', 'Business'].map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`flex-shrink-0 text-xs font-bold px-5 py-2.5 rounded-xl transition-all border-2 ${activeTab === t ? 'bg-[#2C2C2C] text-[#C9A84C] border-[#2C2C2C] shadow-lg' : 'bg-transparent text-stone-700 border-[#C9A84C]/30 hover:border-[#C9A84C]'}`}>
                  {t}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Featured Masterclass */}
          <ScrollReveal animation="scale-up" delay={150}>
            <h2 className="font-cinzel font-bold text-2xl text-stone-900 mb-6 flex items-center gap-2">
              <Sparkles className="text-[#C9A84C]" /> Featured Masterclass
            </h2>
            <div className="bg-white rounded-[2rem] border border-[#C9A84C]/30 overflow-hidden shadow-2xl mb-12 flex flex-col lg:flex-row group relative">
              <div className="lg:w-1/2 relative overflow-hidden" style={{ minHeight: 300 }}>
                <img src={featured.img} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#C9A84C] text-[#2C2C2C] text-xs font-black uppercase px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                    <Star size={12} className="fill-[#2C2C2C]" /> {featured.tag}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex gap-3 text-white">
                  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold">
                    <Video size={14} className="text-[#C9A84C]" /> 40+ Lessons
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold">
                    <Calendar size={14} className="text-[#C9A84C]" /> {featured.duration}
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-center relative">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={14} className="text-[#C9A84C] fill-[#C9A84C]" />
                  <span className="text-stone-600 text-xs font-bold">{featured.rating} ({featured.students} students)</span>
                </div>
                <h3 className="font-cinzel font-bold text-3xl md:text-4xl text-stone-900 leading-tight mb-2">{featured.title}</h3>
                <p className="text-[#A8873A] font-bold text-sm mb-4">Instructed by {featured.instructor}</p>
                
                <div className="space-y-3 mb-8">
                  {featured.modules.map((mod, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-stone-600 font-medium">
                      <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                      {mod}
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-stone-200">
                  <div className="text-3xl font-black text-[#2C2C2C]">{featured.price}</div>
                  <button className="w-full sm:w-auto flex-1 bg-[#2C2C2C] hover:bg-[#1A1A1A] text-[#C9A84C] font-bold py-3.5 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2">
                    Enroll Now <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* More Courses */}
          <ScrollReveal animation="fade-up" delay={200}>
            <h2 className="font-cinzel font-bold text-2xl text-stone-900 mb-6 flex items-center gap-2">
              <Play className="text-[#C9A84C]" /> Specializations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((course, idx) => (
                <div key={course.id} className="bg-white rounded-2xl border border-[#C9A84C]/30 overflow-hidden shadow-lg hover:shadow-xl hover:border-[#C9A84C] transition-all group flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow">
                      {course.tag}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-wide bg-[#C9A84C]/10 px-2 py-0.5 rounded">{course.level}</span>
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-[#C9A84C] fill-[#C9A84C]" />
                        <span className="text-stone-600 text-xs font-bold">{course.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-cinzel font-bold text-xl text-stone-900 leading-tight mb-1">{course.title}</h3>
                    <p className="text-stone-500 text-xs font-medium mb-4">By {course.instructor}</p>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-100">
                      <span className="font-black text-[#2C2C2C] text-lg">{course.price}</span>
                      <button className="bg-[#F2EDE4] hover:bg-[#C9A84C] text-[#A8873A] hover:text-[#2C2C2C] font-bold text-xs px-4 py-2 rounded-lg transition-colors">
                        View Course
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

        </div>
      </main>
    </div>
  );
}
