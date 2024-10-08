const express = require("express");
const app = express();

const { PORT } = require("./utils/config");

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

const start = async () => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  };
  
  start();