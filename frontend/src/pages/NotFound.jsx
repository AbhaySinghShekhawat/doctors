import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl animate-fade-in">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            404
          </div>
        </div>

        {/* Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link to="/" className="btn-primary inline-flex items-center justify-center">
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          <Link to="/trials" className="btn-secondary inline-flex items-center justify-center">
            <Search className="w-5 h-5 mr-2" />
            Browse Trials
          </Link>
        </div>

        {/* Popular Links */}
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Popular Pages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <Link
              to="/publications"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-5 h-5 text-blue-600 mr-3 transform rotate-180" />
              <div>
                <p className="font-semibold text-gray-900">Publications</p>
                <p className="text-sm text-gray-600">Browse research papers</p>
              </div>
            </Link>
            <Link
              to="/trials"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-5 h-5 text-blue-600 mr-3 transform rotate-180" />
              <div>
                <p className="font-semibold text-gray-900">Clinical Trials</p>
                <p className="text-sm text-gray-600">Find trials near you</p>
              </div>
            </Link>
            <Link
              to="/forum"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-5 h-5 text-blue-600 mr-3 transform rotate-180" />
              <div>
                <p className="font-semibold text-gray-900">Community Forum</p>
                <p className="text-sm text-gray-600">Join discussions</p>
              </div>
            </Link>
            <Link
              to="/register"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-5 h-5 text-blue-600 mr-3 transform rotate-180" />
              <div>
                <p className="font-semibold text-gray-900">Sign Up</p>
                <p className="text-sm text-gray-600">Create an account</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-gray-600">
          Need help? Contact us at{' '}
          <a href="mailto:support@medresearch.com" className="text-blue-600 hover:text-blue-700 font-semibold">
            support@medresearch.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;