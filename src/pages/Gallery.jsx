import { useEffect, useState } from "react";

import AlbumCard from "../components/AlbumCard";
import AddAlbumModal from "../components/AddAlbumModal";

import { getAlbums } from "../services/firestoreService";
import { getImageUrl } from "../services/r2Service";
import { useAuth } from "../context/AuthContext";

import "./Gallery.css";

function Gallery() {
  const { user } = useAuth();

  const [albums, setAlbums] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [searchTerm, setSearchTerm] =
    useState("");
  const [showAddAlbum, setShowAddAlbum] =
    useState(false);
  const [loading, setLoading] =
    useState(true);

  const categories = [
    "All",
    "Wedding",
    "Graduation",
    "Parties",
    "Other"
  ];

  const loadAlbums = async () => {
    try {
      setLoading(true);

      const data = await getAlbums();

      const albumsWithImages = await Promise.all(
  data.map(async (album) => {
    try {
      const imageUrl = await getImageUrl(
        album.coverImage
      );

      return {
        ...album,
        originalCoverImage: album.coverImage,
        coverImage: imageUrl
      };
    } catch (error) {
      console.error(
        `Failed to load cover for ${album.title}:`,
        error
      );

      return {
        ...album,
        originalCoverImage: album.coverImage,
        coverImage: ""
      };
    }
  })
);

      setAlbums(albumsWithImages);
    } catch (error) {
      console.error(
        "Failed to load albums:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  const filteredAlbums = albums.filter((album) => {
    const matchesCategory =
      selectedCategory === "All" ||
      album.category === selectedCategory;

    const matchesSearch = album.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="gallery-page">

      <section className="gallery-header">

        <p>VPRO COLLECTION</p>

        <h1>Photography Gallery</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search albums by name..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        {user && (
          <button
            className="add-album-button"
            onClick={() =>
              setShowAddAlbum(true)
            }
          >
            + Add Album
          </button>
        )}

      </section>

      <section className="category-filter">

        {categories.map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category
                ? "active"
                : ""
            }
            onClick={() =>
              setSelectedCategory(category)
            }
          >
            {category}
          </button>
        ))}

      </section>

      {loading ? (
        <p className="no-results">
          Loading albums...
        </p>
      ) : (
        <section className="album-grid">

          {filteredAlbums.length > 0 ? (
            filteredAlbums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
              />
            ))
          ) : (
            <p className="no-results">
              No albums found.
            </p>
          )}

        </section>
      )}

      {showAddAlbum && (
        <AddAlbumModal
          onClose={() =>
            setShowAddAlbum(false)
          }
          onAlbumAdded={loadAlbums}
        />
      )}

    </main>
  );
}

export default Gallery;