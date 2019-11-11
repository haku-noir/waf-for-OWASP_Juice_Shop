protocol = 'http';
host = process.env.WEB_HOST;
port = process.env.WEB_PORT;
server = `${protocol}://${host}:${port}`;

module.exports = {
  protocol,
  host,
  port,
  server
};
