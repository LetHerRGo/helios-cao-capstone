import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar/Sidebar.jsx";
import {
  Box,
  Flex,
  Heading,
  Highlight,
  Alert,
  CloseButton,
  Field,
  NativeSelect,
  Button,
  Input,
} from "@chakra-ui/react";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validating container number format to ABCD1234567
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
      setSuccess(response.data?.message || "Container added successfully.");
      setError("");
      setCtnrNum("");
      setRefNum("");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        navigate("/login");
      }
      console.error("Request error:", error);
      console.log("Form data:", { ctnrNum, agentName, clientName, refNum });

      if (error.response?.data?.message) {
        setError(error.response.data.message); // show backend error message
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <Box ml="50px" p="6" w="auto">
      <Flex direction="column" justify="center" gap="5">
        <Heading size="6xl" letterSpacing="tight" textAlign="center">
          <Highlight query="FREIGHTAIO" styles={{ color: "#79a5b2" }}>
            WELCOME TO THE FREIGHTAIO
          </Highlight>
        </Heading>

        <form className="containerInput-form" onSubmit={handleSubmit}>
          {error && (
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Error!</Alert.Title>
                <Alert.Description>{error}</Alert.Description>
              </Alert.Content>
              <CloseButton
                pos="relative"
                top="-2"
                insetEnd="-2"
                variant="ghost"
                onClick={() => setError("")}
              />
            </Alert.Root>
          )}
          {success && (
            <Alert.Root status="success">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Success!</Alert.Title>
                <Alert.Description>{success}</Alert.Description>
              </Alert.Content>
              <CloseButton
                pos="relative"
                top="-2"
                insetEnd="-2"
                variant="ghost"
                onClick={() => setSuccess("")}
              />
            </Alert.Root>
          )}
          <Field.Root>
            <Field.Label>
              Reference#:
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder="Input ref#"
              type="text"
              value={refNum}
              onChange={(e) => setRefNum(e.target.value)}
            />
          </Field.Root>
          {/* <label>Reference#:</label>
          <input
            type="text"
            value={refNum}
            onChange={(e) => setRefNum(e.target.value)}
            placeholder="Reference#"
          /> */}

          <Field.Root>
            <Field.Label>
              Container#:
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="text"
              value={ctnrNum}
              onChange={(e) => setCtnrNum(e.target.value)}
              placeholder="Container#"
            />
          </Field.Root>

          {/* <label>Container#:</label>
          <input
            type="text"
            value={ctnrNum}
            onChange={(e) => setCtnrNum(e.target.value)}
            placeholder="Container#"
          /> */}

          <Field.Root>
            <Field.Label>Agent Name:</Field.Label>
            <NativeSelect.Root
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
            >
              <NativeSelect.Field>
                <option value="">Select an agent</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.name}>
                    {agent.name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          {/* <label>Agent Name:</label>
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
          </select> */}

          <Field.Root>
            <Field.Label>Client Name:</Field.Label>
            <NativeSelect.Root
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            >
              <NativeSelect.Field>
                <option value="">Select an client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          {/* <label>Client Name:</label>
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
          </select> */}
          <Flex justify="flex-end" mt="4">
            <Button
              type="submit"
              color="#275765"
              backgroundColor="#d8ecee"
              variant="solid"
            >
              Add Shipment
            </Button>
          </Flex>
        </form>
      </Flex>
    </Box>
  );
}

export default AddShipment;
