const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var path = require("path");

const fetch = require("node-fetch");

const app = express();
const apiPort = 80;

app.use(express.static(path.join(__dirname, "build")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

//default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

//Get photos using ID route
app.get("/api/photos", async (req, res) => {
  try {
    var q = await getPhotos(req);
    res.status(200).json(q);
  } catch (e) {
    res.status(500).json([]);
  }
});

function getPhotos(req) {
  var id = req.query.id;
  return new Promise((resolve, reject) => {
    fetch("https://jsonplaceholder.typicode.com/albums/" + id + "/photos")
      .then((res) => res.json())
      .then(
        (result) => {

          var list=[]
          result.forEach((element)=>{
            list.push({
              title:element.title,
              thumbnailUrl:element.thumbnailUrl,
              id:element.id
            })
          })
          resolve(list);
        },
        (error) => {
          reject(error);
        }
      );
  });
}

//Handle browser paths
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

/////////////

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
