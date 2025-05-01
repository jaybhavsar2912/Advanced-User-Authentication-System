import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

function Navbar() {
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      Cookies.remove("token");
      Cookies.remove("refreshToken");

      toast.success("Logged out successfully!");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold">
              Auth System
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-100 hidden sm:block">
                  Hello, {user.name}
                </span>
                <Link
                  to="/profile"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md"
                >
                  Profile
                </Link>
                <Link
                  to="/sessions"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md"
                >
                  Sessions
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/dashboard"
                    className="hover:bg-blue-700 px-3 py-2 rounded-md"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="hover:bg-blue-700 px-3 py-2 rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hover:bg-blue-700 px-3 py-2 rounded-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
