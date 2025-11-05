// // import React from 'react'

// // function App() {
// //   return (
// //     <h1 className="text-3xl font-bold underline">
// //       Hello world!
// //     </h1>

// //   )
// // }

// // export default App


// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { AuthProvider, useAuth } from './context/AuthContext';

// // Layout
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';

// // Pages
// import Home from './pages/Home';
// import Login from './pages/Login';
// import AuthSuccess from './pages/AuthSuccess';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import Publications from './pages/Publications';
// import PublicationDetail from './pages/PublicationDetail';
// import PublicationForm from './pages/PublicationForm';
// import ClinicalTrials from './pages/ClinicalTrials';
// import TrialDetail from './pages/TrialDetail';
// import CreateTrial from './pages/CreateTrial';
// import EditTrial from './pages/EditTrial';
// import Forum from './pages/Forum';
// import ForumPost from './pages/ForumPost';
// import ForumEdit from './pages/ForumEdit';
// import ForumCreate from './pages/ForumCreate';
// import Profile from './pages/Profile';
// import NotFound from './pages/NotFound';

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

// // Public Route (redirect if authenticated)
// const PublicRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return !isAuthenticated ? children : <Navigate to="/dashboard" />;
// };

// function AppRoutes() {
//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <Navbar />
//       <main className="flex-grow">
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/publications" element={<Publications />} />
//           <Route path="/publications/:id" element={<PublicationDetail />} />
//           <Route path="/publications/create" element={<PublicationForm />} />
//           <Route path="/publications/:id/edit" element={<PublicationForm isEdit={true} />} />
//           <Route path="/trials" element={<ClinicalTrials />} />
//           <Route path="/trials/:id" element={<TrialDetail />} />
//           <Route path="/trials/create" element={<CreateTrial />} />
//           <Route path="/trials/:id/edit" element={<EditTrial />} />
//              <Route path="/forum" element={<Forum />} />
//         <Route path="/forum/create" element={<ForumCreate />} />
//         <Route path="/forum/edit/:id" element={<ForumEdit />} />
//         <Route path="/forum/post/:id" element={<ForumPost />} />

//           {/* Auth Routes */}
//           <Route
//             path="/login"
//             element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/register"
//             element={
//               <PublicRoute>
//                 <Register />
//               </PublicRoute>
//             }
//           />

//           {/* Protected Routes */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute>
//                 <Profile />
//               </ProtectedRoute>
//             }
//           />

//           {/* 404 */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </main>
//       <Footer />
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <AppRoutes />
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;


import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import AuthSuccess from './pages/AuthSuccess';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Publications from './pages/Publications';
import PublicationDetail from './pages/PublicationDetail';
import PublicationForm from './pages/PublicationForm';
import ClinicalTrials from './pages/ClinicalTrials';
import TrialDetail from './pages/TrialDetail';
import CreateTrial from './pages/CreateTrial';
import EditTrial from './pages/EditTrial';
import Forum from './pages/Forum';
import ForumPost from './pages/ForumPost';
import ForumEdit from './pages/ForumEdit';
import ForumCreate from './pages/ForumCreate';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/publications/:id" element={<PublicationDetail />} />
          <Route path="/publications/create" element={<PublicationForm />} />
          <Route path="/publications/:id/edit" element={<PublicationForm isEdit />} />

          <Route path="/trials" element={<ClinicalTrials />} />
          <Route path="/trials/:id" element={<TrialDetail />} />
          <Route path="/trials/create" element={<CreateTrial />} />
          <Route path="/trials/:id/edit" element={<EditTrial />} />

          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/create" element={<ForumCreate />} />
          <Route path="/forum/edit/:id" element={<ForumEdit />} />
          <Route path="/forum/post/:id" element={<ForumPost />} />

            <Route path="/auth/success" element={<AuthSuccess />} />

          {/* Auth */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
