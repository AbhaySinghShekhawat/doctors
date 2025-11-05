import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { trialsAPI, publicationsAPI, forumAPI } from '../context/AuthContext';
import { 
  FileText, 
  Microscope, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  BookOpen,
  PlusCircle,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    trials: 0,
    publications: 0,
    forumPosts: 0,
  });
  const [recentTrials, setRecentTrials] = useState([]);
  const [recentPublications, setRecentPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [trialsData, publicationsData] = await Promise.all([
        trialsAPI.getAll({ limit: 3, page: 1 }),
        publicationsAPI.getAll({ limit: 3, page: 1 }),
      ]);

      setRecentTrials(trialsData.trials || []);
      setRecentPublications(publicationsData.publications || []);
      setStats({
        trials: trialsData.total || 0,
        publications: publicationsData.total || 0,
        forumPosts: 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, link }) => (
    <Link to={link} className="card p-6 hover:scale-105 transition duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-16 h-16 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {user?.userType === 'patient' 
              ? 'Find clinical trials and research opportunities that match your condition.'
              : 'Manage your research, publications, and clinical trials.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Microscope}
            label="Clinical Trials"
            value={stats.trials}
            color="bg-blue-600"
            link="/trials"
          />
          <StatCard
            icon={FileText}
            label="Publications"
            value={stats.publications}
            color="bg-green-600"
            link="/publications"
          />
          <StatCard
            icon={MessageSquare}
            label="Forum Posts"
            value={stats.forumPosts}
            color="bg-purple-600"
            link="/forum"
          />
        </div>

        {/* Quick Actions */}
        {user?.userType === 'researcher' && (
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/trials/create"
                className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              >
                <PlusCircle className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-blue-600">Create Clinical Trial</span>
              </Link>
              <Link
                to="/publications/create"
                className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
              >
                <PlusCircle className="w-6 h-6 text-green-600" />
                <span className="font-semibold text-green-600">Add Publication</span>
              </Link>
              <Link
                to="/forum/create"
                className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
              >
                <PlusCircle className="w-6 h-6 text-purple-600" />
                <span className="font-semibold text-purple-600">Create Forum Post</span>
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Clinical Trials */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Microscope className="w-6 h-6 mr-2 text-blue-600" />
                Recent Clinical Trials
              </h2>
              <Link to="/trials" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentTrials.length > 0 ? (
                recentTrials.map((trial) => (
                  <Link
                    key={trial._id}
                    to={`/trials/${trial._id}`}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{trial.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{trial.description}</p>
                        <div className="flex items-center space-x-3">
                          <span className="badge-primary">{trial.phase}</span>
                          <span className="badge-success">{trial.status}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No clinical trials available</p>
              )}
            </div>
          </div>

          {/* Recent Publications */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-green-600" />
                Recent Publications
              </h2>
              <Link to="/publications" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentPublications.length > 0 ? (
                recentPublications.map((pub) => (
                  <Link
                    key={pub._id}
                    to={`/publications/${pub._id}`}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{pub.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {pub.authors?.join(', ') || 'Unknown authors'}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>{pub.journal}</span>
                      <span>•</span>
                      <span>{pub.year}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No publications available</p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Status */}
        <div className="card p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">User Type</p>
              <p className="font-semibold text-gray-900 capitalize">{user?.userType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-semibold text-gray-900">{user?.email}</p>
            </div>
            {user?.userType === 'patient' && user?.patientProfile?.condition && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Primary Condition</p>
                <p className="font-semibold text-gray-900">{user.patientProfile.condition}</p>
              </div>
            )}
            {user?.userType === 'researcher' && user?.researcherProfile?.institution && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Institution</p>
                <p className="font-semibold text-gray-900">{user.researcherProfile.institution}</p>
              </div>
            )}
          </div>
          <Link
            to="/profile"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-semibold"
          >
            Edit Profile →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;