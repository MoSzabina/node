var http = require('http');
var fs = require('fs');
var mysql = require('mysql2');

var kapcsolat = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "feladat1"
});

kapcsolat.connect(function(err) {
    if (err) throw err;
    console.log("Kapcsolódva az adatbázishoz!");
});

http.createServer(function(req, res) {

    if (req.url == "/oldal1" && req.method == "GET") {
        fs.readFile("oldal1.html", function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    }

    if (req.url == "/oldal2" && req.method == "POST") {

        var body = "";

        req.on("data", function(chunk) {
            body += chunk.toString();
        });

        req.on("end", function() {


            body = body.replaceAll("+", " ");
            var tomb = body.split("&");

            var nev = tomb[0].split("=")[1];
            var cim = tomb[1].split("=")[1];
            var kor = parseInt(tomb[2].split("=")[1]);

            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write("Név: " + nev + "<br>");
            res.write("Cím: " + cim + "<br>");
            res.write("Életkor: " + kor + "<br>");

            if (kor < 18) {
                res.write("kiskorú");
            } else {
                res.write("nagykorú");
            }

            var sql = "INSERT INTO ment (nev, cim, kor) VALUES ('" +
                      nev + "','" + cim + "'," + kor + ")";

            kapcsolat.query(sql, function(err, result) {
                if (err) throw err;
            });

            res.end();
        });
    }

}).listen(4000);

console.log("Szerver fut: http://localhost:4000/oldal1");
