import './glasses-list.scss';

import {FC, useContext, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {StoreContext} from '../../services/store/AdminPage/store';

export const GlassesList: FC = observer(() => {
  const store = useContext(StoreContext);

  useEffect(() => {
    store.updateList();
  }, [])

  return (
    <section className="glasses-list">
      {store.glasses.list.map(element => (
        <div
          key={element.id}
          onClick={() => {
            store.setSelected(element.id);
          }}
          className={
            "glasses-list__item" +
            (element.id === store.glasses.selected
              ? " glasses-list__item_active"
              : "")
          }
        >
          <div className="glasses-list__preview-container">
            <img
              alt={element.id.toString()}
              src={element.preview_file_path}
              className="glasses-list__preview-img"
            />
          </div>
          {element.name}
        </div>
      ))}
    </section>
  );
});
