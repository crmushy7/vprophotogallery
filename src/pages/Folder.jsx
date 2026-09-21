import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getAlbumById,
  getFolderById,
  getPhotos,
  deletePhoto
} from "../services/firestoreService";

import { getImageUrl } from "../services/r2Service";
import { useAuth } from "../context/AuthContext";

import AddPhotosModal from "../components/AddPhotosModal";

import "./Folder.css";

function Folder() {
  const { albumId, folderId } = useParams();
  const { user } = useAuth();

  const [album, setAlbum] = useState(null);
  const [folder, setFolder] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddPhotos, setShowAddPhotos] =
    useState(false);

  const [selectedPhotoIndex, setSelectedPhotoIndex] =
    useState(null);

  const loadFolder = async () => {
    try {
      setLoading(true);

      const albumData =
        await getAlbumById(albumId);

      const folderData =
        await getFolderById(
          albumId,
          folderId
        );

      if (!albumData || !folderData) {
        setAlbum(albumData);
        setFolder(null);
        setPhotos([]);
        return;
      }

      const photoData =
        await getPhotos(
          albumId,
          folderId
        );

        

      const photosWithImages =
        await Promise.all(
          photoData.map(async (photo) => {
            if (!photo.image) {
              return {
                ...photo,
                imageUrl: ""
              };
            }

            try {
              const imageUrl =
                await getImageUrl(
                  photo.image
                );

              return {
                ...photo,
                imageUrl
              };
            } catch (error) {
              console.error(
                `Failed to load photo ${photo.name}:`,
                error
              );

              return {
                ...photo,
                imageUrl: ""
              };
            }
          })
        );

      setAlbum(albumData);

      setFolder({
        ...folderData,
        photoCount:
          photoData.length
      });

      setPhotos(photosWithImages);
    } catch (error) {
      console.error(
        "Failed to load folder:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePhotoSelection = (photoId) => {
  setSelectedPhotos((current) =>
    current.includes(photoId)
      ? current.filter((id) => id !== photoId)
      : [...current, photoId]
  );
};

const toggleSelectAll = () => {
  if (selectedPhotos.length === photos.length) {
    setSelectedPhotos([]);
  } else {
    setSelectedPhotos(photos.map((photo) => photo.id));
  }
};

const handleBulkDownload = async () => {
  if (selectedPhotos.length === 0) {
    alert("Please select at least one photo.");
    return;
  }

  setIsDownloading(true);

  try {
    const photosToDownload = photos.filter((photo) =>
      selectedPhotos.includes(photo.id)
    );

    for (const photo of photosToDownload) {
      const link = document.createElement("a");

      link.href =
        `http://localhost:5000/api/download-photo?key=${encodeURIComponent(
          photo.image
        )}`;

      link.download = photo.name || "photo.jpg";
      link.target = "_blank";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Small delay so the browser doesn't block
      // multiple downloads too aggressively.
      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );
    }
  } catch (error) {
    console.error(
      "Bulk download failed:",
      error
    );

    alert("Some photos could not be downloaded.");
  } finally {
    setIsDownloading(false);
  }
};

  const handleDeletePhoto = async (photo) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${photo.name}"?`
  );

  if (!confirmed) {
    return;
  }

  try {
    // Delete image from R2
    const response = await fetch(
      "http://localhost:5000/api/delete-photo",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          key: photo.image
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Failed to delete photo from storage."
      );
    }

    // Delete photo document from Firestore
    await deletePhoto(
      albumId,
      folderId,
      photo.id
    );

    // Refresh folder
    await loadFolder();

    // Close viewer if the deleted photo was open
    setSelectedPhotoIndex(null);

  } catch (error) {
    console.error(
      "Failed to delete photo:",
      error
    );

    window.alert(
      error.message ||
        "Failed to delete photo."
    );
  }
};

  useEffect(() => {
    loadFolder();
  }, [albumId, folderId]);

  const closeViewer = () => {
    setSelectedPhotoIndex(null);
  };

  const showPreviousPhoto = (e) => {
    e.stopPropagation();

    if (selectedPhotoIndex === null) return;

    setSelectedPhotoIndex((currentIndex) => {
      if (currentIndex === 0) {
        return photos.length - 1;
      }

      return currentIndex - 1;
    });
  };

  const showNextPhoto = (e) => {
    e.stopPropagation();

    if (selectedPhotoIndex === null) return;

    setSelectedPhotoIndex((currentIndex) => {
      if (currentIndex === photos.length - 1) {
        return 0;
      }

      return currentIndex + 1;
    });
  };

  if (loading) {
    return (
      <main className="folder-page">
        <h1>Loading Collection...</h1>
      </main>
    );
  }

  if (!folder || !album) {
    return (
      <main className="folder-page">
        <h1>Collection Not Found</h1>

        <Link
          to={`/album/${albumId}`}
        >
          Back to Album
        </Link>
      </main>
    );
  }

  const selectedPhoto =
    selectedPhotoIndex !== null
      ? photos[selectedPhotoIndex]
      : null;

  return (
    <main className="folder-page">
      <section className="folder-header">
        <Link
          to={`/album/${albumId}`}
          className="back-link"
        >
          ← Back to {album.title}
        </Link>

        <div className="folder-title-row">
          <div>
            <p className="folder-category">
              {album.category}
            </p>

            <h1>{folder.name}</h1>

            <p className="folder-photo-count">
              {photos.length} Photos
            </p>
          </div>

          <div className="folder-actions">
            {user && (
              <button
                className="add-photos-button"
                onClick={() =>
                  setShowAddPhotos(true)
                }
              >
                + Add Photos
              </button>
            )}

            <a
  href={`http://localhost:5000/api/download-collection?albumId=${encodeURIComponent(
    albumId
  )}&folderId=${encodeURIComponent(
    folderId
  )}&folderName=${encodeURIComponent(
    folder.name
  )}`}
  className="download-button"
>
  ↓ Download Collection
</a>
          </div>
        </div>
      </section>

      <section className="photo-section">
        <div className="photo-heading">
          <h2>Photos</h2>

          <span>
            {photos.length} photos
          </span>
        </div>

        <div className="bulk-download-controls">
  <button
    type="button"
    onClick={toggleSelectAll}
    className="select-all-button"
  >
    {selectedPhotos.length === photos.length
      ? "Deselect All"
      : "Select All"}
  </button>

  <button
    type="button"
    onClick={handleBulkDownload}
    className="bulk-download-button"
    disabled={
      selectedPhotos.length === 0 ||
      isDownloading
    }
  >
    {isDownloading
      ? "Downloading..."
      : `↓ Download Selected${
          selectedPhotos.length > 0
            ? ` (${selectedPhotos.length})`
            : ""
        }`}
  </button>
</div>
        <div className="photo-grid">
          {photos.length > 0 ? (
           photos.map((photo, index) => (
  <div
    className="photo-card-wrapper"
    key={photo.id}
  >
    <label className="photo-select">
  <input
    type="checkbox"
    checked={selectedPhotos.includes(photo.id)}
    onChange={(event) => {
      event.stopPropagation();
      togglePhotoSelection(photo.id);
    }}
    onClick={(event) => event.stopPropagation()}
  />

  <span>Select</span>
</label>
    <button
      className="photo-card"
      onClick={() =>
        setSelectedPhotoIndex(index)
      }
      type="button"
    >
      {photo.imageUrl ? (
        <img
          src={photo.imageUrl}
          alt={photo.name}
        />
      ) : (
        <div className="photo-placeholder">
          Image unavailable
        </div>
      )}
    </button>

    {user && (
      <button
        type="button"
        className="delete-photo-button"
        onClick={() =>
          handleDeletePhoto(photo)
        }
      >
        Delete
      </button>
    )}
  </div>
))
          ) : (
            <p className="no-results">
              No photos have been added to
              this collection yet.
            </p>
          )}
        </div>
      </section>

      {showAddPhotos && (
        <AddPhotosModal
          albumId={albumId}
          folderId={folderId}
          onClose={() =>
            setShowAddPhotos(false)
          }
          onPhotosAdded={loadFolder}
        />
      )}

      {selectedPhoto && (
        <div
          className="photo-viewer"
          onClick={closeViewer}
        >
          <button
            type="button"
            className="viewer-close"
            onClick={closeViewer}
          >
            ×
          </button>

          <button
            type="button"
            className="viewer-prev"
            onClick={showPreviousPhoto}
          >
            ‹
          </button>

          <div
            className="viewer-image-container"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.name}
              className="viewer-image"
            />

            <div className="viewer-bottom">
  <div className="viewer-counter">
    {selectedPhotoIndex + 1} /{" "}
    {photos.length}
  </div>

  <a
  href={`http://localhost:5000/api/download-photo?key=${encodeURIComponent(
    selectedPhoto.image
  )}`}
  className="viewer-download"
  onClick={(e) =>
    e.stopPropagation()
  }
>
  ↓ Download Photo
</a>
</div>
          </div>

          <button
            type="button"
            className="viewer-next"
            onClick={showNextPhoto}
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}

export default Folder;