import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "../../assets/icon/delete_24dp.svg?react";

function Track() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [ctnrData, setCtnrData] = useState([]);

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }

      const isAuthenticated = localStorage.getItem("isAuthenticated");
      if (!isAuthenticated) {
        navigate("/"); // if not logged in, redirect to login
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}trace`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }, // optional: if your backend requires auth
        });
        setCtnrData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token"); // clear login status
    navigate("/");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}trace/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter out the deleted row from state
      setCtnrData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      setError("Failed to delete container.");
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "50px" }}>
      <h1>🎉WELCOME TO THE FREIGHTAIO</h1>
      <button onClick={handleLogout}>Log out</button>
      {error && <p className="error">{error}</p>}

      <h2 className="table-title">Tracking Information</h2>

      <div className="tracking-table">
        <table>
          <thead>
            <tr>
              <th>Container No</th>
              <th>Ref#</th>
              <th>Agent</th>
              <th>Client</th>
              <th>Status</th>

              <th>Event</th>
              <th>Last Event Time</th>
              <th>Location</th>
              <th>Customs Status</th>
              <th>ETA</th>
              <th>Last Free Day</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ctnrData?.map((item) => (
              <tr key={item.id}>
                <td>{item.container_number}</td>
                <td>{item.forwarder_ref}</td>
                <td>{item.agent_name}</td>
                <td>{item.client_name}</td>
                <td>{item.status}</td>
                <td>{item.event_description}</td>
                <td>{new Date(item.event_time).toLocaleString()}</td>
                <td>{item.location}</td>
                <td>{item.customs_status}</td>
                <td>
                  {item.ETA ? new Date(item.ETA).toLocaleDateString() : "N/A"}
                </td>
                <td>
                  {item.storage_last_free_day
                    ? new Date(item.storage_last_free_day).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="delete-btn"
                    title="Delete"
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Track;
