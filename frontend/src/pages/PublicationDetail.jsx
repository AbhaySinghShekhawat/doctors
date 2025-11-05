import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { publicationsAPI } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  BookOpen, 
  ExternalLink, 
  FileText,
  Building,
  Award,
  Trash2,
  Edit
} from 'lucide-react';

const PublicationDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublication();
  }, [id]);

  const fetchPublication = async () => {
    try {
      const data = await publicationsAPI.getById(id);
      setPublication(data.publication);
    } catch (error) {
      console.error('Error fetching publication:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      try {
        await publicationsAPI.delete(id);
        navigate('/publications');
      } catch (error) {
        console.error('Error deleting publication:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Publication Not Found</h2>
          <Link to="/publications" className="text-blue-600 hover:text-blue-700">
            ← Back to Publications
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = user?._id === publication.uploadedBy?._id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Back Button */}
        <Link
          to="/publications"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Publications
        </Link>

        {/* Main Content Card */}
        <div className="card p-8">
          {/* Header */}
          <div className="border-b pb-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 flex-1">
                {publication.title}
              </h1>
              {canEdit && (
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => navigate(`/publications/${id}/edit`)}
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

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {publication.condition && (
                <span className="badge-primary">{publication.condition}</span>
              )}
              {publication.isPeerReviewed && (
                <span className="badge-success">Peer Reviewed</span>
              )}
              {publication.verified && (
                <span className="badge-warning">Verified</span>
              )}
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2 text-gray-400" />
                <div>
                  <span className="font-semibold">Authors:</span>{' '}
                  {publication.authors?.join(', ')}
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                <div>
                  <span className="font-semibold">Year:</span> {publication.year}
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <BookOpen className="w-5 h-5 mr-2 text-gray-400" />
                <div>
                  <span className="font-semibold">Journal:</span> {publication.journal}
                </div>
              </div>

              {publication.publisher && (
                <div className="flex items-center text-gray-600">
                  <Building className="w-5 h-5 mr-2 text-gray-400" />
                  <div>
                    <span className="font-semibold">Publisher:</span> {publication.publisher}
                  </div>
                </div>
              )}

              {publication.citations > 0 && (
                <div className="flex items-center text-gray-600">
                  <Award className="w-5 h-5 mr-2 text-gray-400" />
                  <div>
                    <span className="font-semibold">Citations:</span> {publication.citations}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Publication Details */}
          <div className="space-y-6">
            {/* Volume/Issue/Pages */}
            {(publication.volume || publication.issue || publication.pages) && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Publication Details
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {publication.volume && (
                    <span>
                      <strong>Volume:</strong> {publication.volume}
                    </span>
                  )}
                  {publication.issue && (
                    <span>
                      <strong>Issue:</strong> {publication.issue}
                    </span>
                  )}
                  {publication.pages && (
                    <span>
                      <strong>Pages:</strong> {publication.pages}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Abstract */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Abstract</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {publication.abstract}
              </p>
            </div>

            {/* Keywords */}
            {publication.keywords && publication.keywords.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {publication.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Corresponding Author */}
            {publication.correspondingAuthor && publication.correspondingAuthor.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Corresponding Author
                </h2>
                <p className="text-gray-700">
                  {publication.correspondingAuthor.join(', ')}
                </p>
              </div>
            )}

            {/* Institution */}
            {publication.institution && publication.institution.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Affiliated Institution(s)
                </h2>
                <p className="text-gray-700">
                  {publication.institution.join(', ')}
                </p>
              </div>
            )}

            {/* DOI & PMID */}
            <div className="flex flex-wrap gap-4">
              {publication.doi && (
                <div>
                  <span className="text-sm font-semibold text-gray-700">DOI:</span>{' '}
                  <span className="text-sm text-gray-600">{publication.doi}</span>
                </div>
              )}
              {publication.pmid && (
                <div>
                  <span className="text-sm font-semibold text-gray-700">PMID:</span>{' '}
                  <span className="text-sm text-gray-600">{publication.pmid}</span>
                </div>
              )}
            </div>

            {/* External Link */}
        {publication.link && (
  <div>
    <a
      href={publication.link}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-primary inline-flex items-center"
    >
      <ExternalLink className="w-5 h-5 mr-2" />
      View Full Publication
    </a>
  </div>
)}


            {/* Uploaded By */}
            {publication.uploadedBy && (
              <div className="border-t pt-6 mt-6">
                <p className="text-sm text-gray-600">
                  Uploaded by{' '}
                  <span className="font-semibold text-gray-900">
                    {publication.uploadedBy.name}
                  </span>{' '}
                  on {new Date(publication.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetail;