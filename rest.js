var http = require('http');
var mysql = require('mysql2');

var kapcsolat = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "feladat2"
});

kapcsolat.connect(function(err) {
    if (err) throw err;
    console.log("Kapcsolódva az adatbázishoz!");
});


http.createServer(function(req, res) {

    if (req.url == "/dolgozo" && req.method == "GET") {

        kapcsolat.query("SELECT * FROM dolgozok", function(err, result) {
            if (err) throw err;

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(result));
            res.end();
        });
    }

    if (req.url == "/dolgozo" && req.method == "POST") {

        var body = "";

        req.on("data", function(chunk) {
            body += chunk.toString();
        });

        req.on("end", function() {

            body = body.replaceAll("+", " ");
            var tomb = body.split("&");

            var nev = tomb[0].split("=")[1];
            var magassag = tomb[1].split("=")[1];
            var suly = tomb[2].split("=")[1];

            var sql = "INSERT INTO dolgozok (nev, magassag, suly) VALUES ('" +
                      nev + "'," + magassag + "," + suly + ")";

            kapcsolat.query(sql, function(err, result) {
                if (err) throw err;
            });

            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write("Sikeres felvétel");
            res.end();
        });
    }

    if (req.url.indexOf("/dolgozo/") == 0 && req.method == "PUT") {

        var id = req.url.split("/")[2];
        var body = "";

        req.on("data", function(chunk) {
            body += chunk.toString();
        });

        req.on("end", function() {

            body = body.replaceAll("+", " ");
            var tomb = body.split("&");

            var nev = tomb[0].split("=")[1];
            var magassag = tomb[1].split("=")[1];
            var suly = tomb[2].split("=")[1];

            var sql = "UPDATE dolgozok SET nev='" + nev +
                      "', magassag=" + magassag +
                      ", suly=" + suly +
                      " WHERE id=" + id;

            kapcsolat.query(sql, function(err, result) {
                if (err) throw err;
            });

            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write("Sikeres módosítás");
            res.end();
        });
    }

    if (req.url.indexOf("/dolgozo/") == 0 && req.method == "DELETE") {

        var id = req.url.split("/")[2];

        var sql = "DELETE FROM dolgozok WHERE id=" + id;

        kapcsolat.query(sql, function(err, result) {
            if (err) throw err;
        });

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write("Sikeres törlés");
        res.end();
    }

}).listen(5000);

console.log("REST szerver fut: http://localhost:5000");
