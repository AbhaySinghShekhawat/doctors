// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { forumAPI } from '../context/AuthContext';
// import { useAuth } from '../context/AuthContext';
// import { 
//   MessageSquare, 
//   ThumbsUp, 
//   ThumbsDown, 
//   MessageCircle, 
//   Eye,
//   Plus,
//   Search 
// } from 'lucide-react';

// const Forum = () => {
//   const { user, isAuthenticated } = useAuth();
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     category: '',
//     sort: 'recent',
//   });

//   const categories = [
//     'Cancer Research',
//     'Clinical Trials',
//     'Clinical Studies',
//     'Medical Devices',
//     'Public Health',
//     'Genetics',
//     'Biotechnology',
//     'Healthcare Policy',
//     'Medical Ethics',
//     'Drug Development',
//     'Other',
//   ];

//   useEffect(() => {
//     fetchPosts();
//   }, [filters]);

//   const fetchPosts = async () => {
//     setLoading(true);
//     try {
//       const data = await forumAPI.getPosts(filters);
//       setPosts(data.posts || []);
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (e) => {
//     setFilters({
//       ...filters,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const formatDate = (date) => {
//     const now = new Date();
//     const postDate = new Date(date);
//     const diffMs = now - postDate;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMins / 60);
//     const diffDays = Math.floor(diffHours / 24);

//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return postDate.toLocaleDateString();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container-custom max-w-6xl">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Forum</h1>
//             <p className="text-gray-600">
//               Join discussions with researchers and patients worldwide
//             </p>
//           </div>
//           {isAuthenticated && (
//             <Link to="/forum/create" className="btn-primary">
//               <Plus className="w-5 h-5 mr-2" />
//               New Post
//             </Link>
//           )}
//         </div>

//         {/* Filters */}
//         <div className="card p-6 mb-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Category
//               </label>
//               <select
//                 name="category"
//                 value={filters.category}
//                 onChange={handleFilterChange}
//                 className="input-field"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Sort By
//               </label>
//               <select
//                 name="sort"
//                 value={filters.sort}
//                 onChange={handleFilterChange}
//                 className="input-field"
//               >
//                 <option value="recent">Most Recent</option>
//                 <option value="trending">Trending</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Posts List */}
//         {loading ? (
//           <div className="flex justify-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : posts.length > 0 ? (
//           <div className="space-y-4">
//             {posts.map((post) => (
//               <Link
//                 key={post._id}
//                 to={`/forum/${post._id}`}
//                 className="card p-6 hover:shadow-lg transition duration-300 block"
//               >
//                 <div className="flex items-start space-x-4">
//                   {/* Author Avatar */}
//                   <div className="flex-shrink-0">
//                     <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
//                       {post.author?.name?.charAt(0).toUpperCase()}
//                     </div>
//                   </div>

//                   {/* Post Content */}
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between mb-2">
//                       <div className="flex-1">
//                         <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">
//                           {post.title}
//                         </h3>
//                         <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600">
//                           <span className="font-medium">{post.author?.name}</span>
//                           <span>•</span>
//                           <span>{formatDate(post.createdAt)}</span>
//                           <span>•</span>
//                           <span className="badge-primary text-xs">{post.category}</span>
//                         </div>
//                       </div>
//                     </div>

//                     <p className="text-gray-600 line-clamp-2 mb-3">
//                       {post.content}
//                     </p>

//                     {/* Post Stats */}
//                     <div className="flex items-center space-x-6 text-sm text-gray-500">
//                       <div className="flex items-center space-x-1">
//                         <ThumbsUp className="w-4 h-4" />
//                         <span>{post.likes?.length || 0}</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <ThumbsDown className="w-4 h-4" />
//                         <span>{post.dislikes?.length || 0}</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <MessageCircle className="w-4 h-4" />
//                         <span>{post.replies?.length || 0} replies</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <Eye className="w-4 h-4" />
//                         <span>{post.views || 0} views</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">
//               No posts yet
//             </h3>
//             <p className="text-gray-500 mb-4">
//               Be the first to start a discussion!
//             </p>
//             {isAuthenticated && (
//               <Link to="/forum/create" className="btn-primary">
//                 Create First Post
//               </Link>
//             )}
//           </div>
//         )}

//         {/* Info Banner */}
//         <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
//           <h3 className="font-semibold text-blue-900 mb-2">Community Guidelines</h3>
//           <ul className="text-sm text-blue-800 space-y-1">
//             <li>• Be respectful and constructive in your discussions</li>
//             <li>• Share accurate medical information with proper sources</li>
//             <li>• Protect patient privacy - do not share personal health information</li>
//             <li>• Report any inappropriate content to moderators</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Forum;


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { forumAPI } from "../context/AuthContext";

const Forum = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const data = await forumAPI.getPosts();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("❌ Failed to load posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await forumAPI.deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Forum</h1>
          <Link
            to="/forum/create"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Create Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No posts yet. Be the first to create one!
          </p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {post.title}
                  </h2>
                  <div className="flex gap-3">
                    <Link
                      to={`/forum/edit/${post._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">
                  {post.content.slice(0, 150)}...
                </p>
                <div className="mt-3 text-sm text-gray-500 flex justify-between">
                  <span>Category: {post.category}</span>
                  <Link
                    to={`/forum/post/${post._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
