const http = require("http");
const fs = require("fs")
const path = require("path")
const httpServer = http.createServer();
httpServer.on("listening", () => console.log("Listening..."));
httpServer.on("request", (req, res) => {

  if (req.url === "/") {
    res.end(fs.readFileSync("public/index.html"));
    return;
  }
  if (req.url === "/app.js") {
    res.end(fs.readFileSync("public/app.js"));
    return;
  }
  
  if (req.url === "/upload") {
    const fileName = 'uploads/' + req.headers["file-name"];
    req.on("data", chunk => {
      fs.appendFileSync(fileName, chunk)
      res.statusCode = 201;

      // res.setHeader('Content-Type', 'application/json');

      const jsonResponse = JSON.stringify({ response: 'ok' });
      res.end(jsonResponse);
      // console.log(`received chunk! ${chunk.length}`)
    })
  }


})

httpServer.listen(80, function () {
  const folderPath = __dirname + '/uploads';
  deleteFilesInFolder(folderPath);
  console.log('listening')
})

function deleteFilesInFolder(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(folderPath, file);

      fs.unlink(filePath, err => {
        if (err) {
          console.error('Error deleting file:', filePath, err);
          return;
        }

        console.log('Deleted file:', filePath);
      });
    });
  });
}
