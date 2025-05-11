import React from 'react';
import { NavLink } from 'react-router';
import { HiX } from 'react-icons/hi';

function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/students', label: 'Student Management' },
    { path: '/vaccinemng', label: 'Vaccine Management' },
    { path: '/reports', label: 'Reports' },
  ];

  return (
    <>
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Menu</h2>
          <button 
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-700"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                  onClick={() => {
                    // Close sidebar on mobile when clicking a link
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar; 