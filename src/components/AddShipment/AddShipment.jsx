import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddShipment() {
  const [ctnrNum, setCtnrNum] = useState("");
  const [agentName, setAgentName] = useState("");
  const [clientName, setClientName] = useState("");
  const [refNum, setRefNum] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [agents, setAgents] = useState([]);
  const [clients, setClients] = useState([]);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/"); // if not login, direct to /
    }

    const fetchAgents = async () => {
      try {
        const response = await axios.get(`${apiUrl}agents`);
        setAgents(response.data); // Assuming response is an array of agent names
      } catch (error) {
        console.error("Error fetching agent names:", error);
        setError("Failed to fetch agent names.");
      }
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get(`${apiUrl}clients`);
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching client names:", error);
        setError("Failed to fetch client names.");
      }
    };

    fetchClients();
    fetchAgents();
  }, [navigate]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("isAuthenticated"); // clear login status
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const containerFormat = /^[A-Z]{4}\d{7}$/;
    if (!containerFormat.test(ctnrNum)) {
      setError(
        "Invalid container number. Format must be 4 letters followed by 7 digits (e.g., ZCSU4028251)."
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage");
      return;
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
      setSuccess(`Container '${ctnrNum}' added successfully.`);
      setError("");
      setCtnrNum("");
      setAgentName("");
      setClientName("");
      setRefNum("");
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
        {success && <p className="success">{success}</p>}
        <label>Reference#:</label>
        <input
          type="text"
          value={refNum}
          onChange={(e) => setRefNum(e.target.value)}
          placeholder="Reference#"
        />
        <label>Container#:</label>
        <input
          type="text"
          value={ctnrNum}
          onChange={(e) => setCtnrNum(e.target.value)}
          placeholder="Container#"
        />
        <label>Agent Name:</label>
        <select
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
        >
          <option value="">Select an agent</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.name}>
              {agent.name}
            </option>
          ))}
        </select>
        <label>Client Name:</label>
        <select
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        >
          <option value="">Select an client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.name}>
              {client.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Container</button>
      </form>

      <div></div>
    </div>
  );
}

export default AddShipment;
