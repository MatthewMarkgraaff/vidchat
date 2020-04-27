import axios from "axios";

export const fetchTurnServerConfig = async () => {
  const response = await axios.get('/turn-server-config');

  if(response.status == 200) {
    return response.data;
  } else {
    throw new Error("Could not fetch turn server configuration");
  }
}
