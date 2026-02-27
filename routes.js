const fs = require('fs');
const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if(req.url === '/'){
        fs.readFile('formvalues.txt', 'utf8', (err, data) => {
            const messages = data ? data.split('\n').map(msg => `<p>${msg}</p>`).join('') : '';
            res.setHeader('Content-Type', 'text/html');
            res.end(`
                <div>
                 ${messages}
                </div>

                <form action="/message" method="POST">
                <label>Name:</label>
                <input type="text" name="Username">
                <button type="submit">Add</button>
                </form>
          `);
        });
    }else if(req.url === '/message'){
        res.setHeader('Content-Type', 'text/html');
        let datachunks = [];

        req.on('data', (chunk) => {
            datachunks.push(chunk);
        });
        req.on('end', () => {
            const parsedData = Buffer.concat(datachunks).toString();
            console.log(parsedData);
            const message = parsedData.split('=')[1];
            fs.writeFile('formvalues.txt',message, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });    
    }else{
        if(req.url ==='/read'){
            fs.readFile('formvalues.txt', (err, data) => {
                console.log(data.toString());
                res.end(`<h1>${data.toString()}</h1>`);
            });
        }
    }
}
const anthonerfunction = () => {
    console.log('This is another function');
}


exports.handler = requestHandler;
exports.testfunction = anthonerfunction;