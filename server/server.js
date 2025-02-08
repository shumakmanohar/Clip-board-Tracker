import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

// Get the machine's local IP dynamically
function getLocalIP() {
	const interfaces = os.networkInterfaces();
	for (const interfaceName in interfaces) {
		for (const iface of interfaces[interfaceName]) {
			if (iface.family === "IPv4" && !iface.internal) {
				return iface.address;
			}
		}
	}
	return "127.0.0.1"; // Fallback to localhost if no IP found
}

const localIP = getLocalIP();

io.on("connection", (socket) => {
	console.log("Client connected");

	socket.on("clipboardData", (data) => {
		console.log("Received clipboard data:", data.text);
		io.emit("updateClipboard", data.text);
	});

	socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(3000, localIP, () => {
	console.log(`Server running at http://${localIP}:3000`);
});
