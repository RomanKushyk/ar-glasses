import './file-upload.scss';

import { FC, useContext, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { observer } from 'mobx-react-lite';
import { StoreContextAdmin } from '../../services/store/AdminPage/storeAdmin';
import { createNewGlassesInfo } from '../../utils/createNewGlassesInfo';

export const FileUpload: FC = observer(() => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'application/octet-stream' : ['.fbx'],
    }
  });
  const store = useContext(StoreContextAdmin);

  useEffect(() => {
    store.getFileFromUser(acceptedFiles[0]);

    if (store.acceptedFile) {
      store.glasses.temporary = createNewGlassesInfo(store.acceptedFile);
      store.uploadTemporaryToFirebase();
    }

  }, [acceptedFiles]);

  return (
    <section className="file-upload">
      <div {...getRootProps({className: 'file-upload__area'})}>
        <input {...getInputProps()} />

        <p>Upload glasses</p>
      </div>
    </section>
  );
});
