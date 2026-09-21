import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  increment,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase";

export async function getAlbums() {
  const snapshot = await getDocs(
    collection(db, "albums")
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function getAlbumById(albumId) {
  const albumRef = doc(db, "albums", albumId);

  const snapshot = await getDoc(albumRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  };
}

export async function addAlbum(albumData, user) {
  const docRef = await addDoc(
    collection(db, "albums"),
    {
      title: albumData.title,
      category: albumData.category,
      date: albumData.date,
      coverImage: albumData.coverImage,
      createdAt: serverTimestamp(),
      createdBy: user?.uid || ""
    }
  );

  return docRef.id;
}

export async function getFolders(albumId) {
  const foldersRef = collection(
    db,
    "albums",
    albumId,
    "folders"
  );

  const snapshot = await getDocs(foldersRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function addFolder(
  albumId,
  folderData,
  user
) {
  const foldersRef = collection(
    db,
    "albums",
    albumId,
    "folders"
  );

  const docRef = await addDoc(
    foldersRef,
    {
      name: folderData.name,
      coverImage: folderData.coverImage || "",
      photoCount: 0,
      createdAt: serverTimestamp(),
      createdBy: user?.uid || ""
    }
  );

  return docRef.id;
}

export async function getFolderById(
  albumId,
  folderId
) {
  const folderRef = doc(
    db,
    "albums",
    albumId,
    "folders",
    folderId
  );

  const snapshot = await getDoc(folderRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  };
}

export async function addPhoto(
  albumId,
  folderId,
  photoData,
  user
) {
  const photosRef = collection(
    db,
    "albums",
    albumId,
    "folders",
    folderId,
    "photos"
  );

  const docRef = await addDoc(
    photosRef,
    {
      name: photoData.name,
      image: photoData.image,
      size: photoData.size || 0,
      createdAt: serverTimestamp(),
      createdBy: user?.uid || ""
    }
  );

  const folderRef = doc(
    db,
    "albums",
    albumId,
    "folders",
    folderId
  );

  await updateDoc(folderRef, {
    photoCount: increment(1)
  });

  return docRef.id;
}

export async function getPhotos(
  albumId,
  folderId
) {
  const photosRef = collection(
    db,
    "albums",
    albumId,
    "folders",
    folderId,
    "photos"
  );

  const snapshot = await getDocs(
    photosRef
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function deletePhoto(
  albumId,
  folderId,
  photoId
) {
  const photoRef = doc(
    db,
    "albums",
    albumId,
    "folders",
    folderId,
    "photos",
    photoId
  );

  await deleteDoc(photoRef);

  const folderRef = doc(
    db,
    "albums",
    albumId,
    "folders",
    folderId
  );

  await updateDoc(folderRef, {
    photoCount: increment(-1)
  });
}

export async function updateFolder(
  albumId,
  folderId,
  folderData
) {
  const folderRef = doc(
    db,
    "albums",
    albumId,
    "folders",
    folderId
  );

  await updateDoc(folderRef, {
    name: folderData.name,
    coverImage: folderData.coverImage,
    updatedAt: serverTimestamp()
  });
}
export async function deleteFolder(
  albumId,
  folderId
) {
  const photosRef = collection(
    db,
    "albums",
    albumId,
    "folders",
    folderId,
    "photos"
  );

  const photosSnapshot =
    await getDocs(photosRef);

  for (const photoDoc of photosSnapshot.docs) {
    await deleteDoc(photoDoc.ref);
  }

  const folderRef = doc(
    db,
    "albums",
    albumId,
    "folders",
    folderId
  );

  await deleteDoc(folderRef);
}

export async function syncFolderPhotoCount(
  albumId,
  folderId
) {
  const photosRef = collection(
    db,
    "albums",
    albumId,
    "folders",
    folderId,
    "photos"
  );

  const snapshot = await getDocs(photosRef);

  const folderRef = doc(
    db,
    "albums",
    albumId,
    "folders",
    folderId
  );

  await updateDoc(folderRef, {
    photoCount: snapshot.size
  });

  return snapshot.size;
}

export async function updateAlbum(
  albumId,
  albumData
) {
  const albumRef = doc(
    db,
    "albums",
    albumId
  );

  await updateDoc(albumRef, {
    title: albumData.title,
    category: albumData.category,
    date: albumData.date,
    coverImage: albumData.coverImage,
    updatedAt: serverTimestamp()
  });
}

export async function deleteAlbum(
  albumId
) {
  const foldersRef = collection(
    db,
    "albums",
    albumId,
    "folders"
  );

  const foldersSnapshot =
    await getDocs(foldersRef);

  for (const folderDoc of foldersSnapshot.docs) {
    const photosRef = collection(
      db,
      "albums",
      albumId,
      "folders",
      folderDoc.id,
      "photos"
    );

    const photosSnapshot =
      await getDocs(photosRef);

    for (const photoDoc of photosSnapshot.docs) {
      await deleteDoc(photoDoc.ref);
    }

    await deleteDoc(folderDoc.ref);
  }

  const albumRef = doc(
    db,
    "albums",
    albumId
  );

  await deleteDoc(albumRef);
}