import './file-upload.scss';

import { FC, useContext, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../services/store/AdminPage/store';
import {createNewGlassesInfo} from '../../utils/createNewGlassesInfo';
import {useNavigate} from 'react-router-dom';
import {uploadGlassesToStorage} from '../../api/firebase/storage/glasses';
import {addGlassesToList, editGlassesFromList} from '../../api/firebase/store/glasses';

export const FileUpload: FC = observer(() => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ multiple: false });
  const store = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    store.uploadFile(acceptedFiles[0]);

    if (store.acceptedFile) {
      store.glasses.temporary = createNewGlassesInfo(store.acceptedFile);
      navigate('../new');
    }
    console.log('new file name', store.acceptedFile?.name);
    console.log('new file info', store.glasses.temporary);
    console.log('new file', store.acceptedFile);
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
