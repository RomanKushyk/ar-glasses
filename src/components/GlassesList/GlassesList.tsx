import './glasses-list.scss';

import {FC, useContext, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {StoreContext} from '../../services/store/AdminPage/store';
import cn from 'classnames';

export const GlassesList: FC = observer(() => {
  const store = useContext(StoreContext);

  useEffect(() => {
    store.loadGlassesList();
    console.log('glasses list', store.glasses.list)
  }, [])

  return (
    <section className="glasses-list">
      {store.glasses.list.map(element => (
        <div
          key={element.id}
          onClick={() => {
            store.setSelected(element.id);
          }}
          className={cn(
              "glasses-list__item",
              {'glasses-list__item_active': element.id === store.glasses.selected}
          )}
        >
          <div className="glasses-list__preview-container">
            <img
              alt="glasses"
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
