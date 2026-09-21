import { useState } from "react";

import { updateAlbum } from "../services/firestoreService";
import { uploadImage } from "../services/r2Service";
import { useAuth } from "../context/AuthContext";

import "./EditAlbumModal.css";

function EditAlbumModal({
  album,
  onClose,
  onAlbumUpdated
}) {
  const { user } = useAuth();

  const [title, setTitle] = useState(
    album.title || ""
  );

  const [category, setCategory] =
    useState(album.category || "Wedding");

  const [date, setDate] = useState(
    album.date || ""
  );

  const [coverImage, setCoverImage] =
    useState(null);

  const [previewUrl, setPreviewUrl] =
    useState(album.coverImage || "");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setCoverImage(file);

    setPreviewUrl(
      URL.createObjectURL(file)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage(
        "Please enter an album name."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let coverKey =
        album.originalCoverImage ||
        album.coverImage ||
        "";

      if (coverImage) {
        const uploadResult =
          await uploadImage(
            coverImage,
            `albums/${album.id}/cover`
          );

        coverKey = uploadResult.key;
      }

      await updateAlbum(
        album.id,
        {
          title: title.trim(),
          category,
          date,
          coverImage: coverKey
        }
      );

      onAlbumUpdated();
      onClose();

    } catch (error) {
      console.error(
        "Failed to update album:",
        error
      );

      setMessage(
        error.message ||
          "Failed to update album."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-album-modal">

        <div className="modal-header">
          <h2>Edit Album</h2>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
            disabled={loading}
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
            <label>
              Change Cover Photo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
          </div>

          {previewUrl && (
            <div className="image-preview">
              <p>Cover Preview</p>

              <img
                src={previewUrl}
                alt="Album cover preview"
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
              ? "Saving..."
              : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditAlbumModal;