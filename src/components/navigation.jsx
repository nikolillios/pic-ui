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
    <div>
    <Navbar className="flex flex-row" bg="dark" variant="dark">
          <Navbar.Brand className="pr-10" href="/">Picturesque</Navbar.Brand>
          <Nav className="me-auto">
          {isAuth ?
            <Nav.Link href="/">Home</Nav.Link> :
            <Nav.Link href="/login">Login</Nav.Link>}
          </Nav>
          <Nav>
          {isAuth ?
            <Nav.Link href="/logout">Logout</Nav.Link>:
            <Nav.Link href="/login">Login</Nav.Link>
          }
          </Nav>
      </Navbar>
      </div>
  );
}

export default Navigation