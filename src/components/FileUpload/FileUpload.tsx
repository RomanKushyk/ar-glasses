import "./file-upload.scss";

import { FC, useContext, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { observer } from "mobx-react-lite";
import { StoreAdminContext } from "../../services/store/AdminPage/storeAdmin";
import { createNewGlassesInfo } from "../../utils/editGlasses/createNewGlassesInfo";

export const FileUpload: FC = observer(() => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "application/octet-stream": [".fbx"],
    },
  });
  const store = useContext(StoreAdminContext);

  useEffect(() => {
    store.getFileFromUser(acceptedFiles[0]);

    if (store.acceptedFile) {
      store.glasses.temporary = createNewGlassesInfo(store.acceptedFile);
      store.uploadAllTemporaryDataToFirebase();
    }
  }, [acceptedFiles]);

  return (
    <section className="file-upload">
      <div {...getRootProps({ className: "file-upload__area" })}>
        <input {...getInputProps()} />

        <p>Upload glasses</p>
      </div>
    </section>
  );
});
