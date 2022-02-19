import { useSnapshot } from "valtio";
import { Link } from "yarr";
import { useAuth, useAuthSnapshot } from "../store/AuthContext";
import { Logout } from "./Logout";
import { UserInfo } from "./UserInfo";

export const Navbar = () => {
  const auth = useAuthSnapshot();

  return (
    <div className="sticky top-0 z-40 w-full">
      <div className="max-w-8xl mx-auto">
        <nav className="flex mx-4 py-4 border-b bg-white justify-between">
          <span className="space-x-4">
            <Link exact to="/">
              Home
            </Link>
            <Link exact to="/about">
              About Us
            </Link>
            <Link exact to="/asdf">
              Non existent route
            </Link>
          </span>
          {auth.isAuthentiated ? (
            <span className="space-x-4">
              <UserInfo />
              <Logout />
            </span>
          ) : (
            <Link exact to="/login">
              Login
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};
