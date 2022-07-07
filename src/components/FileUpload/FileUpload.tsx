import "./file-upload.scss";

import { FC, useContext, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { observer } from "mobx-react-lite";
import { StoreAdminContext } from "../../services/store/AdminPage/storeAdmin";
import { createNewGlassesInfo } from "../../utils/editGlasses/createNewGlassesInfo";
import { ErrorsDropdown } from "../ErrorsDropdown";

export const FileUpload: FC = observer(() => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    // multiple: false,
    // accept: {
    //   "application/octet-stream": [".fbx"],
    // },
  });
  const store = useContext(StoreAdminContext);

  useEffect(() => {
    store.getFilesFromUser(acceptedFiles);
    store.processUserFilesAndUploadToFirebase();
  }, [acceptedFiles]);

  return (
    <section className="file-upload add-new-glasses__file-upload">
      <div {...getRootProps({ className: "file-upload__area" })}>
        <input {...getInputProps()} />

        <p>Upload glasses</p>
      </div>

      <ErrorsDropdown errors={store.acceptedFilesErrors} />
    </section>
  );
});
