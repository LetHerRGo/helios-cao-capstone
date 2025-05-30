import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Track() {
  const navigate = useNavigate();
  const [ctnrNums, setCtnrNums] = useState();
  const [ctnrData, setCtnrData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/"); // if not login, direct to /
    }
  }, [navigate]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("isAuthenticated"); // clear login status
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = import.meta.env.VITE_APP_API_URL;
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
      <h1>🎉 欢迎来到主页！</h1>
      <button onClick={handleLogout}>退出登录</button>
      <form className="containerInput-form" onSubmit={handleSubmit}>
        <h2>Tracking containers</h2>
        {error && <p className="error">{error}</p>}
        <label>Container#:</label>
        <input
          type="text"
          value={ctnrNums}
          onChange={(e) => setCtnrNums(e.target.value)}
          placeholder="Container#"
        />
        <button type="submit">Submit</button>
      </form>
      <h2>Tracking Information</h2>
      <div>
        {ctnrData && ctnrData.length > 0 ? (
          ctnrData.map((item, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <div>
                <strong>Equipment ID:</strong> {item.id}
              </div>
              <div>
                <strong>Status:</strong> {item.status}
              </div>
              <div>
                <strong>Last Event:</strong> {item.eventDescription} (
                {item.eventTime})
              </div>
              <div>
                <strong>Location:</strong> {item.location}
              </div>
              <div>
                <strong>Customs Status:</strong> {item.customsStatus}
              </div>
              <div>
                <strong>ETA:</strong> {item.ETA}
              </div>
              <div>
                <strong>Last Free Storage Day:</strong>{" "}
                {item.storageLastFreeDay}
              </div>
            </div>
          ))
        ) : (
          <p>No tracking data available.</p>
        )}
      </div>
    </div>
  );
}

export default Track;
