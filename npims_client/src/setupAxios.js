import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
console.log("Axios baseURL is set to:", axios.defaults.baseURL);

export default axios;