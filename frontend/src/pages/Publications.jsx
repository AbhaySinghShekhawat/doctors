import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicationsAPI } from '../context/AuthContext';
import { Search, Filter, BookOpen, Calendar, Users, ExternalLink } from 'lucide-react';

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    condition: '',
    year: '',
    journal: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 10,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPublications();
  }, [filters.page]);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const data = await publicationsAPI.getAll(filters);
      setPublications(data.publications || []);
      setTotal(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / filters.limit));
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchPublications();
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Research Publications</h1>
          <p className="text-gray-600">
            Explore {total} peer-reviewed medical research publications
          </p>
        </div>

        {/* Search & Filters */}
        <div className="card p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                placeholder="Search by keyword, title, or abstract..."
                className="input-field pl-10"
              />
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <input
                  type="text"
                  name="condition"
                  value={filters.condition}
                  onChange={handleFilterChange}
                  placeholder="e.g., Cancer"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={filters.year}
                  onChange={handleFilterChange}
                  placeholder="e.g., 2024"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Journal
                </label>
                <input
                  type="text"
                  name="journal"
                  value={filters.journal}
                  onChange={handleFilterChange}
                  placeholder="Journal name"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="createdAt">Recent</option>
                  <option value="year">Year</option>
                  <option value="citations">Citations</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              <Search className="w-5 h-5 mr-2" />
              Search Publications
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) :publications.length > 0 ? (
  <div className="space-y-6">
    {publications.map((pub) => {
      return (
        <div
          key={pub._id}
          className="card p-6 hover:shadow-lg transition duration-300"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Title - plain text now */}
              <h2 className="text-xl font-bold text-gray-900">
                {pub.title}
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {pub.authors?.slice(0, 3).join(", ")}
                  {pub.authors?.length > 3 && ` +${pub.authors.length - 3} more`}
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {pub.year}
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {pub.journal}
                </div>
              </div>

              <p className="mt-3 text-gray-600 line-clamp-3">
                {pub.shortAbstract || pub.abstract}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {pub.condition && (
                  <span className="badge-primary">{pub.condition}</span>
                )}
                {pub.isPeerReviewed && (
                  <span className="badge-success">Peer Reviewed</span>
                )}
                {pub.verified && (
                  <span className="badge-warning">Verified</span>
                )}
                {pub.citations > 0 && (
                  <span className="badge bg-gray-100 text-gray-800">
                    {pub.citations} citations
                  </span>
                )}
              </div>

              {/* ✅ View Details Button */}
              <div className="mt-4">
                <Link
                  to={`/publications/${pub._id}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View Details
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            {pub.link && (
              <a
                href={pub.link}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 flex-shrink-0 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      );
    })}
  </div>
) : (
  <div className="text-center py-12">
    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">
      No publications found
    </h3>
    <p className="text-gray-500">
      Try adjusting your search filters or keywords
    </p>
  </div>
)}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= filters.page - 1 && pageNum <= filters.page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg ${
                        filters.page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === filters.page - 2 ||
                  pageNum === filters.page + 2
                ) {
                  return <span key={pageNum} className="px-2">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Publications;