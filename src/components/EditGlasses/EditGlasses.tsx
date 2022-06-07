import './edit-glasses.scss';

import { FC, useContext } from 'react';
import { StoreContext } from '../../services/store/AdminPage/store';

export const EditGlasses: FC = () => {
  const store = useContext(StoreContext);

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
            store.uploadGlassesToFirebase()
          }}
        >Save</button>
      </div>

      <div className="edit-glasses__scene">
      </div>

      <div className="edit-glasses__params-container params-container">
        <div className="params-container__params-list">
          list
        </div>

        <div className="params-container__navigation-panel">
          <button
            className="params-container__button params-container__button_scale"
            type="button"
            title="Scale"
            // onClick={}
          />

          <button
            className="params-container__button params-container__button_position"
            type="button"
            title="Position"
            // onClick={}
          />

          <button
            className="params-container__button params-container__button_rotate"
            type="button"
            title="Rotate"
            // onClick={}
          />

          <button
            className="params-container__button params-container__button_three"
            type="button"
            title="Three"
            // onClick={}
          />

          <div className="params-container__indicator"/>
        </div>
      </div>
    </section>
  );
};
