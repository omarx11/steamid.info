const app = require("./app");

const port = process.env.PORT || 5000;

// start server listening
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
