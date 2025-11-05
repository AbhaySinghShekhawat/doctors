import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Briefcase, MapPin, Save, Edit2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    patientProfile: {
      condition: user?.patientProfile?.condition || '',
      interests: user?.patientProfile?.interests || '',
    },
    researcherProfile: {
      institution: user?.researcherProfile?.institution || '',
      specialties: user?.researcherProfile?.specialties?.join(', ') || '',
      researchInterests: user?.researcherProfile?.researchInterests?.join(', ') || '',
      orcid: user?.researcherProfile?.orcid || '',
      researchGate: user?.researcherProfile?.researchGate || '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert comma-separated strings back to arrays for researcher
    const updateData = { ...formData };
    if (user?.userType === 'researcher') {
      updateData.researcherProfile = {
        ...updateData.researcherProfile,
        specialties: updateData.researcherProfile.specialties
          .split(',')
          .map(s => s.trim())
          .filter(s => s),
        researchInterests: updateData.researcherProfile.researchInterests
          .split(',')
          .map(s => s.trim())
          .filter(s => s),
      };
    }

    const result = await updateProfile(updateData);
    if (result?.success) {
      setIsEditing(false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="card p-8">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6 mb-8 pb-8 border-b">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-4xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600 capitalize">{user?.userType}</p>
              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
            </div>
          </div>

          {/* Edit Toggle */}
          <div className="flex justify-end mb-6">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                <Edit2 className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field pl-10 bg-gray-100"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>
              </div>
            </div>

            {/* Patient Profile */}
            {user?.userType === 'patient' && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Patient Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Condition
                    </label>
                    <input
                      type="text"
                      name="patientProfile.condition"
                      value={formData.patientProfile.condition}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field"
                      placeholder="e.g., Type 2 Diabetes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Research Interests
                    </label>
                    <textarea
                      name="patientProfile.interests"
                      value={formData.patientProfile.interests}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows="4"
                      className="input-field"
                      placeholder="What type of research are you interested in?"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Researcher Profile */}
            {user?.userType === 'researcher' && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Researcher Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="researcherProfile.institution"
                        value={formData.researcherProfile.institution}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field pl-10"
                        placeholder="e.g., Harvard Medical School"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialties (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="researcherProfile.specialties"
                      value={formData.researcherProfile.specialties}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field"
                      placeholder="e.g., Oncology, Immunology, Clinical Trials"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Research Interests (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="researcherProfile.researchInterests"
                      value={formData.researcherProfile.researchInterests}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field"
                      placeholder="e.g., Cancer Biology, Drug Development"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ORCID ID
                    </label>
                    <input
                      type="text"
                      name="researcherProfile.orcid"
                      value={formData.researcherProfile.orcid}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field"
                      placeholder="0000-0002-1825-0097"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ResearchGate Profile URL
                    </label>
                    <input
                      type="url"
                      name="researcherProfile.researchGate"
                      value={formData.researcherProfile.researchGate}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input-field"
                      placeholder="https://www.researchgate.net/profile/..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            {isEditing && (
              <div className="flex justify-end pt-6 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Account Info */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Account Type</p>
                <p className="font-semibold text-gray-900 capitalize">{user?.userType}</p>
              </div>
              <div>
                <p className="text-gray-600">Member Since</p>
                <p className="font-semibold text-gray-900">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Account Status</p>
                <p className="font-semibold text-green-600">Active</p>
              </div>
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="font-semibold text-gray-900">
                  {new Date(user?.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;