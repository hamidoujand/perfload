import io from "socket.io-client";

let socket = io.connect("http://localhost:8000");

export default socket;
