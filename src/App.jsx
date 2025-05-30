import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import Track from "./components/Track/Track.jsx";
import AddShipment from "./components/AddShipment/AddShipment.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/track" element={<Track />} />
        <Route path="/addshipment" element={<AddShipment />} />
      </Routes>
    </Router>
  );
}

export default App;
