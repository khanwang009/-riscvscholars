import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Directory from "./pages/Directory";
import ProfileDetail from "./pages/ProfileDetail";
import Collaboration from "./pages/Collaboration";
import ClaimProfile from "./pages/ClaimProfile";
import SubmitRequest from "./pages/SubmitRequest";
import About from "./pages/About";
import ResearchLines from "./pages/ResearchLines";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="directory" element={<Directory />} />
          <Route path="directory/:id" element={<ProfileDetail />} />
          <Route path="research-lines" element={<ResearchLines />} />
          <Route path="collaboration" element={<Collaboration />} />
          <Route path="claim-profile" element={<ClaimProfile />} />
          <Route path="submit-request" element={<SubmitRequest />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
