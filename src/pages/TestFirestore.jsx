import { useEffect } from "react";
import { getAlbums } from "../services/firestoreService";

function TestFirestore() {
  useEffect(() => {
    async function loadAlbums() {
      const albums = await getAlbums();

      console.log("Albums:", albums);
    }

    loadAlbums();
  }, []);

  return (
    <h1>Firestore Test</h1>
  );
}

export default TestFirestore;