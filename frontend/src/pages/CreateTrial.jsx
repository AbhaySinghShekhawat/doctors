import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trialsAPI, useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { PlusCircle } from "lucide-react";

const CreateTrial = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    nctId: "",
    condition: "",
    location: "",
    phase: "",
    status: "Recruiting",
    description: "",
    eligibility: "",
    contactEmail: "",
    startDate: "",
    endDate: "",
    tags: "",
    participants: { target: 0, enrolled: 0, pending: 0 },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("participants.")) {
      const key = name.split(".")[1];
      setForm({
        ...form,
        participants: { ...form.participants, [key]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const dataToSend = {
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      };
      await trialsAPI.create(dataToSend, token);
      toast.success("Trial created successfully!");
      navigate("/trials");
    } catch (error) {
      console.error("Error creating trial:", error);
      toast.error("Failed to create trial");
    }
  };

  if (!user || user.userType !== "researcher") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Only researchers can create trials.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <PlusCircle className="w-7 h-7 mr-2 text-blue-600" />
          Create New Clinical Trial
        </h1>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Trial Title" className="input-field" required />
            <input name="nctId" value={form.nctId} onChange={handleChange} placeholder="NCT ID (optional)" className="input-field" />
            <input name="condition" value={form.condition} onChange={handleChange} placeholder="Condition" className="input-field" required />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="input-field" required />
            <select name="phase" value={form.phase} onChange={handleChange} className="input-field" required>
              <option value="">Select Phase</option>
              <option>Phase 1</option>
              <option>Phase 2</option>
              <option>Phase 3</option>
              <option>Phase 4</option>
              <option>Not Applicable</option>
            </select>
            <select name="status" value={form.status} onChange={handleChange} className="input-field">
              <option>Recruiting</option>
              <option>Active</option>
              <option>Completed</option>
              <option>Suspended</option>
              <option>Terminated</option>
              <option>Not yet recruiting</option>
            </select>
            <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="Contact Email" className="input-field" required />
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="input-field" />
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="input-field" />
          </div>

          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Detailed Description" rows="4" className="input-field" />
          <textarea name="eligibility" value={form.eligibility} onChange={handleChange} placeholder="Eligibility Criteria" rows="3" className="input-field" />
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="input-field" />

          <div className="grid grid-cols-3 gap-4">
            <input type="number" name="participants.target" value={form.participants.target} onChange={handleChange} placeholder="Target" className="input-field" />
            <input type="number" name="participants.enrolled" value={form.participants.enrolled} onChange={handleChange} placeholder="Enrolled" className="input-field" />
            <input type="number" name="participants.pending" value={form.participants.pending} onChange={handleChange} placeholder="Pending" className="input-field" />
          </div>

          <button type="submit" className="btn-primary w-full">
            Create Trial
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTrial;
