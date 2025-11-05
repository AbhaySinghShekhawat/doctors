import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { trialsAPI } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Mail,
  Users,
  Activity,
  Info,
  CheckCircle,
  Trash2,
  Edit,
} from 'lucide-react';

const TrialDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trial, setTrial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrial();
  }, [id]);

  const fetchTrial = async () => {
    try {
      const data = await trialsAPI.getById(id);
      setTrial(data.trial);
    } catch (error) {
      console.error('Error fetching trial:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trial?')) {
      try {
        await trialsAPI.delete(id);
        navigate('/trials');
      } catch (error) {
        console.error('Error deleting trial:', error);
      }
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!trial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Trial Not Found</h2>
          <Link to="/trials" className="text-blue-600 hover:text-blue-700">
            ← Back to Clinical Trials
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = user?._id === trial.createdBy?._id || user?.userType === 'researcher';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Back Button */}
        <Link
          to="/trials"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Clinical Trials
        </Link>

        {/* Main Content Card */}
        <div className="card p-8">
          {/* Header */}
          <div className="border-b pb-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {trial.title}
                </h1>
                {trial.nctId && (
                  <p className="text-gray-600 font-mono text-sm">NCT ID: {trial.nctId}</p>
                )}
              </div>
              {canEdit && (
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => navigate(`/trials/${id}/edit`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="badge-primary">{trial.phase}</span>
              <span className={`badge ${getStatusColor(trial.status)}`}>
                {trial.status}
              </span>
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start space-x-3">
              <Activity className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Condition</p>
                <p className="font-semibold text-gray-900">{trial.condition}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="font-semibold text-gray-900">{trial.location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Start Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(trial.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {trial.endDate && (
              <div className="flex items-start space-x-3">
                <Calendar className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">End Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(trial.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Contact Email</p>
                <a
                  href={`mailto:${trial.contactEmail}`}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  {trial.contactEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Enrollment Progress */}
          {trial.participants && (
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Enrollment Status</h3>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {trial.participants.enrolled} / {trial.participants.target}
                </span>
              </div>

              <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (trial.participants.enrolled / trial.participants.target) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>{trial.participants.enrolled} enrolled</span>
                <span>{trial.participants.pending} spots available</span>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2 text-blue-600" />
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {trial.description}
            </p>
          </div>

          {/* Eligibility Criteria */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
              Eligibility Criteria
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {trial.eligibility}
              </p>
            </div>
          </div>

          {/* Tags */}
          {trial.tags && trial.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Related Topics</h2>
              <div className="flex flex-wrap gap-2">
                {trial.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply Section */}
          {trial.status === 'Recruiting' && trial.participants?.pending > 0 && (
            <div className="border-t pt-8 mt-8">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-2">Interested in Participating?</h3>
                <p className="mb-4 text-blue-100">
                  This trial is currently recruiting participants. Contact the research team to learn more.
                </p>
                <a
                  href={`mailto:${trial.contactEmail}?subject=Interest in Clinical Trial: ${trial.nctId}`}
                  className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Contact Research Team
                </a>
              </div>
            </div>
          )}

          {/* Created By Info */}
          {trial.createdBy && (
            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-600">
                Posted by{' '}
                <span className="font-semibold text-gray-900">
                  {trial.createdBy.name}
                </span>{' '}
                on {new Date(trial.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrialDetail;