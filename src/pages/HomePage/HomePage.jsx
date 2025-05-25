import { useEffect, useState } from "react";
import { tracking } from "../../../config/tracking";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [ctnrNums, setctnrNums] = useState();
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
    try {
      const data = await tracking(ctnrNums);
      const equipment = data.ThirdPartyIntermodalShipment.Equipment[0];

      const extractedData = {
        id: equipment.EquipmentId || "N/A",
        status: equipment.WaybillStatus || "N/A",
        location: equipment.Event?.Location?.Station || "Unknown",
        eventTime: equipment.Event?.Time || "N/A",
        eventDescription: equipment.Event?.Description || "N/A",
        ETA: equipment.ETA?.Time || "N/A",
        customsStatus: equipment.CustomsHold?.Description || "N/A",
        storageLastFreeDay: equipment.StorageCharge?.LastFreeDay || "N/A",
      };
      setCtnrData(extractedData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🎉 欢迎来到主页！</h1>
      <button onClick={handleLogout}>退出登录</button>
      <form className="containerInput-form" onSubmit={handleSubmit}>
        <h2>Tracking containers</h2>
        {error && <p className="error">{error}</p>}
        <label>Container#:</label>
        <input
          type="text"
          value={ctnrNums}
          onChange={(e) => setctnrNums(e.target.value)}
          placeholder="Container#"
        />
        <button type="submit">Submit</button>
      </form>
      <h2>Tracking Information</h2>
      <ul>
        {ctnrData ? (
          <ul>
            <li>
              <strong>Equipment ID:</strong> {ctnrData.id}
            </li>
            <li>
              <strong>Status:</strong> {ctnrData.status}
            </li>
            <li>
              <strong>Last Event:</strong> {ctnrData.eventDescription} (
              {ctnrData.eventTime})
            </li>
            <li>
              <strong>Location:</strong> {ctnrData.location}
            </li>
            <li>
              <strong>Customs Status:</strong> {ctnrData.customsStatus}
            </li>
            <li>
              <strong>ETA:</strong> {ctnrData.ETA}
            </li>
            <li>
              <strong>Last Free Storage Day:</strong>{" "}
              {ctnrData.storageLastFreeDay}
            </li>
          </ul>
        ) : (
          <p>No tracking data available.</p>
        )}
      </ul>
    </div>
  );
}

export default HomePage;
