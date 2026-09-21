import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Gallery from "./pages/Gallery";
import Album from "./pages/Album";
import Folder from "./pages/Folder";
import TestFirestore from "./pages/TestFirestore";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/login" element={<Login />} />
  <Route path="/gallery" element={<Gallery />} />

<Route
  path="/test-firestore"
  element={<TestFirestore />}
/>
  <Route
    path="/album/:albumId"
    element={<Album />}
  />

  <Route
    path="/album/:albumId/folder/:folderId"
    element={<Folder />}
  />
</Routes>
    </BrowserRouter>
  );
}

export default App;