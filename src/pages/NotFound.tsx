
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-8 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-950">
        <h1 className="text-6xl font-bold mb-4 text-quantum">404</h1>
        <p className="text-2xl text-gray-600 dark:text-gray-400 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 dark:text-gray-500 mb-8">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" className="bg-quantum hover:bg-quantum-dark">
            <Link to="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/docs">Visit Documentation</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
