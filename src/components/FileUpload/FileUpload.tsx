import './file-upload.scss';

import {ChangeEvent, useEffect, useState} from 'react';
import Dropzone, {useDropzone} from 'react-dropzone';
import {observer} from 'mobx-react-lite';
import store from '../../services/store/AdminPage/store';

export const FileUpload = observer(() => {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({multiple: false});

  useEffect(() => {
    store.uploadFile(acceptedFiles[0]);
    console.log(store.uploadedFile);
  }, [acceptedFiles]);

  const files = acceptedFiles.map(file => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  return (
    <section className="file-upload">
      <div {...getRootProps({className: 'file-upload__area'})}>
        <input {...getInputProps()} />
        <p>Upload glasses</p>
      </div>
    </section>
  );
});
