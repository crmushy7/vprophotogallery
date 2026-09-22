import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditAlbumModal from "../components/EditAlbumModal";
import {
  getAlbumById,
  getFolders,
  deleteFolder
} from "../services/firestoreService";
import { deleteAlbum }
from "../services/firestoreService";

import { useNavigate }
from "react-router-dom";
import { getImageUrl } from "../services/r2Service";
import { useAuth } from "../context/AuthContext";
import AddFolderModal from "../components/AddFolderModal";
import EditFolderModal from "../components/EditFolderModal";

import "./Album.css";
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


function Album() {
  const { albumId } = useParams();
  const { user } = useAuth();
  const [showEditAlbum, setShowEditAlbum] =
  useState(false);
  const [album, setAlbum] = useState(null);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showAddFolder, setShowAddFolder] =
    useState(false);
    const [editingFolder, setEditingFolder] =
  useState(null);

  const handleDeleteAlbum = async () => {
  const confirmed = window.confirm(
    `Delete album "${album.title}"?\n\nAll collections and photos will be permanently removed.`
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
  `${API_URL}/api/delete-album`,
  {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      albumId
    })
  }
);

    const data =
      await response.json();

    if (
      !response.ok ||
      !data.success
    ) {
      throw new Error(
        data.message
      );
    }

    await deleteAlbum(albumId);

    navigate("/gallery");

  } catch (error) {
    console.error(
      "Failed to delete album:",
      error
    );

    alert(
      error.message ||
      "Failed to delete album."
    );
  }
};

  const loadAlbum = async () => {
    try {
      setLoading(true);

      const albumData = await getAlbumById(albumId);

let coverUrl = "";

try {
  if (albumData.coverImage) {
    coverUrl = await getImageUrl(
      albumData.coverImage
    );
  }
} catch (error) {
  console.error(
    "Failed to load album cover:",
    error
  );
}

      if (!albumData) {
        setAlbum(null);
        setFolders([]);
        return;
      }

      const folderData =
        await getFolders(albumId);

      const foldersWithImages =
        await Promise.all(
          folderData.map(async (folder) => {
            if (!folder.coverImage) {
              return {
                ...folder,
                coverImage: ""
              };
            }

            try {
              const imageUrl =
                await getImageUrl(
                  folder.coverImage
                );

              return {
                ...folder,
                coverImage: imageUrl
              };
            } catch (error) {
              console.error(
                `Failed to load folder cover for ${folder.name}:`,
                error
              );

              return {
                ...folder,
                coverImage: ""
              };
            }
          })
        );

      setAlbum({
  ...albumData,
  originalCoverImage:
    albumData.coverImage,
  coverImage: coverUrl
});
      setFolders(foldersWithImages);
    } catch (error) {
      console.error(
        "Failed to load album:",
        error
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteFolder = async (folder) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${folder.name}"?\n\nThis will permanently delete the collection, all its photos, and its files from storage.`
  );

  if (!confirmed) {
    return;
  }

  try {
    // Delete all collection files from R2
    const response = await fetch(
      `${API_URL}/api/delete-folder`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          albumId,
          folderId: folder.id
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Failed to delete collection files."
      );
    }

    // Delete Firestore documents
    await deleteFolder(
      albumId,
      folder.id
    );

    // Reload album
    await loadAlbum();

  } catch (error) {
    console.error(
      "Failed to delete collection:",
      error
    );

    window.alert(
      error.message ||
        "Failed to delete collection."
    );
  }
};

  useEffect(() => {
    loadAlbum();
  }, [albumId]);

  if (loading) {
    return (
      <main className="album-page">
        <h1>Loading Album...</h1>
      </main>
    );
  }

  if (!album) {
    return (
      <main className="album-page">
        <h1>Album Not Found</h1>

        <Link to="/gallery">
          Back to Gallery
        </Link>
      </main>
    );
  }

  return (
    <main className="album-page">
      <section className="album-header">
        <Link
          to="/gallery"
          className="back-link"
        >
          ← Back to Gallery
        </Link>

        <div className="album-title-row">
          <div>
            <p className="album-category">
              {album.category}
            </p>

            <h1>{album.title}</h1>

            <p className="album-date">
              {album.date}
            </p>
          </div>

          <div className="album-actions">
            {user && (
              <button
                className="add-folder-button"
                onClick={() =>
                  setShowAddFolder(true)
                }
              >
                + Add Collection
              </button>
            )}

            {user && (
  <button
    type="button"
    className="edit-album-button"
    onClick={() =>
      setShowEditAlbum(true)
    }
  >
    Edit Album
  </button>
)}

            <a
  href={`${API_URL}/api/download-album?albumId=${encodeURIComponent(
    albumId
  )}&albumName=${encodeURIComponent(
    album.title
  )}&folderNames=${encodeURIComponent(
    JSON.stringify(
      folders.reduce((map, folder) => {
        map[folder.id] = folder.name;
        return map;
      }, {})
    )
  )}`}
  className="download-button"
>
  ↓ Download Album
</a>
{user && (
  <button
    type="button"
    className="delete-album-button"
    onClick={handleDeleteAlbum}
  >
    Delete Album
  </button>
)}
          </div>
        </div>
      </section>

      <section className="folder-section">
        <div className="folder-heading">
          <h2>Collections</h2>

          <span>
            {folders.length} folders
          </span>
        </div>

        <div className="folder-grid">
          {folders.length > 0 ? (
            folders.map((folder) => (
              <div
                className="folder-card"
                key={folder.id}
              >
                <Link
                  to={`/album/${album.id}/folder/${folder.id}`}
                  className="folder-link"
                >
                  <div className="folder-image">
                    {folder.coverImage ? (
                      <img
                        src={folder.coverImage}
                        alt={folder.name}
                      />
                    ) : (
                      <div className="folder-placeholder">
                        No Cover
                      </div>
                    )}
                  </div>

                  <div className="folder-info">
                    <h3>{folder.name}</h3>

                    <p>
                      {folder.photoCount || 0} Photos
                    </p>
                  </div>
                </Link>

                <div className="folder-actions">

  {user && (
    <button
      type="button"
      className="edit-folder-button"
      onClick={() =>
        setEditingFolder(folder)
      }
    >
      Edit Collection
    </button>
  )}

 

  
</div>


                <a
  href={`${API_URL}/api/download-collection?albumId=${encodeURIComponent(
    albumId
  )}&folderId=${encodeURIComponent(
    folder.id
  )}&folderName=${encodeURIComponent(
    folder.name
  )}`}
  className="folder-download"
>
  ↓ Download Folder
</a>

                {user && (
  <button
    type="button"
    className="delete-folder-button"
    onClick={() =>
      handleDeleteFolder(folder)
    }
  >
    Delete Collection
  </button>
)}
              </div>
            ))
          ) : (
            <p className="no-results">
              No collections have been added to
              this album yet.
            </p>
          )}
        </div>
      </section>

      {showAddFolder && (
        <AddFolderModal
          albumId={albumId}
          onClose={() =>
            setShowAddFolder(false)
          }
          onFolderAdded={loadAlbum}
        />
      )}

      {editingFolder && (
  <EditFolderModal
    albumId={albumId}
    folder={editingFolder}
    onClose={() =>
      setEditingFolder(null)
    }
    onFolderUpdated={loadAlbum}
  />
)}
{showEditAlbum && (
  <EditAlbumModal
    album={album}
    onClose={() =>
      setShowEditAlbum(false)
    }
    onAlbumUpdated={loadAlbum}
  />
)}
    </main>
  );
}

export default Album;