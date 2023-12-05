const express = require('express');
const server = express();

server.get('/', (req, res) => {
	res.send('دالتون عبيط');
});

function keepAlive() {
	server.listen(8080, () => {
		console.log('Server is Ready!');
	});
}

module.exports = keepAlive;