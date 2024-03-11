export const createAttachmentUrl = (url, folderName) => {
    return `${folderName}/${url.split('%2F')[1].split('?')[0]}`;
};
