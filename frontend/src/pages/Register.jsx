// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Mail, Lock, User, UserPlus, Eye, EyeOff } from 'lucide-react';

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     passwordConfirm: '',
//     userType: 'patient',
//     patientProfile: {
//       condition: '',
//       interests: '',
//     },
//     researcherProfile: {
//       institution: '',
//       specialties: [],
//     },
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData({
//         ...formData,
//         [parent]: {
//           ...formData[parent],
//           [child]: value,
//         },
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   const handleSpecialtiesChange = (e) => {
//     const value = e.target.value;
//     const specialtiesArray = value.split(',').map(s => s.trim()).filter(s => s);
//     setFormData({
//       ...formData,
//       researcherProfile: {
//         ...formData.researcherProfile,
//         specialties: specialtiesArray,
//       },
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (formData.password !== formData.passwordConfirm) {
//       return;
//     }

//     setLoading(true);
//     const result = await register(formData);
    
//     if (result.success) {
//       navigate('/dashboard');
//     }
    
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8 animate-fade-in">
//           <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <UserPlus className="w-8 h-8 text-white" />
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
//           <p className="mt-2 text-gray-600">Join our medical research community</p>
//         </div>

//         {/* Registration Form */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* User Type Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-3">
//                 I am a:
//               </label>
//               <div className="grid grid-cols-2 gap-4">
//                 <button
//                   type="button"
//                   onClick={() => setFormData({ ...formData, userType: 'patient' })}
//                   className={`p-4 rounded-lg border-2 transition duration-200 ${
//                     formData.userType === 'patient'
//                       ? 'border-blue-600 bg-blue-50 text-blue-700'
//                       : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                 >
//                   <User className="w-6 h-6 mx-auto mb-2" />
//                   <div className="font-semibold">Patient</div>
//                   <div className="text-xs text-gray-500 mt-1">Looking for trials</div>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setFormData({ ...formData, userType: 'researcher' })}
//                   className={`p-4 rounded-lg border-2 transition duration-200 ${
//                     formData.userType === 'researcher'
//                       ? 'border-blue-600 bg-blue-50 text-blue-700'
//                       : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                 >
//                   <User className="w-6 h-6 mx-auto mb-2" />
//                   <div className="font-semibold">Researcher</div>
//                   <div className="text-xs text-gray-500 mt-1">Conducting research</div>
//                 </button>
//               </div>
//             </div>

//             {/* Name */}
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   required
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="input-field pl-10"
//                   placeholder="John Doe"
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="input-field pl-10"
//                   placeholder="you@example.com"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="input-field pl-10 pr-10"
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="passwordConfirm"
//                   name="passwordConfirm"
//                   type={showPassword ? 'text' : 'password'}
//                   required
//                   value={formData.passwordConfirm}
//                   onChange={handleChange}
//                   className="input-field pl-10"
//                   placeholder="••••••••"
//                 />
//               </div>
//             </div>

//             {/* Patient-specific fields */}
//             {formData.userType === 'patient' && (
//               <div className="space-y-4 border-t pt-6">
//                 <h3 className="font-semibold text-gray-900">Patient Information</h3>
//                 <div>
//                   <label htmlFor="patientProfile.condition" className="block text-sm font-medium text-gray-700 mb-2">
//                     Primary Condition
//                   </label>
//                   <input
//                     id="patientProfile.condition"
//                     name="patientProfile.condition"
//                     type="text"
//                     value={formData.patientProfile.condition}
//                     onChange={handleChange}
//                     className="input-field"
//                     placeholder="e.g., Type 2 Diabetes"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="patientProfile.interests" className="block text-sm font-medium text-gray-700 mb-2">
//                     Research Interests
//                   </label>
//                   <textarea
//                     id="patientProfile.interests"
//                     name="patientProfile.interests"
//                     rows="3"
//                     value={formData.patientProfile.interests}
//                     onChange={handleChange}
//                     className="input-field"
//                     placeholder="What type of research are you interested in?"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Researcher-specific fields */}
//             {formData.userType === 'researcher' && (
//               <div className="space-y-4 border-t pt-6">
//                 <h3 className="font-semibold text-gray-900">Researcher Information</h3>
//                 <div>
//                   <label htmlFor="researcherProfile.institution" className="block text-sm font-medium text-gray-700 mb-2">
//                     Institution
//                   </label>
//                   <input
//                     id="researcherProfile.institution"
//                     name="researcherProfile.institution"
//                     type="text"
//                     value={formData.researcherProfile.institution}
//                     onChange={handleChange}
//                     className="input-field"
//                     placeholder="e.g., Harvard Medical School"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 mb-2">
//                     Specialties (comma-separated)
//                   </label>
//                   <input
//                     id="specialties"
//                     name="specialties"
//                     type="text"
//                     onChange={handleSpecialtiesChange}
//                     className="input-field"
//                     placeholder="e.g., Oncology, Immunology, Clinical Trials"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Terms */}
//             <div className="flex items-start">
//               <input
//                 id="terms"
//                 name="terms"
//                 type="checkbox"
//                 required
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
//               />
//               <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
//                 I agree to the{' '}
//                 <Link to="/terms" className="text-blue-600 hover:text-blue-500">
//                   Terms of Service
//                 </Link>{' '}
//                 and{' '}
//                 <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
//                   Privacy Policy
//                 </Link>
//               </label>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn-primary w-full flex items-center justify-center"
//             >
//               {loading ? (
//                 <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               ) : (
//                 <>
//                   <UserPlus className="w-5 h-5 mr-2" />
//                   Create Account
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Sign In Link */}
//           <p className="mt-6 text-center text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;



import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, LogIn } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    userType: 'patient',
    patientProfile: {
      condition: '',
      interests: '',
    },
    researcherProfile: {
      institution: '',
      specialties: [],
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // 🔹 Handle Input
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

  // 🔹 Specialties (for researchers)
  const handleSpecialtiesChange = (e) => {
    const value = e.target.value;
    const specialtiesArray = value.split(',').map(s => s.trim()).filter(s => s);
    setFormData({
      ...formData,
      researcherProfile: {
        ...formData.researcherProfile,
        specialties: specialtiesArray,
      },
    });
  };

  // 🔹 Manual Registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) return;

    setLoading(true);
    const result = await register(formData);
    if (result.success) navigate('/dashboard');
    setLoading(false);
  };

  // 🔹 Google Signup (OAuth Redirect)
  const handleGoogleSignup = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    window.location.href = `${baseURL}/api/auth/google?userType=${formData.userType}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Join our medical research community</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">I am a:</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'patient' })}
                  className={`p-4 rounded-lg border-2 transition duration-200 ${
                    formData.userType === 'patient'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Patient</div>
                  <div className="text-xs text-gray-500 mt-1">Looking for trials</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'researcher' })}
                  className={`p-4 rounded-lg border-2 transition duration-200 ${
                    formData.userType === 'researcher'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Researcher</div>
                  <div className="text-xs text-gray-500 mt-1">Conducting research</div>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Patient fields */}
            {formData.userType === 'patient' && (
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold text-gray-900">Patient Information</h3>
                <div>
                  <label htmlFor="patientProfile.condition" className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Condition
                  </label>
                  <input
                    id="patientProfile.condition"
                    name="patientProfile.condition"
                    type="text"
                    value={formData.patientProfile.condition}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Type 2 Diabetes"
                  />
                </div>
                <div>
                  <label htmlFor="patientProfile.interests" className="block text-sm font-medium text-gray-700 mb-2">
                    Research Interests
                  </label>
                  <textarea
                    id="patientProfile.interests"
                    name="patientProfile.interests"
                    rows="3"
                    value={formData.patientProfile.interests}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="What type of research are you interested in?"
                  />
                </div>
              </div>
            )}

            {/* Researcher fields */}
            {formData.userType === 'researcher' && (
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold text-gray-900">Researcher Information</h3>
                <div>
                  <label htmlFor="researcherProfile.institution" className="block text-sm font-medium text-gray-700 mb-2">
                    Institution
                  </label>
                  <input
                    id="researcherProfile.institution"
                    name="researcherProfile.institution"
                    type="text"
                    value={formData.researcherProfile.institution}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Harvard Medical School"
                  />
                </div>
                <div>
                  <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 mb-2">
                    Specialties (comma-separated)
                  </label>
                  <input
                    id="specialties"
                    name="specialties"
                    type="text"
                    onChange={handleSpecialtiesChange}
                    className="input-field"
                    placeholder="e.g., Oncology, Immunology, Clinical Trials"
                  />
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-3 text-gray-500 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* 🔹 Google Sign Up Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-lg flex items-center justify-center space-x-3 shadow-sm"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Sign up with Google as {formData.userType}</span>
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
