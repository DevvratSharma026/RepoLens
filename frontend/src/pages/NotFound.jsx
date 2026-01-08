import { Link } from "react-router-dom";
import notFound from '../assets/NotFound.mp4'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <video
        autoPlay
        loop
        muted
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={notFound} type="video/mp4" />
      </video>
      <div className="max-w-md text-center z-20">
        <h1 className="text-7xl font-bold text-gray-400">404</h1>

        <p className="mt-4 text-xl font-semibold">
          This page isn’t ready yet
        </p>

        <p className="mt-2 text-gray-200">
          It looks like I do not have the code for this part yet. In the meantime, you can explore other sections of the website.
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
