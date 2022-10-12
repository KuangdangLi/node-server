import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import * as fs from 'fs';
import * as p from 'path';
import * as url from 'url';

const server = http.createServer();
const publicDir = p.resolve(__dirname, 'public');

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const {method, url: path, headers} = request;
  if(method!=='Get'){
    response.statusCode = 405;
    response.end();
    return
  }
  let {pathname} = url.parse(path as string);
  if (pathname === '' || pathname === '/') {
    pathname = '/index.html';
  }
  const filename = pathname!.substring(1);
  fs.readFile(p.resolve(publicDir, filename), (error, data) => {
    if (error) {
      if (error.errno === -4058) {
        response.statusCode = 404;
        fs.readFile(p.resolve(publicDir,'404.html'),(error,data)=>{
          response.end(data)
        })
      } else {
        response.statusCode = 500;
        response.end('服务器繁忙')
      }
    } else {
      response.end(data);
    }
  });
});

server.listen(8889);



