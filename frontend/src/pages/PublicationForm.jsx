import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { publicationsAPI } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ArrowLeft, Save } from "lucide-react";

const PublicationForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    journal: "",
    year: "",
    condition: "",
    abstract: "",
    keywords: "",
    doi: "",
    pmid: "",
    publisher: "",
    link: "",
    institution: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      fetchPublication();
    }
  }, [isEdit, id]);

  const fetchPublication = async () => {
    try {
      const data = await publicationsAPI.getById(id);
      const pub = data.publication;
      setFormData({
        title: pub.title || "",
        authors: pub.authors?.join(", ") || "",
        journal: pub.journal || "",
        year: pub.year?.toString() || "",
        condition: pub.condition || "",
        abstract: pub.abstract || "",
        keywords: pub.keywords?.join(", ") || "",
        doi: pub.doi || "",
        pmid: pub.pmid || "",
        publisher: pub.publisher || "",
        link: pub.link || "",
        institution: pub.institution?.join(", ") || "",
      });
    } catch (error) {
      toast.error("Failed to fetch publication details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ Special handling for year to prevent -1 or invalid characters
    if (name === "year") {
      if (/^-?\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Safe year validation
    const yearInput = String(formData.year).trim();
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(yearInput, 10);

    if (
      isNaN(yearNum) ||
      yearInput.length !== 4 ||
      yearNum < 1900 ||
      yearNum > currentYear
    ) {
      toast.error(`Please enter a valid 4-digit year (1900 - ${currentYear})`);
      setLoading(false);
      return;
    }

    // ✅ Prepare payload
    const payload = {
      ...formData,
      year: yearNum,
      authors: formData.authors
        ? formData.authors.split(",").map((a) => a.trim())
        : [],
      keywords: formData.keywords
        ? formData.keywords.split(",").map((k) => k.trim())
        : [],
      institution: formData.institution
        ? formData.institution.split(",").map((i) => i.trim())
        : [],
      uploadedBy: user?._id,
    };

    // ✅ Basic validation
    if (
      !payload.title ||
      !payload.journal ||
      !payload.abstract ||
      !payload.condition ||
      !payload.link
    ) {
      toast.error("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      if (isEdit) {
        await publicationsAPI.update(id, payload);
        toast.success("Publication updated successfully!");
      } else {
        await publicationsAPI.create(payload);
        toast.success("Publication created successfully!");
      }
      navigate("/publications");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-3xl">
        <Link
          to="/publications"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Publications
        </Link>

        <div className="bg-white shadow-md rounded-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEdit ? "Edit Publication" : "Create New Publication"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Authors & Journal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Authors (comma separated)
                </label>
                <input
                  type="text"
                  name="authors"
                  value={formData.authors}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Journal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="journal"
                  value={formData.journal}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Year & Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g. 2024"
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Condition <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Abstract <span className="text-red-500">*</span>
              </label>
              <textarea
                name="abstract"
                value={formData.abstract}
                onChange={handleChange}
                rows="5"
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Keywords & Publisher */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Publisher
                </label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* DOI & PMID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  DOI
                </label>
                <input
                  type="text"
                  name="doi"
                  value={formData.doi}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  PMID
                </label>
                <input
                  type="text"
                  name="pmid"
                  value={formData.pmid}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Institution */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Institution (comma separated)
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                External Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex justify-center items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Publication"
                : "Create Publication"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublicationForm;
