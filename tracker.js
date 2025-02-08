import clipboardy from "clipboardy";
import { io } from "socket.io-client";

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

const socket = io(`http://192.168.0.158:3000`);

let lastClipboard = "";

async function checkClipboard() {
	try {
		const currentClipboard = clipboardy.readSync();

		if (currentClipboard && currentClipboard !== lastClipboard) {
			lastClipboard = currentClipboard;
			console.log("Clipboard changed:", currentClipboard);

			// Send clipboard data to the server
			socket.emit("clipboardData", { text: currentClipboard });
		}
	} catch (error) {
		console.error("Error reading clipboard:", error);
	}
}

// Run every second
setInterval(checkClipboard, 1000);
