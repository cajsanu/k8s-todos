const express = require("express");
const app = express();

const { PORT } = require("./utils/config");

app.use(express.json());


const start = async () => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  };
  
  start();