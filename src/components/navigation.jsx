import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useState, useEffect} from 'react';

export function Navigation() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('access_token') !== null) {
      setIsAuth(true);
    }
  }, [isAuth]);

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-lg">
      <Navbar className="bg-transparent" variant="dark">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between w-full">
            <Navbar.Brand 
              className="text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-200 cursor-pointer" 
              href="/"
            >
              Picturesque
            </Navbar.Brand>
            
            <div className="flex items-center space-x-6">
              {isAuth && (
                <Nav.Link 
                  className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-md transition-all duration-200 font-medium" 
                  href="/"
                >
                  Home
                </Nav.Link>
              )}
              
              {isAuth ? (
                <Nav.Link 
                  className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-md transition-all duration-200 font-medium" 
                  href="/logout"
                >
                  Logout
                </Nav.Link>
              ) : (
                <Nav.Link 
                  className="text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-md transition-all duration-200 font-medium" 
                  href="/login"
                >
                  Login
                </Nav.Link>
              )}
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
}

export default Navigation