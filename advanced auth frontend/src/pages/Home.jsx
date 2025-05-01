import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Welcome to Auth System
        </h2>
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          {user ? (
            <p className="text-lg text-gray-600">
              Hello, {user.name}! View your{" "}
              <Link to="/profile" className="text-primary hover:underline">
                profile
              </Link>{" "}
              or manage your{" "}
              <Link to="/sessions" className="text-primary hover:underline">
                sessions
              </Link>
              .
            </p>
          ) : (
            <p className="text-lg text-gray-600">
              Please{" "}
              <Link to="/login" className="text-primary hover:underline">
                login
              </Link>{" "}
              or{" "}
              <Link to="/register" className="text-primary hover:underline">
                register
              </Link>{" "}
              to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
