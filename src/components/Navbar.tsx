import React from "react";
import { Link } from "yarr";

export const Navbar = () => (
  <nav>
    <Link exact to="/">
      Home
    </Link>
    {" / "}
    <Link exact to="/about">
      About Us
    </Link>
    {" / "}
    <Link exact to="/asdf">
      Non existent route
    </Link>
  </nav>
);
