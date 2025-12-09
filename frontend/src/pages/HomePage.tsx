

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const categories = [
  {
    id: 'business',
    name: 'Business',
    fullName: 'Business Topics',
    icon: '💼',
    description: 'Market analysis & economic insights',
    bgGradient: 'from-blue-500/10 to-blue-600/5',
    borderColor: 'group-hover:border-blue-500/30',
    textColor: 'group-hover:text-blue-600',
  },
  {
    id: 'technology',
    name: 'Technology',
    fullName: 'Technology Topics',
    icon: '💻',
    description: 'Innovations & digital trends',
    bgGradient: 'from-purple-500/10 to-purple-600/5',
    borderColor: 'group-hover:border-purple-500/30',
    textColor: 'group-hover:text-purple-600',
  },
  {
    id: 'sports',
    name: 'Sports',
    fullName: 'Sports Topics',
    icon: '⚽',
    description: 'Match analysis & athlete stories',
    bgGradient: 'from-green-500/10 to-green-600/5',
    borderColor: 'group-hover:border-green-500/30',
    textColor: 'group-hover:text-green-600',
  },
  {
    id: 'security',
    name: 'Security',
    fullName: 'Security Topics',
    icon: '🛡️',
    description: 'Cybersecurity updates & threats',
    bgGradient: 'from-red-500/10 to-red-600/5',
    borderColor: 'group-hover:border-red-500/30',
    textColor: 'group-hover:text-red-600',
  },
];

function HomePage() {
  const { user, logout } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Set date
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="py-8 md:py-12 animate-fade-in">
      {/* Dashboard Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 font-sans">
            {currentDate}
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
            {greeting}, <br />
            <span className="text-slate-600 dark:text-slate-400 font-normal opacity-80 lg:text-4xl text-3xl">
              {user?.email?.split('@')[0] || 'Reader'}
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl font-sans leading-relaxed">
            Here represents your daily intelligence briefing. Select a channel to stay informed.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-3 min-w-[140px]">
          <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            Basic Access
          </span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors flex items-center gap-1"
          >
            Switch Account
            <span className="material-symbols-outlined text-sm">logout</span>
          </button>
        </div>
      </header>

      {/* Briefing Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/${category.id}`}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl filter drop-shadow-sm">{category.icon}</span>
                  <div className={`h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2`}></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    Daily Update
                  </span>
                </div>
                
                <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 font-sans">
                  {category.description}
                </p>

                <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:underline decoration-2 underline-offset-4">
                  Read Briefing
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>
      
      {/* Quick Actions / Footer of Dashboard */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-center">
         <p className="text-sm text-slate-400 italic font-serif">
           "Knowledge is power. Stay informed."
         </p>
      </div>
    </div>
  );
}

export default HomePage;
