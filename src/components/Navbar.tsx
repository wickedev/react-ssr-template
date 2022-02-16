import { MouseEvent } from "react";
import { useSnapshot } from "valtio";
import { Link } from "yarr";
import { useAuth } from "../store/AuthContext";
import { Logout } from "./Logout";
import { UserInfo } from "./UserInfo";

export const Navbar = () => {
  const auth = useSnapshot(useAuth());

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    console.log(`Link clicked: ${(e.target as any).href}`);
  };

  return (
    <div className="sticky top-0 z-40 w-full">
      <div className="max-w-8xl mx-auto">
        <nav className="flex mx-4 py-4 border-b bg-white justify-between">
          <span className="space-x-4">
            <Link exact to="/" onClick={handleClick}>
              Home
            </Link>
            <Link exact to="/about" onClick={handleClick}>
              About Us
            </Link>
            <Link exact to="/asdf" onClick={handleClick}>
              Non existent route
            </Link>
          </span>
          {auth.isAuthentiated ? (
            <span className="space-x-4">
              <UserInfo />
              <Logout />
            </span>
          ) : (
            <Link exact to="/login" onClick={handleClick}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};
