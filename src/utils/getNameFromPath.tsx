export const getNameFromPath = (file_path: string) => {
  return file_path.slice(file_path.lastIndexOf("/") + 1);
};
