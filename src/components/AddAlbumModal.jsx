import { useState } from "react";
import { addAlbum } from "../services/firestoreService";
import { uploadImage } from "../services/r2Service";
import { useAuth } from "../context/AuthContext";
import "./AddAlbumModal.css";

function AddAlbumModal({ onClose, onAlbumAdded }) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Wedding");
  const [date, setDate] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setCoverImage(file);

    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverImage) {
      setMessage("Please select a cover photo.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // 1. Upload cover photo to Cloudflare R2
      const uploadResult = await uploadImage(coverImage);

      // 2. Save album information + R2 file key to Firestore
      await addAlbum(
        {
          title,
          category,
          date,
          coverImage: uploadResult.key
        },
        user
      );

      // 3. Refresh gallery
      onAlbumAdded();

      // 4. Close modal
      onClose();
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Failed to create album.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">

      <div className="album-modal">

        <div className="modal-header">
          <h2>Add Album</h2>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Album Name</label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter album name"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option value="Wedding">
                Wedding
              </option>

              <option value="Graduation">
                Graduation
              </option>

              <option value="Parties">
                Parties
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Event Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Cover Photo</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          {previewUrl && (
            <div className="image-preview">
              <p>Cover Preview</p>

              <img
                src={previewUrl}
                alt="Cover preview"
              />
            </div>
          )}

          {message && (
            <p className="modal-message">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="save-album-button"
            disabled={loading}
          >
            {loading
              ? "Uploading & Saving..."
              : "Save Album"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddAlbumModal;