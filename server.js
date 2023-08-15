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
  if (req.url === "/uploads.js") {
    res.end(fs.readFileSync("public/uploads.js"));
    return;
  }

  if (req.url === "/getfiles" && req.method === 'GET') {
    // const { pathname, query } = new URL(req.url, `http://${req.headers.host}`);
    res.send(req.headers.host);
    console.log(req.headers.host)
    return;
  }

  if (req.url === "/upload") {
    console.log('pinged')
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



  // const url = req.url;
  // const filename = url.substring(1); // Remove the leading slash

  // // Create the file path
  // const filePath = path.join(__dirname, 'uploads', filename);

  // // Check if the file exists
  // fs.access(filePath, fs.constants.F_OK, (err) => {
  //   if (err) {
  //     res.writeHead(404, { 'Content-Type': 'text/plain' });
  //     res.end('File Not Found');
  //     // return
  //   } else {
  //     // Read the file and send it as the response
  //     fs.readFile(filePath, (err, data) => {
  //       if (err) {
  //         res.writeHead(500, { 'Content-Type': 'text/plain' });
  //         res.end('Internal Server Error');
  //         // return
  //       } else {
  //         res.writeHead(200, { 'Content-Type': getContentType(filePath) });
  //         res.end(data);
  //         // return
  //       }
  //     });
  //   }
  // });


})
function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    case '.png':
      return 'image/png';
    case '.jpg':
      return 'image/jpeg';
    default:
      return 'application/octet-stream';
  }
}
httpServer.listen(80, function () {
  const folderPath = __dirname + '/uploads';
  readFilesInFolder(folderPath);
  console.log('listening')
})

// function readFilesInFolder(folderPath) {
//   fs.readdir(__dirname + "/uploads", (err, files) => {
//     if (err)
//       console.log(err);
//     else {
//       console.log("\nCurrent directory filenames:");
//       files.forEach(file => {
//         console.log(file);
//       })
//     }
//   })
// }
