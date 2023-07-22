import io from "socket.io-client";

const SOCKET_URL = `${import.meta.env.VITE_SERVER_URL}:${
  import.meta.env.VITE_SERVER_PORT
}`;

// const SOCKET_URL = `http://10.9.9.217:2021`;

export const socket = io(SOCKET_URL);
