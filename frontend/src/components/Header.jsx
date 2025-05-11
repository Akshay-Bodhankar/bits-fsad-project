import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router';
import { HiMenu } from 'react-icons/hi';

function Header({ toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);

    return pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;

      return (
        <React.Fragment key={routeTo}>
          {index > 0 && <span className="mx-2 text-gray-500">/</span>}
          {isLast ? (
            <span className="text-gray-700 font-medium">{name}</span>
          ) : (
            <Link to={routeTo} className="text-blue-600 hover:text-blue-800">
              {name}
            </Link>
          )}
        </React.Fragment>
      );
    });
  };

  function logoutHandler() {
    sessionStorage.clear()
    navigate("/")
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
          >
            <HiMenu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Vaccine Management</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-sm">
            {generateBreadcrumbs()}
          </div>
          <span className="text-sm text-gray-600">Welcome, Admin</span>
          <button className="text-sm text-blue-600 hover:text-blue-800" onClick={logoutHandler}>Logout</button>
        </div>
      </div>
    </header>
  );
}

export default Header; 