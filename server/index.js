const http = require("http").Server();
require("dotenv").config({ path: __dirname + "/.env" });

// const { instrument } = require("@socket.io/admin-ui");

const io = require("socket.io")(http, {
	cors: {
		origin: [
			`http://${process.env.SERVER_IP}:3000`,
			"https://admin.socket.io",
			"http://localhost:3000",
			"http://127.0.0.1:3000",
		],
		credentials: true,
		methods: ["GET", "POST"],
	},
});
const logger = require("./src/utils/logger");
const socketService = require("./src/services/socket.service.js");

global.__io = io;

const port = process.env.PORT || 8080;
const DEFAULT_PORT = 3000;
const HOST = "localhost";

global.__io.on("connection", socketService.connection);

// instrument(io, {
//   auth: false,
// });

http.listen(port, () => {
	const { 2: mode } = process.argv;
	if (mode)
		config["is" + mode[0].toUpperCase() + mode.slice(1).toLowerCase()] = true;
	logger.appStarted(DEFAULT_PORT, HOST, port);
});
