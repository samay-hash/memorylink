const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let serverProcess;

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = http.createServer();
    srv.listen(0, () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error(`Status: ${res.statusCode}`));
        });
        req.on('error', reject);
      });
      return true;
    } catch (err) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return false;
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#FDFDFC',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  try {
    const port = await getFreePort();
    console.log(`Starting Next.js server on port ${port}...`);

    const serverPath = app.isPackaged 
      ? path.join(process.resourcesPath, 'app.asar.unpacked', '.next', 'standalone', 'server.js')
      : path.join(__dirname, '..', '.next', 'standalone', 'server.js');

    serverProcess = spawn('node', [serverPath], {
      env: {
        ...process.env,
        PORT: port,
        NODE_ENV: 'production'
      },
      cwd: app.isPackaged ? path.dirname(serverPath) : path.join(__dirname, '..', '.next', 'standalone')
    });

    serverProcess.stdout.on('data', (data) => console.log(`[Next.js]: ${data}`));
    serverProcess.stderr.on('data', (data) => console.error(`[Next.js Error]: ${data}`));

    const url = `http://localhost:${port}`;
    
    // Fallback loading text
    mainWindow.loadURL(`data:text/html;charset=utf-8,<html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:%23FDFDFC;"><h3>Booting MemoryLink Server...</h3></body></html>`);
    
    const isReady = await waitForServer(url);
    if (isReady) {
      mainWindow.loadURL(url);
    } else {
      dialog.showErrorBox('Timeout', 'The internal server took too long to start.');
      app.quit();
    }
  } catch (error) {
    dialog.showErrorBox('Startup Error', `Failed to start server: ${error.message}`);
    app.quit();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  if (serverProcess) {
    serverProcess.kill();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
