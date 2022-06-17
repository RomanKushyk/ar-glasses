import './glasses-list.scss';

import { FC, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContextAdmin } from '../../services/store/AdminPage/storeAdmin';
import { useNavigate } from 'react-router-dom';
import { Glasses } from '../../interfaces/consts/Glasses';

export const GlassesList: FC = observer(() => {
  const store = useContext(StoreContextAdmin);
  const navigate = useNavigate();

  useEffect(() => {
    store.loadGlassesList();
  }, []);

  const getPreviewPath = (item: Glasses) => {
    switch (item.local) {
      case true:
        return document.location.origin + '/' + item.preview_file_path;

      default:
        return item.preview_file_path;
    }
  };

  return (
    <section className="glasses-list">
      {store.glasses.list.map(element => (
        <div
          key={element.id}
          className="glasses-list__item"
        >
          <div className="glasses-list__description-container">
            <div className="glasses-list__preview-container">
              <img
                alt="glasses"
                src={getPreviewPath(element)}
                className="glasses-list__preview-img"
              />
            </div>

            <p className="glasses-list__title">{element.name}</p>

            {
              element.local &&
              <span className="glasses-list__is-local"/>
            }
          </div>

          <div className="glasses-list__option-container">
            <button
              className="glasses-list__option-button glasses-list__option-button_edit"
              type="button"
              onClick={() => {
                navigate(`../edit/${element.id}`)
              }}
            />

            <button
              className="glasses-list__option-button glasses-list__option-button_delete"
              type="button"
              onClick={() => {
                store.deleteGlassesFromFirebase(element);
              }}
            />
          </div>
        </div>
      ))}
    </section>
  );
});
