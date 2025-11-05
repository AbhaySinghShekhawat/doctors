import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trialsAPI } from '../context/AuthContext';
import { Search, Microscope, MapPin, Calendar, Users, Activity } from 'lucide-react';

const ClinicalTrials = () => {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    condition: '',
    status: '',
    phase: '',
    location: '',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 10,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const statusOptions = [
    'Recruiting',
    'Active',
    'Completed',
    'Suspended',
    'Terminated',
    'Not yet recruiting',
  ];

  const phaseOptions = [
    'Phase 1',
    'Phase 2',
    'Phase 3',
    'Phase 4',
    'Not Applicable',
  ];

  useEffect(() => {
    fetchTrials();
  }, [filters.page]);

  const fetchTrials = async () => {
    setLoading(true);
    try {
      const data = await trialsAPI.getAll(filters);
      setTrials(data.trials || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('Error fetching trials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchTrials();
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

  const getStatusColor = (status) => {
    const colors = {
      'Recruiting': 'bg-green-100 text-green-800',
      'Active': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Suspended': 'bg-yellow-100 text-yellow-800',
      'Terminated': 'bg-red-100 text-red-800',
      'Not yet recruiting': 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Clinical Trials</h1>
          <p className="text-gray-600">
            Explore {total} active clinical trials and research opportunities
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
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search trials by title, condition, or description..."
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
                  placeholder="e.g., Diabetes"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phase
                </label>
                <select
                  name="phase"
                  value={filters.phase}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All Phases</option>
                  {phaseOptions.map((phase) => (
                    <option key={phase} value={phase}>
                      {phase}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="City or State"
                  className="input-field"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              <Search className="w-5 h-5 mr-2" />
              Search Trials
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : trials.length > 0 ? (
          <div className="space-y-6">
            {trials.map((trial) => (
              <div key={trial._id} className="card p-6 hover:shadow-lg transition duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link
                      to={`/trials/${trial._id}`}
                      className="text-xl font-bold text-gray-900 hover:text-blue-600 transition block mb-2"
                    >
                      {trial.title}
                    </Link>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="badge-primary">{trial.phase}</span>
                      <span className={`badge ${getStatusColor(trial.status)}`}>
                        {trial.status}
                      </span>
                      {trial.nctId && (
                        <span className="badge bg-gray-100 text-gray-800">
                          {trial.nctId}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {trial.shortDescription || trial.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Activity className="w-4 h-4 mr-2 text-gray-400" />
                        <span>
                          <strong>Condition:</strong> {trial.condition}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>
                          <strong>Location:</strong> {trial.location}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>
                          <strong>Start:</strong>{' '}
                          {new Date(trial.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Participants Info */}
                    {trial.participants && (
                      <div className="mt-4 flex items-center space-x-6 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-1 text-gray-400" />
                          <span>
                            {trial.participants.enrolled || 0} / {trial.participants.target || 0} enrolled
                          </span>
                        </div>
                        {trial.participants.pending > 0 && (
                          <div className="text-blue-600 font-semibold">
                            {trial.participants.pending} spots available
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/trials/${trial._id}`}
                    className="ml-4 btn-primary whitespace-nowrap"
                  >
                    View Details
                  </Link>
                </div>

                {/* Tags */}
                {trial.tags && trial.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {trial.tags.slice(0, 5).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Microscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No clinical trials found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search filters
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

export default ClinicalTrials;