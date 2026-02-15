import React from 'react';
import { NavLink } from 'react-router-dom';

const Layout = ({ children }) => {
     return (
          <div className="min-h-screen bg-gray-50 text-gray-900">
               <header className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                         <NavLink to="/" className="text-xl font-bold flex items-center gap-2">
                              Incident Tracker
                         </NavLink>
                    </div>
               </header>
               <main className="container mx-auto px-4 py-8">
                    {children}
               </main>
          </div>
     );
};

export default Layout;
