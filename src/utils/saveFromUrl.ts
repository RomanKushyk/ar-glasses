type SaveFromUrl = (strData: string, fileName: string) => void;

export const saveFromUrl: SaveFromUrl = (strData, fileName) => {
  const link = document.createElement("a");

  document.body.appendChild(link);
  link.download = fileName;
  link.href = strData;
  link.click();
  document.body.removeChild(link);
};
