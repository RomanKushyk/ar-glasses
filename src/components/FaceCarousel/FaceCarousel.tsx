import tensorflowSetUp from "../../utils/tensorflow_setup/tensorflowSetUp";
import React, { useEffect, useRef, useState } from "react";
import { StoreAdmin } from "../../services/store/AdminPage/storeAdmin";
import FacetypeGetter from "../../utils/FacetypeGetter/FacetypeGetter";
import Scene from "../../scenes/Scene";

import FaceBackground from "./Scene";
import "./face-carousel.scss";

const carouselConfig = {
  showArrows: true,
  showStatus: false,
  showIndicators: true,
  infiniteLoop: false,
  showThumbs: false,
  useKeyboardArrows: true,
  autoPlay: false,
  stopOnHover: true,
  swipeable: true,
  dynamicHeight: false,
  emulateTouch: true,
  autoFocus: false,
  thumbWidth: 40,
  selectedItem: 2,
  interval: 2000,
  transitionTime: 500,
  swipeScrollTolerance: 5,
  ariaLabel: undefined,
};

const tf_config = {
  created: false,
};

interface FaceCarouselProps {
  store: StoreAdmin;
}

export const FaceCarousel2 = ({ store }: FaceCarouselProps) => {
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

        let canvas = FaceBackground(faceBackground);

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

              console.log(store.tf.facedata.length);

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
  }, [store.glasses.active_glasses, store.activeItem]);

  return (
    <div className="face-carousel" ref={parent}>
      <div className="face-carousel__scene-wrapper" style={{
        pointerEvents: 'none',
        zIndex: 1,
      }} ref={scene} />

      <div className="face-carousel__scene-wrapper" style={{
        zIndex: 0,
      }} ref={faceBackground}></div>
    </div>
  );
};

// export class FaceCarousel extends React.Component<FaceCarouselProps> {
//   store: StoreAdmin;
//   constructor(props: { store: StoreAdmin }) {
//     super(props);
//
//     this.store = props.store;
//   }
//
//   carousel = React.createRef<HTMLDivElement>();
//   scene = React.createRef<HTMLDivElement>();
//
//   state: {
//     active_item: {
//       current: undefined | HTMLImageElement;
//     };
//   } = {
//     active_item: {
//       current: undefined,
//     },
//   };
//
//   updateActiveImage(index_of_active: number) {
//     if (!this.carousel.current) {
//       return;
//     }
//
//     let images = this.carousel.current?.querySelectorAll("img");
//
//     if (!images || !images.length) {
//       return;
//     }
//
//     this.state.active_item.current = images[index_of_active];
//   }
//
//   async componentDidMount() {
//     if (!tf_config.created) {
//       tf_config.created = true;
//
//       let onCreate = async () => {
//         this.updateActiveImage(0);
//         // this.store.scene = null;
//         // console.log("null");
//         this.store.scene = new Scene();
//         console.log("create");
//
//         await this.store.loadGlassesList();
//
//         await this.store.loadAllGlassesFiles();
//       };
//
//       await onCreate();
//
//       await tensorflowSetUp({
//         source: this.state.active_item,
//         store: this.store,
//         listeners: {
//           onCreate: async () => {
//             if (
//               !this.carousel.current ||
//               !this.scene.current ||
//               !this.store.scene
//             )
//               return;
//
//             const videoWidth = this.carousel.current.offsetWidth;
//             const videoHeight = this.carousel.current.offsetHeight;
//
//             await this.store.scene.setUpSize(
//               videoWidth,
//               videoHeight,
//               videoWidth,
//               videoHeight
//             );
//
//             await this.store.scene.setUpScene(
//               this.scene.current,
//               this.carousel as unknown as HTMLVideoElement,
//               this.store
//             );
//           },
//           onDraw: async () => {
//             if (!this.store.scene || !this.store.scene.created) return;
//
//             if (this.store.tf.facedata.length > 0) {
//               await this.store.scene.drawScene(this.store.tf.facedata);
//
//               if (Number.isNaN(this.store.facetype.type)) {
//                 let result = await FacetypeGetter(
//                   this.store.tf.facedata[0].keypoints
//                 );
//
//                 await this.store.updateFacetype(result);
//               }
//             }
//           },
//         },
//       });
//     }
//   }
//
//   render() {
//     return (
//       <>
//         <div ref={this.scene} />
//
//         <div className="face-carousel" ref={this.carousel}>
//           <Carousel
//             {...carouselConfig}
//             onChange={(i, item) => {
//               this.updateActiveImage(i);
//             }}
//           >
//             {faceTypes.map((item, i) => (
//               <div key={item.id} className="face-carousel__image-container">
//                 <img
//                   className="face-carousel__image"
//                   alt=""
//                   src={document.location.origin + "/" + item.src}
//                 />
//               </div>
//             ))}
//           </Carousel>
//         </div>
//       </>
//     );
//   }
// }
