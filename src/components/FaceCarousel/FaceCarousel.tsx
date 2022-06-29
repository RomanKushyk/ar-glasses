import "./face-carousel.scss";

import { Carousel } from "react-responsive-carousel";
import { faceTypes } from "../../consts/faceTypes";

import tensorflowSetUp from "../../utils/tensorflow_setup/tensorflowSetUp";
import React, { useEffect, useRef, useState } from "react";
import { image } from "@tensorflow/tfjs-core";
import { IStoreForTF } from "../../interfaces/services/store/StoreForTF";
import storeAdmin, {
  StoreAdmin,
} from "../../services/store/AdminPage/storeAdmin";
import FacetypeGetter from "../../utils/FacetypeGetter/FacetypeGetter";
import store from "../../services/store/app/store";
import Scene from "../../scenes/Scene";

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
  creates: false,
};

interface FaceCarouselProps {
  store: StoreAdmin;
}

export const FaceCarousel2: React.FC<FaceCarouselProps> = ({ store }) => {
  const carousel = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);

  const updateActiveImage = async (indexOfActive: number) => {
    console.log("refresh");
    if (
      store.scene &&
      store.activeItem.current &&
      carousel.current &&
      scene.current
    ) {
      const scale =
        carousel.current.offsetHeight / store.activeItem.current.naturalHeight;
      const width = store.activeItem.current.naturalWidth * scale;

      store.scene.updateCanvasSize(
        width,
        carousel.current.offsetHeight,
        store.activeItem.current.naturalWidth,
        store.activeItem.current.naturalHeight
      );
      console.log("setUpSize");
    }

    if (!carousel.current) return;

    const images = carousel.current.querySelectorAll("img");

    if (!images || !images.length) {
      return;
    }

    store.activeItem.current = images[indexOfActive];
  };

  useEffect(() => {
    const initialize = async () => {
      if (!tf_config.creates) {
        tf_config.creates = true;

        let onCreate = async () => {
          store.scene = null;
          store.scene = new Scene();

          await updateActiveImage(carouselConfig.selectedItem);

          await store.loadGlassesList();

          await store.loadAllGlassesFiles();
        };

        await onCreate();

        await tensorflowSetUp({
          source: store.activeItem,
          store,
          listeners: {
            onCreate: async () => {
              if (!carousel.current || !scene.current || !store.scene) return;

              if (!store.activeItem.current) return;

              const scale =
                carousel.current.offsetHeight /
                store.activeItem.current.naturalHeight;
              const width = store.activeItem.current.naturalWidth * scale;

              store.scene.setUpSize(
                width,
                carousel.current.offsetHeight,
                store.activeItem.current.naturalWidth,
                store.activeItem.current.naturalHeight
              );
              console.log(
                carousel.current.clientWidth,
                carousel.current.clientHeight,
                store.activeItem.current?.naturalWidth,
                store.activeItem.current?.naturalHeight
              );

              await store.scene.setUpScene(
                scene.current,
                carousel as unknown as HTMLVideoElement,
                store
              );
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

        tf_config.creates = false;
      }
    };

    initialize();
  }, [store.glasses.active_glasses, store.activeItem]);

  return (
    <div className="face-carousel">
      <div className="face-carousel__scene-wrapper" ref={scene} />

      <div className="face-carousel__carousel" ref={carousel}>
        <Carousel
          {...carouselConfig}
          onChange={(i, item) => {
            updateActiveImage(i);
          }}
        >
          {faceTypes.map((item, i) => (
            <div key={item.id} className="face-carousel__image-container">
              <img
                className="face-carousel__image"
                alt=""
                src={document.location.origin + "/" + item.src}
              />
            </div>
          ))}
        </Carousel>
      </div>
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
