import './glasses-list.scss';

import { FC, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../services/store/AdminPage/store';
import { useNavigate } from 'react-router-dom';

export const GlassesList: FC = observer(() => {
  const store = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    store.loadGlassesList();
  }, []);

  return (
    <section className="glasses-list">
      {store.glasses.list.map(element => (
        <div
          key={element.id}
          className={"glasses-list__item"}
        >
          <div className="glasses-list__description-container">
            <div className="glasses-list__preview-container">
              <img
                alt="glasses"
                src={element.preview_file_path}
                className="glasses-list__preview-img"
              />
            </div>

            <p>{element.name}</p>
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
