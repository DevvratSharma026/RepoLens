import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gray-900">404</h1>

        <p className="mt-4 text-xl font-semibold">
          This page isn’t ready yet
        </p>

        <p className="mt-2 text-gray-600">
          You’ve reached a section that’s still under construction.
          We’re actively working on it.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/"
            className="px-5 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            Go back home
          </Link>

          <Link
            to="/login"
            className="px-5 py-2 rounded-lg border border-gray-300 font-medium hover:bg-gray-700 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
