import { Activity, Clock, Trophy } from 'lucide-react';

export function DashboardScreen() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-[#F0DED3] mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#2F3A48] p-6 rounded-lg border border-[#506256]">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#254341] rounded-full text-[#DEC28C]">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-[#A79385] text-sm">Daily Streak</p>
              <p className="text-2xl text-[#F0DED3] font-bold">12 Days</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#2F3A48] p-6 rounded-lg border border-[#506256]">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#254341] rounded-full text-[#DEC28C]">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[#A79385] text-sm">Time Studied</p>
              <p className="text-2xl text-[#F0DED3] font-bold">4.5 Hrs</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2F3A48] p-6 rounded-lg border border-[#506256]">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#254341] rounded-full text-[#DEC28C]">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-[#A79385] text-sm">Cards Mastered</p>
              <p className="text-2xl text-[#F0DED3] font-bold">856</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-12 bg-[#2F3A48] rounded-lg border border-[#506256] border-dashed">
        <p className="text-[#A79385]">More dashboard widgets coming soon...</p>
      </div>
    </div>
  );
}
