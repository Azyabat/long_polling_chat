import axios from "axios";

export const sendMessage = async (query) => {
  return await axios.post("http://localhost:5000/new-message", {
    message: query,
    id: Date.now(),
  });
};

export const executeCode = async () => {
  return await axios
    .post("http://localhost:5000/execute_code")
    .then((consoles) => {
      return consoles.data;
    });
};

export const getMessages = async () => {
  return await axios.get("http://localhost:5000/get-messages");
};
