import { Link } from "react-router-dom";

function AlbumCard({ album }) {
  return (
    <Link to={`/album/${album.id}`} className="album-card">

      <div className="album-image">
        <img src={album.coverImage} alt={album.title} />
      </div>

      <div className="album-info">
        <h3>{album.title}</h3>

        <p>{album.category}</p>

        <span>{album.date}</span>
      </div>

    </Link>
  );
}

export default AlbumCard;