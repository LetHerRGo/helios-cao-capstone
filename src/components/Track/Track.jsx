import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Track.scss";

function Track() {
  const navigate = useNavigate();
  const [ctnrNums, setCtnrNums] = useState("");
  const [ctnrData, setCtnrData] = useState([]);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/"); // if not login, direct to /
    }
  }, [navigate]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token"); // clear login status
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage");
    }

    try {
      const response = await axios.post(
        `${apiUrl}track`,
        { ctnrNums: ctnrNums },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCtnrData(response.data.equipmentList);
      setError("");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Request error:", error);
        setError("Failed to fetch tracking data.");
      }
    }
  };

  return (
    <div style={{ textAdivgn: "center", margin: "50px" }}>
      <h1>🎉WELCOME TO THE FREIGHTAIO</h1>
      <button onClick={handleLogout}>Log out</button>
      <form className="containerInput-form" onSubmit={handleSubmit}>
        <h2>Tracking containers</h2>
        {error && <p className="error">{error}</p>}
        <h2>Container#:</h2>
        <textarea
          rows={5}
          value={ctnrNums}
          onChange={(e) => setCtnrNums(e.target.value)}
          placeholder="Enter one or more container numbers (e.g. CNRU123456,CNRU234567)"
          style={{ width: "100%", resize: "vertical" }}
        />
        <button type="submit">Submit</button>
      </form>
      <h2 className="table-title">Tracking Information</h2>
      <table className="track-table">
        <thead className="track-table__header">
          <tr className="track-table__row">
            <th className="track-table__cell">Equipment ID</th>
            <th className="track-table__cell">Status</th>
            <th className="track-table__cell">Last Event</th>
            <th className="track-table__cell">Last Event Time</th>
            <th className="track-table__cell">Location</th>
            <th className="track-table__cell">Customs Status</th>
            <th className="track-table__cell">ETA</th>
            <th className="track-table__cell">Last Storage Day</th>
          </tr>
        </thead>
        <tbody>
          {ctnrData.map((item, index) => (
            <tr key={index} className="track-table__row">
              <td className="track-table__cell">{item.id}</td>
              <td className="track-table__cell">{item.status}</td>
              <td className="track-table__cell">{item.eventDescription}</td>
              <td className="track-table__cell">{item.eventTime}</td>
              <td className="track-table__cell">{item.location}</td>
              <td className="track-table__cell">{item.customsStatus}</td>
              <td className="track-table__cell">{item.ETA}</td>
              <td className="track-table__cell">{item.storageLastFreeDay}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Track;
