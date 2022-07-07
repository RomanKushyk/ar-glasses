import "./preloader.scss";

import { observer } from "mobx-react-lite";
import cn from "classnames";
import { FC, useEffect, useMemo, useState } from "react";
import { ESex } from "../../enums/ESex";
import { EGlassesType } from "../../enums/EGlassesType";
import { Store } from "../../services/store/app/store";
import { sexList } from "../../consts/Preloader/sex";
import { glassesTypesList } from "../../consts/Preloader/glassesTypes";

interface Props {
  store: Store;
}

const Preloader: FC<Props> = observer(({ store }) => {
  const [screenCompleted, setScreenCompleted] = useState(0);

  useEffect(() => {
    if (screenCompleted === 2) store.userData.setupScreenCompleted = true;
  }, [screenCompleted]);

  const yourSexBlock = (
    <div
      className={cn(
        "preloader__your-sex",
        "your-sex",
        { "your-sex_wait": !store.ready },
        { "your-sex_active": store.ready && !store.userData.sex }
      )}
    >
      <div className="your-sex__container">
        <h2 className="your-sex__title">Your sex</h2>

        <div className="your-sex__list">
          {sexList.map((item) => (
            <div
              key={item.name}
              className="your-sex__item"
              onClick={() => {
                store.setUserDataSex(item.name);
                setScreenCompleted(1);
              }}
            >
              <img
                className="your-sex__item-image"
                alt={item.name}
                src={document.location.origin + "/" + item.imgPath}
              />

              <p className="your-sex__item-title">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const glassesTypesBlock = (
    <div
      className={cn(
        "preloader__glasses-types",
        "glasses-types",
        { "glasses-types_wait": !store.userData.sex },
        {
          "glasses-types_active":
            store.userData.sex && !store.userData.glassesType,
        }
      )}
    >
      <div className="glasses-types__container">
        <h2 className="glasses-types__title">Glasses type</h2>

        <div className="glasses-types__list">
          {glassesTypesList.map((item) => (
            <div
              key={item.name}
              className="glasses-types__item"
              onClick={() => {
                store.setUserDataGlassesType(item.name);
                setScreenCompleted(2);
              }}
            >
              <img
                className="glasses-types__item-image"
                alt={item.name}
                src={document.location.origin + "/" + item.imgPath}
              />

              <p className="glasses-types__item-title">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={cn("preloader", {
          preloader_active:
            !store.ready || !store.userData.sex || !store.userData.glassesType,
        })}
      >
        <div
          className={cn("preloader__splash", "splash", {
            splash_active: !store.ready,
          })}
        >
          <svg className="splash__spinner" viewBox="0 0 50 50" fill="blue">
            <circle
              className="splash__spinner-path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="5"
            ></circle>
          </svg>
        </div>

        {yourSexBlock}

        {glassesTypesBlock}
      </div>
    </>
  );
});

export default Preloader;
