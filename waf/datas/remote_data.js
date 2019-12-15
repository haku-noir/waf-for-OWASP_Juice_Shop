const protocol = 'http';
const host = process.env.WEB_HOST;
const port = process.env.WEB_PORT;
const server = `${protocol}://${host}:${port}`;

module.exports = {
  protocol,
  host,
  port,
  server
};
