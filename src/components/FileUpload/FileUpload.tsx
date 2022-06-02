import './file-upload.scss';

import { FC, useContext, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../services/store/AdminPage/store';
import {createNewGlassesInfo} from '../../utils/createNewGlassesInfo';
import {useNavigate} from 'react-router-dom';

export const FileUpload: FC = observer(() => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ multiple: false });
  const store = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    store.uploadFile(acceptedFiles[0]);

    if (store.acceptedFile) {
      store.glasses.temporary = createNewGlassesInfo(store.acceptedFile);
      // navigate();
    }
    console.log('new file name', store.acceptedFile?.name);
    console.log('new file info', store.glasses.temporary);
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
