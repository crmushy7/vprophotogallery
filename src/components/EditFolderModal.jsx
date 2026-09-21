import { useState } from "react";

import { updateFolder } from "../services/firestoreService";
import { uploadImage } from "../services/r2Service";
import { useAuth } from "../context/AuthContext";

import "./EditFolderModal.css";

function EditFolderModal({
  albumId,
  folder,
  onClose,
  onFolderUpdated
}) {
  const { user } = useAuth();

  const [name, setName] = useState(
    folder.name || ""
  );

  const [coverImage, setCoverImage] =
    useState(null);

  const [previewUrl, setPreviewUrl] =
    useState(folder.coverImage || "");

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

    if (!name.trim()) {
      setMessage(
        "Please enter a collection name."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let coverKey = folder.coverImage || "";

      // Upload new cover only if one was selected
      if (coverImage) {
        const uploadResult =
          await uploadImage(
            coverImage,
            `albums/${albumId}/folders`
          );

        coverKey = uploadResult.key;
      }

      await updateFolder(
        albumId,
        folder.id,
        {
          name: name.trim(),
          coverImage: coverKey
        }
      );

      onFolderUpdated();
      onClose();

    } catch (error) {
      console.error(
        "Failed to update collection:",
        error
      );

      setMessage(
        error.message ||
          "Failed to update collection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="folder-modal">
        <div className="modal-header">
          <h2>Edit Collection</h2>

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
            <label>
              Collection Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
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
                alt="Collection cover preview"
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
            className="save-folder-button"
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

export default EditFolderModal;