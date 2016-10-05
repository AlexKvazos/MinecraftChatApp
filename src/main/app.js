const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 });

  console.log(process.env.NODE_ENV);

  let url = process.env.NODE_ENV === 'production'
    ? `file://${__dirname}/../index.html`
    : `http://localhost:8080`;

  win.loadURL(url);

  win.on('closed', () => {
    win = null;
  });
}

/**
 * Application is ready to create windows
 */
app.on('ready', createWindow);

/**
 * Handle the event when the windows are closed and quit if we are not on osx
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
