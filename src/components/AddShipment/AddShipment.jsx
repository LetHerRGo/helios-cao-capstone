import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddShipment() {
  const navigate = useNavigate();
  const [ctnrNum, setCtnrNum] = useState();
  const [agentName, setAgentName] = useState();
  const [clientName, setClientName] = useState();
  const [refNum, setRefNum] = useState();

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
        `${apiUrl}addshipment`,
        {
          ctnrNum: ctnrNum,
          agentName: agentName,
          clientName: clientName,
          refNum: refNum,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
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
        <h2>Adding containers</h2>
        {error && <p className="error">{error}</p>}
        <label>Reference#:</label>
        <input
          type="text"
          value={refNum}
          onChange={(e) => setRefNum(e.target.value)}
          placeholder="Reference#"
        />
        <label>Agent Name:</label>
        <label>Container#:</label>
        <input
          type="text"
          value={ctnrNum}
          onChange={(e) => setCtnrNum(e.target.value)}
          placeholder="Container#"
        />
        <label>Agent Name:</label>
        <input
          type="text"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          placeholder="Agent Name"
        />
        <label>Client Name:</label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Client Name"
        />
        <button type="submit">Add Container</button>
      </form>

      <div></div>
    </div>
  );
}

export default AddShipment;
