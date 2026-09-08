import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Heart, Sparkles, Paintbrush, Users, Gem } from 'lucide-react';
import Header from '../components/Header';

import LiveBackground from '../components/LiveBackground';
import ScrollReveal from '../components/ScrollReveal';
import { useData } from '../context/DataContext';

export default function AboutUsPage() {
  const { frontendSettings } = useData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const defaultData = {
    ownerName: "Chaitali Selot",
    ownerRole: "Founder & Lead Artist",
    ownerBio: "Chaitali Selot is the visionary behind Chaitali's Artbizz, bringing years of passion and expertise in handcrafted art. What started as a personal journey of creativity has blossomed into a premium studio dedicated to transforming spaces with soulful, meticulously crafted pieces. Her dedication to preserving traditional arts like Jain Mantra frames while pushing the boundaries of modern resin and fluid art has made Artbizz a trusted name for over 5000+ happy clients.",
    ownerImage: "/owner.png",
    marketingPartner: "Ivory Tech Solutions",
    eventPartner: "Atithi Events (Wedding Planner)",
    pageTitle: "Our Journey in Art",
    pageSubtitle: "Crafting premium handmade experiences for your soulful spaces."
  };

  let aboutData = defaultData;
  if (frontendSettings?.aboutUsData) {
    try {
      aboutData = { ...defaultData, ...JSON.parse(frontendSettings.aboutUsData) };
    } catch (e) { console.error("Failed to parse aboutUsData"); }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-stone-800 font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden flex items-center justify-center min-h-[60vh]">
        <div className="absolute inset-0 z-0">
          <LiveBackground theme="kintsugi-fluid" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-[#C9A84C]/30 text-[#F0DFA0] text-sm font-bold tracking-widest uppercase mb-6 shadow-xl">
              <Sparkles size={16} /> Since 2018
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-cinzel font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              {aboutData.pageTitle}
            </h1>
            <p className="text-lg md:text-2xl text-[#F2EDE4] font-medium max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
              {aboutData.pageSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal>
              <div className="relative group mx-auto lg:mx-0 max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#C9A84C] to-[#E3C976] rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
                <div className="relative rounded-[2rem] overflow-hidden border border-[#C9A84C]/30 shadow-2xl bg-white aspect-[4/5]">
                  <img src={aboutData.ownerImage} alt={aboutData.ownerName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
                    <h3 className="text-3xl font-cinzel font-bold text-white mb-1">{aboutData.ownerName}</h3>
                    <p className="text-[#C9A84C] font-bold tracking-wider uppercase text-sm">{aboutData.ownerRole}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-[#1A1A1A] leading-tight">
                  The Heart Behind The <span className="text-[#C9A84C]">Masterpieces</span>
                </h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-[#C9A84C] to-[#E3C976] rounded-full"></div>
                <p className="text-lg text-stone-600 leading-relaxed font-medium whitespace-pre-line">
                  {aboutData.ownerBio}
                </p>
                
                <div className="grid grid-cols-2 gap-6 pt-8 mt-8 border-t border-gray-200">
                  <div className="flex flex-col gap-2">
                    <span className="w-12 h-12 rounded-2xl bg-[#F2EDE4] flex items-center justify-center text-[#C9A84C] mb-2 shadow-inner">
                      <Heart size={24} />
                    </span>
                    <h4 className="text-xl font-bold font-cinzel text-stone-800">Made with Love</h4>
                    <p className="text-sm text-stone-500">Every piece tells a unique story.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="w-12 h-12 rounded-2xl bg-[#F2EDE4] flex items-center justify-center text-[#C9A84C] mb-2 shadow-inner">
                      <Gem size={24} />
                    </span>
                    <h4 className="text-xl font-bold font-cinzel text-stone-800">Premium Quality</h4>
                    <p className="text-sm text-stone-500">Only the finest materials used.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-[#1A1A1A] relative overflow-hidden border-y border-[#C9A84C]/20">
        <div className="absolute inset-0 opacity-20">
          <LiveBackground theme="brand-rich" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-white mb-4">Our Trusted Partners</h2>
              <div className="w-16 h-1 bg-[#C9A84C] mx-auto rounded-full"></div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ScrollReveal delay={0.1}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-[#C9A84C]/50 transition-colors text-center group h-full">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E3C976] flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="text-white" size={28} />
                </div>
                <h3 className="text-[#C9A84C] font-bold tracking-widest uppercase text-xs mb-3">Marketing Partner</h3>
                <h4 className="text-2xl font-cinzel font-bold text-white mb-2">{aboutData.marketingPartner}</h4>
                <p className="text-gray-400 text-sm">Empowering our digital growth and bringing our art to the world.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-[#C9A84C]/50 transition-colors text-center group h-full">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E3C976] flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Award className="text-white" size={28} />
                </div>
                <h3 className="text-[#C9A84C] font-bold tracking-widest uppercase text-xs mb-3">Event Partner</h3>
                <h4 className="text-2xl font-cinzel font-bold text-white mb-2">{aboutData.eventPartner}</h4>
                <p className="text-gray-400 text-sm">Crafting unforgettable experiences and grand celebrations.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center px-4">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-[#1A1A1A] mb-6">Ready to bring art into your life?</h2>
          <p className="text-stone-500 mb-8 max-w-2xl mx-auto">Browse our catalogue or request a custom handcrafted masterpiece tailored just for you.</p>
          <a href="/category" className="inline-flex items-center justify-center px-8 py-4 bg-[#1A1A1A] text-white font-bold rounded-xl hover:bg-[#C9A84C] transition-all shadow-xl hover:shadow-[#C9A84C]/30 hover:-translate-y-1">
            Explore Collection
          </a>
        </ScrollReveal>
      </section>

            {/* Footer */}
      <footer className="relative z-10 bg-[#2C2C2C] text-[#F0DFA0] border-t border-[#C9A84C]/30 pt-10 pb-24 md:pb-10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.jpg" alt="Chaitali's Artbizz" className="w-14 h-14 rounded-full border-2 border-[#C9A84C] object-cover" />
                <div>
                  <p className="font-cinzel font-bold text-[#F0DFA0] text-lg">CHAITALI'S</p>
                  <p className="font-cinzel text-[#C9A84C] tracking-widest text-sm">ARTBIZZ</p>
                </div>
              </div>
              <p className="text-[#C9A84C]/80 text-sm leading-relaxed italic">"Imagine. We Will Create."</p>
              <p className="text-stone-500 text-xs mt-2">Handcrafted art & personalised gifts made with love.</p>
            </div>
          </div>
          <div className="border-t border-[#C9A84C]/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-500 text-xs text-center md:text-left">© {new Date().getFullYear()} Chaitali's Artbizz. All rights reserved.</p>
            <p className="text-[#C9A84C] text-xs font-bold italic">Imagine. We Will Create.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
