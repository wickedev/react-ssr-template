import { Link } from "yarr";
import { MouseEvent } from "react";

export const Navbar = () => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    console.log(`Link clicked: ${(e.target as any).href}`)
  };

  return (
    <nav>
      <Link exact to="/" onClick={handleClick}>
        Home
      </Link>
      <Link exact to="/about" onClick={handleClick}>
        About Us
      </Link>
      <Link exact to="/asdf" onClick={handleClick}>
        Non existent route
      </Link>
    </nav>
  );
};
