const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const { PORT } = require("./utils/config");
const directory = path.join("/", "tmp", "files");
const filePath = path.join(directory, "ducks.txt");

app.use(express.json());

app.get("/", async (req, res) => {
  await findAFile();
  fs.readFile(filePath, "utf8", (err, imageUrl) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Could not get image from file.");
    }

    const todos = [
      { id: 1, text: "Clean house" },
      { id: 2, text: "Learn to code" },
    ];

    res.send(`
        <html>
          <body>
            <h1>Hello world</h1>
            <img src="${imageUrl}" alt="Random image of duck" />
            <form action="/submit" method="POST">
              <label for="inputField">Enter some text:</label>
              <input type="text" id="inputField" name="userInput" required>
              <button type="submit">Submit</button>
            </form>
            <ol>
            ${todos.map((t) => `<li>${t.text}</li>`)}
            </ol>
          </body>
        </html>
      `);
  });
});

const fileAlreadyExists = async () =>
  new Promise((res) => {
    fs.stat(filePath, (err, stats) => {
      if (err || !stats) return res(false);
      return res(true);
    });
  });

const findAFile = async () => {
  if (await fileAlreadyExists()) return;

  // Create directory if it doesn't exist
  await new Promise((res, rej) =>
    fs.mkdir(directory, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating directory:", err);
        return rej(err);
      }
      console.log("Directory created.");
      res();
    })
  );

  // Create the file
  await new Promise((res) =>
    fs.appendFile(filePath, "", (err) => {
      if (err) throw err;
      console.log("File created.");
      res();
    })
  );
};

const setImageEveryHour = async () => {
  const removeFile = async () =>
    new Promise((res) => fs.unlink(filePath, (err) => res()));
  await removeFile();
  await findAFile();
  const response = await axios.get("https://random-d.uk/api/v2/random");
  fs.appendFile(filePath, response.data.url, (err) => {
    if (err) throw err;
    console.log("New image set");
  });
};

setInterval(async () => {
  setImageEveryHour();
}, 360000);

const start = async () => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

start();
