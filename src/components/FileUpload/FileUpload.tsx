import './file-upload.scss';

import {ChangeEvent, FC, useContext, useEffect, useState} from 'react';
import Dropzone, {useDropzone} from 'react-dropzone';
import {observer} from 'mobx-react-lite';
import {StoreContext} from '../../services/store/AdminPage/store';

export const FileUpload: FC = observer(() => {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({multiple: false});
  const store = useContext(StoreContext);

  useEffect(() => {
    store.uploadFile(acceptedFiles[0]);
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
