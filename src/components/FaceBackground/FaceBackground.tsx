import tensorflowSetUp from "../../utils/tensorflow_setup/tensorflowSetUp";
import React, { FC, useEffect, useRef } from "react";
import { StoreAdmin } from "../../services/store/AdminPage/storeAdmin";
import FacetypeGetter from "../../utils/FacetypeGetter/FacetypeGetter";
import Scene from "../../scenes/Scene";

import SampleFaceScene from "../../scenes/AdminPage/SampleFaceScene/SampleFaceScene";
import "./face-background.scss";

const tf_config = {
  created: false,
};

interface FaceBackgroundProps {
  store: StoreAdmin;
}

export const FaceBackground: FC<FaceBackgroundProps> = ({ store }) => {
  const scene = useRef<HTMLDivElement>(null);
  const faceBackground = useRef<HTMLDivElement>(null);
  const parent = useRef<HTMLDivElement>(null);

  const updateSceneSize = (canvas: HTMLCanvasElement) => {
    if (store.scene && scene.current) {
      store.scene.setUpSize(
        canvas.offsetWidth,
        canvas.offsetHeight,
        canvas.offsetWidth,
        canvas.offsetHeight
      );

      store.scene.updateCanvasSize(
        canvas.offsetWidth,
        canvas.offsetHeight,
        canvas.offsetWidth,
        canvas.offsetHeight
      );
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (!parent.current) {
        return;
      }

      if (!tf_config.created) {
        tf_config.created = true;

        let canvas = SampleFaceScene(faceBackground);

        let onCreate = async () => {
          store.scene = null;
          store.scene = new Scene();

          updateSceneSize(canvas);

          await store.loadGlassesList();

          await store.loadAllGlassesFiles();
        };

        await onCreate();

        await tensorflowSetUp({
          source: {
            current: canvas,
          },
          store,
          listeners: {
            onCreate: async () => {
              if (!scene.current || !store.scene) return;

              await store.scene.setUpScene(scene.current, canvas, store);
            },
            onDraw: async () => {
              if (!store.scene || !store.scene.created) return;

              if (store.tf.facedata.length > 0) {
                await store.scene.drawScene(store.tf.facedata);

                if (Number.isNaN(store.facetype.type)) {
                  let result = await FacetypeGetter(
                    store.tf.facedata[0].keypoints
                  );

                  await store.updateFacetype(result);
                }
              }
            },
          },
        });

        tf_config.created = false;
      }
    };

    initialize();
  }, [store.glasses.active_glasses]);

  return (
    <div className="face-carousel" ref={parent}>
      <div
        className="face-carousel__scene-wrapper"
        style={{
          pointerEvents: "none",
          zIndex: 1,
        }}
        ref={scene}
      />

      <div
        className="face-carousel__scene-wrapper"
        style={{
          zIndex: 0,
        }}
        ref={faceBackground}
      ></div>
    </div>
  );
};
