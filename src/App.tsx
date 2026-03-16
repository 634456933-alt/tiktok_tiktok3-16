import React, { useState, useRef } from 'react';
import { Settings, Plus, Home, Users, MessageCircle, User, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePinch } from '@use-gesture/react';

// Mock data for the timeline
const timelineData = [
  {
    month: '10',
    items: [
      { day: '30', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=500&h=500&fit=crop' },
      { day: '28', img: null }, // No image record
      { day: '25', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&h=500&fit=crop' },
      { day: '24', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=500&h=500&fit=crop' },
      { day: '22', img: null },
      { day: '18', img: 'https://images.unsplash.com/photo-1513519247352-4d366bbdf943?q=80&w=500&h=500&fit=crop' },
      { day: '15', img: null },
      { day: '12', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=500&h=500&fit=crop' },
      { day: '10', img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=500&h=500&fit=crop' },
      { day: '8', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=500&h=500&fit=crop' },
      { day: '7', img: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=500&h=500&fit=crop' },
      { day: '5', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=500&h=500&fit=crop' },
    ]
  },
  {
    month: '9',
    items: [
      { day: '30', img: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=500&h=500&fit=crop' },
      { day: '28', img: null },
      { day: '25', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=500&h=500&fit=crop' },
      { day: '24', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=500&h=500&fit=crop' },
    ]
  },
  {
    month: '8',
    items: [
      { day: '24', img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=500&h=500&fit=crop' },
      { day: '20', img: null },
      { day: '18', img: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=500&h=500&fit=crop' },
      { day: '16', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=500&h=500&fit=crop' },
      { day: '15', img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=500&h=500&fit=crop' },
      { day: '14', img: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=500&h=500&fit=crop' },
      { day: '13', img: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=500&h=500&fit=crop' },
    ]
  }
];

const tabs = ['作品', '日常', '推荐', '收藏', '喜欢'];

export default function App() {
  const [activeTab, setActiveTab] = useState('日常');
  const [viewMode, setViewMode] = useState<'list' | 'thumbnail'>('list');
  const [pinchScale, setPinchScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  usePinch(
    ({ offset: [d], memo, active }) => {
      // Zoom in (d > 0) -> List
      // Zoom out (d < 0) -> Thumbnail
      if (!active) {
        if (d > 50 && viewMode === 'thumbnail') {
          setViewMode('list');
        } else if (d < -50 && viewMode === 'list') {
          setViewMode('thumbnail');
        }
        setPinchScale(1);
      } else {
        // Provide some visual feedback during pinch
        const newScale = 1 + d / 200;
        setPinchScale(Math.max(0.8, Math.min(1.2, newScale)));
      }
      return memo;
    },
    {
      target: containerRef,
      eventOptions: { passive: false },
    }
  );

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-white text-black font-sans antialiased select-none touch-pan-y"
    >
      {/* Status Bar Placeholder */}
      <div className="h-[44px] w-full bg-white sticky top-0 z-[60]" />

      {/* Top Navigation */}
      <nav className="sticky top-[44px] z-50 bg-white border-b border-gray-100">
        <div className="flex justify-between items-center h-[44px] px-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative h-full flex items-center text-[15px] transition-colors ${
                activeTab === tab ? 'text-black font-bold' : 'text-gray-400 font-medium'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-[-4px] right-[-4px] h-[3px] bg-black rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <motion.main 
        className="pb-24"
        animate={{ scale: pinchScale }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {activeTab === '日常' ? (
          <>
            {/* Recent 7 Days Section */}
        <div className="px-4 pt-4 pb-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[17px] font-bold">最近 7 天</h2>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-400 text-[14px]">
                  <Settings size={16} strokeWidth={2} />
                  <span>权限设置</span>
                </button>
              </div>
            </div>

          {/* Post Daily Card Stack */}
          <div className="relative w-[100px] h-[128px] mb-12 ml-2">
            <div className="absolute inset-0 bg-white border border-gray-100 rounded-2xl shadow-sm transform -rotate-6 translate-x-[-8px] translate-y-[-4px] opacity-30" />
            <div className="absolute inset-0 bg-white border border-gray-100 rounded-2xl shadow-sm transform -rotate-3 translate-x-[-4px] translate-y-[-2px] opacity-60" />
            
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="absolute inset-0 bg-[#F2F2F2] border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm"
            >
              <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white">
                <Plus size={22} strokeWidth={3} />
              </div>
              <span className="text-gray-500 text-[13px] font-medium">发日常</span>
            </motion.button>
          </div>
        </div>

        {/* View Switcher */}
        <AnimatePresence mode="wait">
          {viewMode === 'thumbnail' ? (
            <motion.div
              key="thumbnail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {timelineData.map((section) => (
                <section key={section.month} className="px-4">
                  {/* Month Header with Dot Matrix */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[23px] font-bold leading-none tracking-tight">{section.month}</span>
                      <span className="text-[12px] font-bold">月</span>
                    </div>
                    
                    {/* Dot Matrix Visualization */}
                    <div className="bg-[#F9F9F9] p-2.5 rounded-[14px] border border-gray-50/50">
                      <div className="grid grid-cols-7 gap-[5px]">
                        {Array.from({ length: 30 }).map((_, i) => {
                          const dayNum = (i + 1).toString();
                          const dayRecord = section.items.find(item => item.day === dayNum);
                          const hasImage = dayRecord && dayRecord.img;
                          
                          return (
                            <div 
                              key={i} 
                              className={`w-[6px] h-[6px] rounded-full transition-colors duration-300 ${
                                hasImage ? 'bg-[#FF2D55]' : 'bg-[#E5E5E5]'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Horizontal/Wrapped Grid with vertical line */}
                  <div className="relative pl-5">
                    {/* Vertical line */}
                    <div className="absolute left-[8px] top-2 bottom-0 w-[3px] bg-[#EDEDED]" />
                    
                  <div className="grid grid-cols-6 gap-x-2 gap-y-[13px]">
                    {section.items.filter(item => item.img).map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-0.5">
                        <span className="text-[11px] font-bold text-black opacity-90">{item.day}</span>
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className="aspect-square w-full rounded-[14px] overflow-hidden bg-gray-50 shadow-sm"
                        >
                          <img
                            src={item.img!}
                            alt={`Moment ${item.day}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </motion.div>
                      </div>
                    ))}
                  </div>
                  </div>
                </section>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {timelineData.map((section) => (
                <section key={section.month} className="flex px-4 gap-4">
                  {/* Month Label */}
                  <div className="w-10 pt-1 flex items-baseline gap-0.5 shrink-0">
                    <span className="text-[23px] font-bold leading-none">{section.month}</span>
                    <span className="text-[12px] font-bold">月</span>
                  </div>

                  {/* 3-Column Grid (List View is also a grid per user request) */}
                  <div className="grid grid-cols-3 gap-[5px] flex-1">
                    {section.items.filter(item => item.img).map((item, idx) => (
                      <motion.div
                        key={idx}
                        whileTap={{ scale: 0.98 }}
                        className="aspect-square bg-gray-50 overflow-hidden"
                      >
                        <img
                          src={item.img!}
                          alt={`Moment ${item.day}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
          </>
        ) : (
          <div className="min-h-[60vh]" />
        )}
      </motion.main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <div className="flex justify-around items-center h-[54px] px-1">
          <NavItem label="首页" />
          <NavItem label="朋友" />
          
          <div className="flex flex-col items-center justify-center">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="w-[42px] h-[30px] bg-white border-[3px] border-black rounded-[8px] flex items-center justify-center"
            >
              <Plus size={22} strokeWidth={3} />
            </motion.button>
          </div>

          <NavItem label="消息" badge={4} />
          <NavItem label="我" active />
        </div>
        <div className="h-5 bg-white" />
      </nav>
    </div>
  );
}

function NavItem({ label, badge, active }: { label: string; badge?: number; active?: boolean }) {
  return (
    <button className="relative flex items-center justify-center w-[70px] h-full">
      <div className="relative">
        <span className={`text-[16px] ${active ? 'text-black font-bold' : 'text-gray-500 font-medium'}`}>
          {label}
        </span>
        {badge && (
          <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 bg-[#FF2D55] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-[1.5px] border-white">
            {badge}
          </span>
        )}
      </div>
    </button>
  );
}