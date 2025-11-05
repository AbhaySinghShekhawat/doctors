import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { forumAPI } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const ForumEdit = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await forumAPI.getPostById(id);
        setForm(data.post);
      } catch (err) {
        console.error("Failed to load post:", err);
      }
    })();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/forum/${id}`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Post updated successfully!");
      navigate("/forum");
    } catch (err) {
      console.error("❌ Update failed:", err);
      toast.error("Failed to update post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows="6"
              className="w-full border p-3 rounded-lg"
              required
            />
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
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForumEdit;
