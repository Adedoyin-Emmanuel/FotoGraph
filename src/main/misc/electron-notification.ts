import { Notification } from 'electron';
const path = require('path');
import { ipcMain, dialog, shell } from 'electron';

interface notificationProps {
  title: string;
  text: string;
  type: string;

}
const appIcon = path.resolve(__dirname, './../../../assets/icon.png');

ipcMain.on('show-notification', (event, message: notificationProps) => {
  const { title, text } = message;

  const notification = new Notification({
    title: title,
    body: text,
    silent: false,
    icon:appIcon
  });

  notification.show();
});

ipcMain.on('show-dialog', (event, messageArgs: any) => {
  const filePath = messageArgs;
  dialog
    .showMessageBox({
      type: 'info',
      message: 'Image Converted Successfully',
      detail: `The converted image was saved in: ${filePath}`,
      buttons: ['Open Folder', 'Close'],
      defaultId: 0,
    })
    .then((response) => {
      if (response.response === 0) {
        shell.showItemInFolder(filePath);
      }
    });
});
