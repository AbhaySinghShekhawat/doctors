import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forumAPI } from "../context/AuthContext";

const ForumCreate = () => {
  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", form);

    try {
      await forumAPI.createPost(form);
      navigate("/forum");
    } catch (err) {
      console.error("❌ Create post failed:", err.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="bg-white shadow-md rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
            Create a New Forum Post
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter post title"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={5}
            />

            {/* Content */}
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your post (minimum 20 characters)"
              rows="6"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={20}
            />

            {/* Category Dropdown */}
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Cancer Research">Cancer Research</option>
              <option value="Clinical Trials">Clinical Trials</option>
              <option value="Clinical Studies">Clinical Studies</option>
              <option value="Medical Devices">Medical Devices</option>
              <option value="Public Health">Public Health</option>
              <option value="Genetics">Genetics</option>
              <option value="Biotechnology">Biotechnology</option>
              <option value="Healthcare Policy">Healthcare Policy</option>
              <option value="Medical Ethics">Medical Ethics</option>
              <option value="Drug Development">Drug Development</option>
              <option value="Other">Other</option>
            </select>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              Create Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForumCreate;
