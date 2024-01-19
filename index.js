var express = require('express');
var app = express();

var cors = require('cors');

var bodyParser = require('body-parser');

app.set('view engine', 'ejs');

var pdf = require("pdf-creator-node");
var fs = require("fs");
var path = require("path");

app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://localhost:3000")
});

const connection = require('./sql');

var options_portarit = {
    base: "http://localhost:3000",
    format: "A4",
    orientation: "portrait",
    border: "0mm",
};

var options_landscape = {
    base: "http://localhost:3000",
    format: "A4",
    orientation: "landscape",
    border: "0mm",
};

let pdfDocument = {
    html: '',
    data: {},
    // path: "./output.pdf",
    type: "buffer", // "stream" || "buffer" || "" ("" defaults to pdf)
};


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/generate_leaving_certificate', function (req, res) {
    var html = fs.readFileSync(path.join(__dirname, "views/leaving_certificate.ejs"), "utf8");
    let document = { ...pdfDocument };
    document.html = html;
    document.data = {
        users: [
            {
                name: "Shyam",
                age: "26",
            },
            {
                name: "Navjot",
                age: "26",
            },
            {
                name: "Vitthal",
                age: "26",
            },
        ]
    }
    pdf.create(document, options_portarit)
        .then((pdfResp) => {
            res.contentType("application/pdf");
            res.send(pdfResp);
        })
        .catch((error) => {
            res.send(error);
        });
});

app.get('/generate_domicile_certificate', function (req, res) {
    var html = fs.readFileSync(path.join(__dirname, "views/domicile.ejs"), "utf8");
    let document = { ...pdfDocument };
    document.html = html;
    document.data = {
        users: [
            {
                name: "Shyam",
                age: "26",
            },
            {
                name: "Navjot",
                age: "26",
            },
            {
                name: "Vitthal",
                age: "26",
            },
        ]
    }
    console.log(document.data);
    pdf.create(document, options_landscape)
        .then((pdfResp) => {
            res.contentType("application/pdf");
            res.send(pdfResp);
        })
        .catch((error) => {
            res.send(error);
        });
});

async function fetchData(query) {
    return new Promise((resolve, reject) => {
        console.log("query>>>",query)
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            }
            // Process the results here
            resolve(results);
            console.log("results>>>",results)
        });
    });
}

app.get('/generate_bonafide_certificate/:id', async function (req, res) {
    var html = fs.readFileSync(path.join(__dirname, "views/bonafide.html"), "utf8");
    let selectUser = `SELECT students.*,religions.religion_name AS religion,castes.caste_name AS caste FROM students INNER JOIN religions ON religions.id = students.religion INNER JOIN castes ON castes.id = students.caste WHERE (students.id = '${req.params.id}') limit 1`;
    let document = { ...pdfDocument };
    document.html = html;
    var result = await fetchData(selectUser)
    console.log("studentData>>>>", result);

    document.data = {
        "student" : result
    }

    console.log(document.data);

    pdf.create(document, options_portarit).then((pdfResp) => {
        res.contentType("application/pdf");
        res.send(pdfResp);
    })
        .catch((error) => {
            res.send(error);
        });
});

