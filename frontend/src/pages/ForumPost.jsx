// import { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { forumAPI } from '../context/AuthContext';
// import { useAuth } from '../context/AuthContext';
// import { 
//   ArrowLeft, 
//   ThumbsUp, 
//   ThumbsDown, 
//   MessageCircle, 
//   Trash2,
//   Send
// } from 'lucide-react';

// const ForumPost = () => {
//   const { id } = useParams();
//   const { user, isAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [replyContent, setReplyContent] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetchPost();
//   }, [id]);

//   const fetchPost = async () => {
//     try {
//       const data = await forumAPI.getPosts({});
//       const foundPost = data.posts?.find(p => p._id === id);
//       setPost(foundPost);
//     } catch (error) {
//       console.error('Error fetching post:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReaction = async (type) => {
//     if (!isAuthenticated) {
//       navigate('/login');
//       return;
//     }

//     try {
//       const data = await forumAPI.toggleReaction(id, type);
//       setPost({
//         ...post,
//         likes: Array(data.likes).fill(null),
//         dislikes: Array(data.dislikes).fill(null),
//       });
//     } catch (error) {
//       console.error('Error toggling reaction:', error);
//     }
//   };

//   const handleReplySubmit = async (e) => {
//     e.preventDefault();
//     if (!replyContent.trim()) return;

//     setSubmitting(true);
//     try {
//       const data = await forumAPI.addReply(id, replyContent);
//       setPost({
//         ...post,
//         replies: data.replies,
//       });
//       setReplyContent('');
//     } catch (error) {
//       console.error('Error adding reply:', error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (window.confirm('Are you sure you want to delete this post?')) {
//       try {
//         await forumAPI.deletePost(id);
//         navigate('/forum');
//       } catch (error) {
//         console.error('Error deleting post:', error);
//       }
//     }
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!post) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-700 mb-2">Post Not Found</h2>
//           <Link to="/forum" className="text-blue-600 hover:text-blue-700">
//             ← Back to Forum
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const canDelete = user?._id === post.author?._id;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container-custom max-w-4xl">
//         {/* Back Button */}
//         <Link
//           to="/forum"
//           className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back to Forum
//         </Link>

//         {/* Main Post Card */}
//         <div className="card p-8 mb-6">
//           {/* Post Header */}
//           <div className="flex items-start justify-between mb-6">
//             <div className="flex items-start space-x-4 flex-1">
//               <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
//                 {post.author?.name?.charAt(0).toUpperCase()}
//               </div>
//               <div className="flex-1">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                   {post.title}
//                 </h1>
//                 <div className="flex items-center space-x-3 text-sm text-gray-600">
//                   <span className="font-medium">{post.author?.name}</span>
//                   <span>•</span>
//                   <span>{formatDate(post.createdAt)}</span>
//                   <span>•</span>
//                   <span className="badge-primary">{post.category}</span>
//                 </div>
//               </div>
//             </div>
//             {canDelete && (
//               <button
//                 onClick={handleDelete}
//                 className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition ml-4"
//               >
//                 <Trash2 className="w-5 h-5" />
//               </button>
//             )}
//           </div>

//           {/* Post Content */}
//           <div className="prose max-w-none mb-6">
//             <p className="text-gray-700 leading-relaxed whitespace-pre-line">
//               {post.content}
//             </p>
//           </div>

//           {/* Reactions */}
//           <div className="flex items-center space-x-4 pt-6 border-t">
//             <button
//               onClick={() => handleReaction('like')}
//               className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
//                 isAuthenticated
//                   ? 'hover:bg-green-50 text-gray-700'
//                   : 'cursor-not-allowed opacity-50'
//               }`}
//               disabled={!isAuthenticated}
//             >
//               <ThumbsUp className="w-5 h-5" />
//               <span className="font-semibold">{post.likes?.length || 0}</span>
//             </button>

//             <button
//               onClick={() => handleReaction('dislike')}
//               className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
//                 isAuthenticated
//                   ? 'hover:bg-red-50 text-gray-700'
//                   : 'cursor-not-allowed opacity-50'
//               }`}
//               disabled={!isAuthenticated}
//             >
//               <ThumbsDown className="w-5 h-5" />
//               <span className="font-semibold">{post.dislikes?.length || 0}</span>
//             </button>

//             <div className="flex items-center space-x-2 text-gray-600">
//               <MessageCircle className="w-5 h-5" />
//               <span className="font-semibold">{post.replies?.length || 0} replies</span>
//             </div>
//           </div>
//         </div>

//         {/* Reply Form */}
//         {isAuthenticated ? (
//           <div className="card p-6 mb-6">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Add a Reply</h3>
//             <form onSubmit={handleReplySubmit}>
//               <textarea
//                 value={replyContent}
//                 onChange={(e) => setReplyContent(e.target.value)}
//                 placeholder="Share your thoughts..."
//                 rows="4"
//                 className="input-field mb-4"
//                 required
//               />
//               <button
//                 type="submit"
//                 disabled={submitting || !replyContent.trim()}
//                 className="btn-primary"
//               >
//                 {submitting ? (
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <>
//                     <Send className="w-5 h-5 mr-2" />
//                     Post Reply
//                   </>
//                 )}
//               </button>
//             </form>
//           </div>
//         ) : (
//           <div className="card p-6 mb-6 text-center">
//             <p className="text-gray-600 mb-4">
//               Please log in to reply to this post
//             </p>
//             <Link to="/login" className="btn-primary">
//               Log In
//             </Link>
//           </div>
//         )}

//         {/* Replies */}
//         <div className="space-y-4">
//           <h3 className="text-xl font-bold text-gray-900 mb-4">
//             Replies ({post.replies?.length || 0})
//           </h3>
          
//           {post.replies && post.replies.length > 0 ? (
//             post.replies.map((reply, index) => (
//               <div key={index} className="card p-6">
//                 <div className="flex items-start space-x-4">
//                   <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
//                     {reply.author?.name?.charAt(0).toUpperCase() || 'U'}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <span className="font-semibold text-gray-900">
//                         {reply.author?.name || 'Unknown User'}
//                       </span>
//                       <span className="text-gray-500 text-sm">
//                         {formatDate(reply.createdAt)}
//                       </span>
//                     </div>
//                     <p className="text-gray-700 leading-relaxed whitespace-pre-line">
//                       {reply.content}
//                     </p>
//                     <div className="flex items-center space-x-4 mt-3 text-sm">
//                       <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600">
//                         <ThumbsUp className="w-4 h-4" />
//                         <span>{reply.likes?.length || 0}</span>
//                       </button>
//                       <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600">
//                         <ThumbsDown className="w-4 h-4" />
//                         <span>{reply.dislikes?.length || 0}</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               No replies yet. Be the first to reply!
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForumPost;
  

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { forumAPI } from "../context/AuthContext";

const ForumPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [reply, setReply] = useState("");

  const fetchPost = async () => {
    try {
      const data = await forumAPI.getPostById(id);
      setPost(data.post);
    } catch (err) {
      console.error("❌ Failed to load post:", err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    await forumAPI.addReply(id, reply);
    setReply("");
    fetchPost();
  };

  if (!post)
    return <p className="text-center mt-10 text-gray-500">Loading post...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <p className="text-gray-500 text-sm mb-4">Category: {post.category}</p>
          <p className="text-gray-700 mb-6">{post.content}</p>

          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-3">Replies</h2>
            {post.replies?.length > 0 ? (
              <div className="space-y-4">
                {post.replies.map((r, i) => (
                  <div key={i} className="bg-gray-50 border p-3 rounded-lg">
                    <p className="text-gray-800">{r.content}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      — {r.author?.name || "Anonymous"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No replies yet.</p>
            )}

            <form onSubmit={handleReply} className="mt-6 flex gap-2">
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 border p-3 rounded-lg"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 rounded-lg"
              >
                Reply
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPost;
