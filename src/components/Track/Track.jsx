import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Track.scss";
import Sidebar from "../Sidebar/Sidebar.jsx";
import { Box, Flex, Table } from "@chakra-ui/react";

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
    <Flex>
      <Sidebar />
      <Box ml="50px" p="6" w="full">
        <h1>🎉WELCOME TO THE FREIGHTAIO</h1>

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
        <Table.Root size="sm" striped>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader className="track-table__cell">
                Equipment ID
              </Table.ColumnHeader>
              <Table.ColumnHeader className="track-table__cell">
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader className="track-table__cell">
                Last Event
              </Table.ColumnHeader>
              <Table.ColumnHeader className="track-table__cell">
                Last Event Time
              </Table.ColumnHeader>
              <Table.ColumnHeader className="track-table__cell">
                Location
              </Table.ColumnHeader>
              <Table.ColumnHeader className="track-table__cell">
                Customs Status
              </Table.ColumnHeader>
              <Table.ColumnHeader className="track-table__cell">
                ETA
              </Table.ColumnHeader>
              <Table.ColumnHeader className="track-table__cell">
                Last Storage Day
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {ctnrData.map((item, index) => (
              <Table.Row key={index} className="track-table__row">
                <Table.Cell className="track-table__cell">{item.id}</Table.Cell>
                <Table.Cell className="track-table__cell">
                  {item.status}
                </Table.Cell>
                <Table.Cell className="track-table__cell">
                  {item.eventDescription}
                </Table.Cell>
                <Table.Cell className="track-table__cell">
                  {item.eventTime}
                </Table.Cell>
                <Table.Cell className="track-table__cell">
                  {item.location}
                </Table.Cell>
                <Table.Cell className="track-table__cell">
                  {item.customsStatus}
                </Table.Cell>
                <Table.Cell className="track-table__cell">
                  {item.ETA}
                </Table.Cell>
                <Table.Cell className="track-table__cell">
                  {item.storageLastFreeDay}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Flex>
  );
}

export default Track;
