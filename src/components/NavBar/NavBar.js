import React from 'react';
import { Link } from "react-router-dom";
import ProfileNavIcon from "../../assets/ProfileNavIcon.svg";
import RoomsNavIcon from "../../assets/RoomsNavIcon.svg";
import LibraryNavIcon from "../../assets/LibraryNavIcon.svg";
import "./NavBar.css";

export default function NavBar() {
  return (
    <nav>
      <Link to={"/profile"} className="navItem profileNavItem">
        <img src={ProfileNavIcon} alt="Profile" width="25" height="25" />
        Profile
      </Link>

      <Link to={"/rooms"} className="navItem">
        <img src={RoomsNavIcon} alt="Rooms" width="25" height="25" />
        Rooms
      </Link>

      <Link to={"/library"} className="navItem" sx={{ color: "white" }}>
        <img src={LibraryNavIcon} alt="Library" width="25" height="25" />
        Library
      </Link>
    </nav>
  );
}