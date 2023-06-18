const fs = require("fs");
const http = require("http");
const { URL } = require("url");
const slugify = require("slugify");
const replaceHTML = require("./modules/ReplaceTemplate");

// blocking code
// const incomingText = fs.readFileSync("./txt/input.txt", "utf-8");

// console.log(incomingText);

// const outgoingText = `The information we got is as follows ${incomingText} \n Created on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", outgoingText);

// console.log("File Written");

//async code

// const incomingText = "Hi";

// fs.writeFile("./txt/async.txt", incomingText, (err, data) => {
//   console.log("data written");
// });
// console.log("reading");

// fs.readFile("./txt/start.txt", "utf8", (err, data) => {
//   console.log(err, "from1");
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data1) => {
//     console.log(err, "from2");
//     fs.readFile("./txt/append.txt", "utf-8", (err, data2) => {
//       fs.writeFile("./txt/newfinal", data1 + data2, (err, data3) => {
//         console.log("final written");
//       });
//     });
//   });
// });

const dataone = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const overviewTemplate = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const cardTemplate = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const productTemplate = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const finalData = JSON.parse(dataone);

// res.end(JSON.stringify(finalData));

const sluggedProductNames = finalData.map((each) =>
  slugify(each.productName, { lower: true })
);

console.log(sluggedProductNames);

http
  .createServer((req, res) => {
    const { url } = req;
    const { pathname, search } = new URL(url, `http://${req.headers.host}`);

    // Overview Page
    if (pathname === "/" || pathname === "/overview") {
      const tempHtml = finalData
        .map((each) => replaceHTML(cardTemplate, each))
        .join("");

      const outputHTML = overviewTemplate.replace(
        /{%PRODUCTCARDS%}/g,
        tempHtml
      );

      res.writeHead(200, { "Content-type": "text/html" });
      return res.end(outputHTML);
    }

    // Products Page
    if (pathname === "/product") {
      const productId = search.split("?")[1].split("=")[1];
      // console.log(productId);
      const productDetail = finalData[productId];
      const productHtml = replaceHTML(productTemplate, productDetail);
      res.writeHead(200, { "Content-type": "text/html" });
      return res.end(productHtml);
    }

    if (pathname === "/api") {
      res.writeHead(200, {
        "Content-type": "application/json",
      });
      return res.end(dataone);
    } else {
      res.writeHead(404, {
        "Content-type": "text/html",
      });
      res.end("<h1>Page Not Found</h1>");
      return;
    }
  })
  .listen(3000, () => console.log("listening"));
