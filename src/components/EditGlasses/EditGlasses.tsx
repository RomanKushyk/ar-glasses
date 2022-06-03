import './edit-glasses.scss';

import {FC, useContext} from 'react';
import App from '../../App';
import { downloadGlassesFromStorage } from '../../api/firebase/storage/glasses';
import {StoreContext} from '../../services/store/AdminPage/store';

export const EditGlasses: FC = () => {
  const store = useContext(StoreContext);
  const uploadGlassesToFirebase = () => {
    downloadGlassesFromStorage('assets/glasses/1.fbx', '1.fbx')
      .then(data => store.glasses.modelFiles[data.name] = data);
    console.log(store.glasses.modelFiles);
  };

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
