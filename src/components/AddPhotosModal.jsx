import { useState } from "react";

import { addPhoto } from "../services/firestoreService";
import { uploadImage } from "../services/r2Service";
import { useAuth } from "../context/AuthContext";

import "./AddPhotosModal.css";

function AddPhotosModal({
  albumId,
  folderId,
  onClose,
  onPhotosAdded
}) {
  const { user } = useAuth();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(
      e.target.files
    );

    setFiles(selectedFiles);
    setMessage("");
    setProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setMessage(
        "Please select at least one photo."
      );
      return;
    }

    setLoading(true);
    setMessage("");
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const uploadResult =
          await uploadImage(
            file,
            `albums/${albumId}/folders/${folderId}/photos`
          );

        await addPhoto(
          albumId,
          folderId,
          {
            name: file.name,
            image: uploadResult.key,
            size: file.size
          },
          user
        );

        setProgress(
          Math.round(
            ((i + 1) / files.length) * 100
          )
        );
      }

      onPhotosAdded();
      onClose();
    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
          "Failed to upload photos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="photos-modal">
        <div className="modal-header">
          <h2>Add Photos</h2>

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
              Select Photos
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>

          {files.length > 0 && (
            <div className="selected-photos">
              <p>
                {files.length} photos selected
              </p>

              <div className="selected-file-list">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="selected-file"
                  >
                    <span>
                      {file.name}
                    </span>

                    <span>
                      {(
                        file.size /
                        (1024 * 1024)
                      ).toFixed(2)}{" "}
                      MB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="upload-progress">
              <div className="progress-text">
                Uploading {progress}%
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`
                  }}
                />
              </div>
            </div>
          )}

          {message && (
            <p className="modal-message">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="save-photos-button"
            disabled={
              loading ||
              files.length === 0
            }
          >
            {loading
              ? `Uploading ${progress}%...`
              : "Upload Photos"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPhotosModal;