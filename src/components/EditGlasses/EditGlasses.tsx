import './edit-glasses.scss';

import {FC, useContext} from 'react';
import App from '../../App';
import {downloadGlassesFromStorage, uploadGlassesToStorage} from '../../api/firebase/storage/glasses';
import {StoreContext} from '../../services/store/AdminPage/store';
import {createNewGlassesInfo} from '../../utils/createNewGlassesInfo';
import {addGlassesToList, editGlassesFromList} from '../../api/firebase/store/glasses';

export const EditGlasses: FC = () => {
  const store = useContext(StoreContext);

  const uploadGlassesToFirebase = () => {
    let glassesId: string | undefined;
    console.log('start');
    console.log(store.acceptedFile);

    if (store.acceptedFile) {
      store.glasses.temporary = createNewGlassesInfo(store.acceptedFile);
      addGlassesToList(store.glasses.temporary)
        .then(id => glassesId = id);
      console.log('added to list')

      uploadGlassesToStorage(
        store.acceptedFile,
        `${store.glasses.temporary.name}/${store.glasses.temporary.name}.fbx`,
      )
        .then((url) => {
          console.log('uploaded')
          if (glassesId) {
            editGlassesFromList(glassesId, { loaded: true, file_path: url });
            console.log('edited')
          }
        })
    }
  };

  // вивантаження файла з хмари

  // downloadGlassesFromStorage('assets/glasses/1.fbx', '1.fbx')
  //   .then(data => store.glasses.modelFiles[data.name] = data);
  // console.log(store.glasses.modelFiles);

  return (
    <section className="edit-glasses">
      <div className="edit-glasses__top-panel">
        <input
          className="edit-glasses__input"
          type="text"
          name="glasses-name"
          placeholder="Glasses name"
          // value={}
          // onChange={}
        />

        <button
          className="edit-glasses__button"
          onClick={() => {
            uploadGlassesToFirebase()
          }}
        >01</button>
      </div>

      <div className="edit-glasses__scene">
      </div>
    </section>
  );
};
