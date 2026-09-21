import { useState } from "react";

import { addFolder } from "../services/firestoreService";
import { uploadImage } from "../services/r2Service";
import { useAuth } from "../context/AuthContext";

import "./AddFolderModal.css";

function AddFolderModal({
  albumId,
  onClose,
  onFolderAdded
}) {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [coverImage, setCoverImage] =
    useState(null);
  const [previewUrl, setPreviewUrl] =
    useState("");

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
        "Please enter a folder name."
      );
      return;
    }

    if (!coverImage) {
      setMessage(
        "Please select a cover photo."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const uploadResult =
        await uploadImage(
          coverImage,
          `albums/${albumId}/folders`
        );

      await addFolder(
        albumId,
        {
          name: name.trim(),
          coverImage: uploadResult.key
        },
        user
      );

      onFolderAdded();
      onClose();
    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
          "Failed to create folder."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="folder-modal">
        <div className="modal-header">
          <h2>Add Collection</h2>

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
            <label>
              Collection Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. Bride & Groom"
              required
            />
          </div>

          <div className="form-group">
            <label>
              Cover Photo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
              required
            />
          </div>

          {previewUrl && (
            <div className="image-preview">
              <p>Cover Preview</p>

              <img
                src={previewUrl}
                alt="Folder cover preview"
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
              ? "Uploading & Saving..."
              : "Save Collection"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddFolderModal;