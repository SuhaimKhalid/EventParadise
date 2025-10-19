// import Button from "react-bootstrap/Button";
import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import { AppContext } from "./AppContext";
import userIcon from "../../assets/Images/Icons/user.png";
import { Dropdown } from "react-bootstrap";
export const NavbarComponent = () => {
  const { userAccess, setUserAccess, selectedUser } = useContext(AppContext);
  function logOutHandler() {
    setUserAccess(false);
    localStorage.removeItem("Login");
  }

  return (
    <header>
      <Navbar expand="lg" className="fixed-top">
        <Container>
          <Navbar.Brand href="/">EventParadise</Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll" role="navigation">
            {userAccess ? (
              selectedUser?.role === "staff" ? (
                <Nav
                  className="ms-auto my-2 my-lg-0"
                  style={{ maxHeight: "100px" }}
                  navbarScroll
                >
                  <NavLink to="/events" className="nav-link">
                    Events
                  </NavLink>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {selectedUser?.name}
                      <img
                        className="navImg"
                        src={userIcon}
                        alt={`${selectedUser?.name} Current User Icon`}
                        title={selectedUser?.name}
                        style={{
                          width: "35px",
                          height: "35px",
                          borderRadius: "50%",
                        }}
                      />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item>
                        <NavLink to="/staff_account" className="nav-link">
                          Account
                        </NavLink>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-2">
                        <NavLink
                          to="/login"
                          className="nav-link"
                          onClick={logOutHandler}
                        >
                          Log Out
                        </NavLink>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav>
              ) : (
                <Nav
                  className="ms-auto my-2 my-lg-0"
                  style={{ maxHeight: "100px" }}
                  navbarScroll
                >
                  <NavLink to="/events" className="nav-link">
                    Events
                  </NavLink>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {selectedUser?.name}
                      <img
                        className="navImg"
                        src={userIcon}
                        alt={`${selectedUser?.name} Current User Icon`}
                        title={selectedUser?.name}
                        style={{
                          width: "35px",
                          height: "35px",
                          borderRadius: "50%",
                        }}
                      />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item>
                        <NavLink to="/member_account" className="nav-link">
                          Account
                        </NavLink>
                      </Dropdown.Item>
                      <Dropdown.Item href="#/action-2">
                        <NavLink
                          to="/login"
                          className="nav-link"
                          onClick={logOutHandler}
                        >
                          Log Out
                        </NavLink>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav>
              )
            ) : (
              <Nav
                className="ms-auto my-2 my-lg-0"
                style={{ maxHeight: "100px" }}
                navbarScroll
              >
                <NavLink to="/events" className="nav-link">
                  Events
                </NavLink>

                <NavLink to="/login" className="nav-link">
                  Sign In
                </NavLink>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default NavbarComponent;
