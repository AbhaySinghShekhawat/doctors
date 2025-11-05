const ForumPost = require('../models/ForumPost');

// ✅ Create a new post
exports.createPost = async (req, res) => {
  try {
    const post = await ForumPost.create({ ...req.body, author: req.user.id });
    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get all posts (with filters & sorting)
exports.getPosts = async (req, res) => {
  try {
    const { category, sort } = req.query;

    let query = {};
    if (category) query.category = category;

    let sortOption = {};
    if (sort === 'trending') sortOption = { 'replies.length': -1, 'likes.length': -1, createdAt: -1 };
    else sortOption = { createdAt: -1 }; // recent by default

    const posts = await ForumPost.find(query)
      .populate('author', 'name email')
      .sort(sortOption);

    res.status(200).json({ success: true, count: posts.length, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPost = async(req,res,next)=>{
  try{
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name email')
      .populate('replies.author', 'name email');
    if(!post){
      return res.send({
        success:false,
        message:'Post not found',
      })
    }
    post.views +=1;
    await post.save();
    res.send({
      success:true,
      message:'Post found successfully',
      post,
    })
    
  }catch(err){
    next(err)
  }
}

exports.updatePost = async(req,res,next)=>{
  try{
    const post = await ForumPost.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true,
    });
    if(!post){
      return res.send({
        success:false,
        message:'Post not found',
      })
    }
    if(post.author.toString() !== req.user.id){
      return res.send({
        success:false,
        message:'You are not authorized to update this post',
      })
    }
    res.send({
      success:true,
      message:'Post updated successfully',
      post,
    })
    

  }catch(err){
    next(err)
  }
}

// ✅ Like / Dislike Post
exports.toggleReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'like' or 'dislike'
    const userId = req.user.id;

    const post = await ForumPost.findById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (type === 'like') {
      post.dislikes.pull(userId);
      post.likes.includes(userId) ? post.likes.pull(userId) : post.likes.push(userId);
    } else if (type === 'dislike') {
      post.likes.pull(userId);
      post.dislikes.includes(userId) ? post.dislikes.pull(userId) : post.dislikes.push(userId);
    }

    await post.save();
    res.json({ success: true, likes: post.likes.length, dislikes: post.dislikes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Add reply
exports.addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await ForumPost.findById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.replies.push({
      author: req.user.id,
      content: req.body.content,
    });

    await post.save();
    res.status(201).json({ success: true, message: 'Reply added', replies: post.replies });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
