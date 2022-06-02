import './edit-glasses.scss';

import { FC } from 'react';
import App from '../../App';
import { downloadGlassesFromStorage } from '../../api/firebase/storage/glasses';

export const EditGlasses: FC = () => {
  const uploadGlassesToFirebase = () => {
    downloadGlassesFromStorage('assets/glasses/1.fbx')
      .then(data => console.log(data));
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
            uploadGlassesToFirebase();
          }}
        >01</button>
      </div>

      <div className="edit-glasses__scene">
      </div>
    </section>
  );
};
