const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const process = require('process')

// 获取服务端的工作目录，也就是代码运行的目录
const ROOT_DIR = process.cwd()

const server = http.createServer(async (req, resp) => {
    // console.log("req.url=" + req.url)
    var fileName = "." + req.url; 
    if(req.url == '/') {
        resp.writeHead(301, {'Location': './index.html'});
        resp.end();
        return;
    }
    if (fileName === "./stream") {
      handleStream(resp, req)
      return;
    }else if (fileName === "./beijing_stream") {
      handleBeijingStream(resp, req)
      return;
    }

  const parsedUrl = url.parse(req.url)
  // 删除开头的'/'来获取资源的相对路径，e.g: `/static`变为`static`
  const parsedPathname = parsedUrl.pathname.slice(1)
  // 获取资源在服务端的绝对路径
  const pathname = path.resolve(ROOT_DIR, parsedPathname)

  try {
    // 读取资源的信息, fs.Stats对象
    const stat = await fs.promises.stat(pathname)

    if (stat.isFile()) {
      // 如果请求的资源是文件就交给sendFile函数处理
      sendFile(resp, pathname)
    } else {
      // 如果请求的资源是文件夹就交给sendDirectory函数处理
      sendDirectory(resp, pathname)
    }
  } catch (error) {
    // 访问的资源不存在
    console.error("Err: " + error)
    if (error.code === 'ENOENT') {
      resp.statusCode = 404
      resp.end('file/directory does not exist')
    } else {
      resp.statusCode = 500
      resp.end('something wrong with the server')
    }
  }
})

const port = 8180;
server.listen(port, () => {
  console.log('server is up and running, listening port: ' + port)
})

const mimeTypes = {
  "application/javascript": ['js'], 
  "text/html": ['html', 'htm'],
  "text/css": ['css'],
  "application/json": ['json'],
}

const sendFile = async (resp, pathname) => {
    // 使用promise-style的readFile API异步读取文件的数据，然后返回给客户端
    const data = await fs.promises.readFile(pathname) 
 
    const suffix = pathname.split(".").pop();
    var contentType = ""
    for(var type in mimeTypes) {
      if(mimeTypes[type].indexOf(suffix) > -1) {
        contentType = type
      }
    }
    if(contentType) {
      resp.setHeader('Content-type', contentType) 
    }
    resp.end(data)
  }

  // const zlib = require('zlib')

  //   const sendFile = async (resp, pathname) => {
  //   // 通过header告诉客户端：服务端使用的是gzip压缩算法
  //   resp.setHeader('Content-Encoding', 'gzip')
  //   // 创建一个可读流
  //   const fileStream = fs.createReadStream(pathname)
  //   // 文件流首先通过zip处理再发送给resp对象
  //   fileStream.pipe(zlib.createGzip()).pipe(resp)
  //   }
  
  const sendDirectory = async (resp, pathname) => {
    // 使用promise-style的readdir API异步读取文件夹的目录信息，然后返回给客户端
    const fileList = await fs.promises.readdir(pathname, { withFileTypes: true })
    // 这里保存一下子资源相对于根目录的相对路径，用于后面客户端继续访问子资源
    const relativePath = path.relative(ROOT_DIR, pathname)
  
    // 构造返回的html结构体
    let content = '<ul>'
    fileList.forEach(file => {
      content += `
      <li>
        <a href=${
          relativePath
        }/${file.name}>${file.name}${file.isDirectory() ? '/' : ''}
        </a>
      </li>` 
    })
  
    content += '</ul>'
    // 返回当前的目录结构给客户端
    resp.end(`<h1>Content of ${relativePath || 'root directory'}:</h1>${content}`)
  }


  function handleStream(resp, req) {
    resp.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": '*',
    })
    resp.write("retry: 10000\n")
    resp.write("event: connecttime\n")
    resp.write("data: " + (new Date()) + "\n\n") 

    interval = setInterval(function () {
      resp.write("data: " + (new Date()) + "\n\n")
    }, 5000)

    req.connection.addListener("close", function () {
      clearInterval(interval)
    }, false)
  }


  const startDate = new Date(2000, 1, 1);  
  const fmtDate = (date) => {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份需要加 1，然后用 padStart 方法补零
    var day = date.getDate().toString().padStart(2, '0'); // 获取日期，然后用 padStart 方法补零
    
    // 格式化日期
    return year + '-' + month + '-' + day;
  }

  const nextDate= (date) => { 
     date.setDate(date.getDate() + 1);
     return date
  }


  function handleBeijingStream(resp, req) {
    resp.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": '*',
    })
    resp.write("retry: 10000\n")
    resp.write("event: connecttime\n")
    prepareData(resp)

    interval = setInterval(function () {
      prepareData(resp)
    }, 3000)

    req.connection.addListener("close", function () {
      clearInterval(interval)
    }, false)
  }


  function prepareData(resp) {
    resp.write("data: " + JSON.stringify([fmtDate(startDate), Math.floor(Math.random() * 600)]) + "\n\n")
    console.log("Current date - ", startDate)
    nextDate(startDate)
  }
