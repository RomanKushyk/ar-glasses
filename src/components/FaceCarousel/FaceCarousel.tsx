import "./face-carousel.scss";

import { Carousel } from "react-responsive-carousel";
import { faceTypes } from "../../consts/faceTypes";

import tensorflowSetUp from "../../utils/tensorflow_setup/tensorflowSetUp";
import React, { useEffect } from "react";
import { image } from "@tensorflow/tfjs-core";
import { IStoreForTF } from "../../interfaces/services/store/StoreForTF";
import { StoreAdmin } from "../../services/store/AdminPage/storeAdmin";
import FacetypeGetter from "../../utils/FacetypeGetter/FacetypeGetter";
import store from "../../services/store/app/store";

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
  selectedItem: 0,
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

export class FaceCarousel extends React.Component<FaceCarouselProps> {
  store: StoreAdmin;
  constructor(props: { store: StoreAdmin }) {
    super(props);

    this.store = props.store;
  }

  carousel = React.createRef<HTMLDivElement>();
  scene = React.createRef<HTMLDivElement>();

  state: {
    active_item: {
      current: undefined | HTMLImageElement;
    };
  } = {
    active_item: {
      current: undefined,
    },
  };

  updateActiveImage(index_of_active: number) {
    if (!this.carousel.current) {
      return;
    }

    let images = this.carousel.current?.querySelectorAll("img");

    if (!images || !images.length) {
      return;
    }

    this.state.active_item.current = images[index_of_active];
  }

  async componentDidMount() {
    if (!tf_config.created) {
      tf_config.created = true;

      let onCreate = async () => {
        this.updateActiveImage(0);

        await this.store.loadGlassesList();

        await this.store.loadAllGlassesFiles();
      };

      await onCreate();

      await tensorflowSetUp({
        source: this.state.active_item,
        store: this.store,
        listeners: {
          onCreate: async () => {
            if (!this.carousel.current || !this.scene.current) return;

            const videoWidth = this.carousel.current.offsetWidth;
            const videoHeight = this.carousel.current.offsetHeight;

            await this.store.scene.setUpSize(
              videoWidth,
              videoHeight,
              videoWidth,
              videoHeight
            );

            await this.store.scene.setUpScene(
              this.scene.current,
              this.carousel as unknown as HTMLVideoElement,
              this.store
            );
          },
          onDraw: async () => {
            if (!this.store.scene.created) return;

            if (this.store.tf.facedata.length > 0) {
              await this.store.scene.drawScene(this.store.tf.facedata);

              if (Number.isNaN(this.store.facetype.type)) {
                let result = await FacetypeGetter(
                  this.store.tf.facedata[0].keypoints
                );

                await this.store.updateFacetype(result);
              }
            }
          },
        },
      });
    }
  }

  render() {
    return (
      <>
        <div ref={this.scene} />

        <div className="face-carousel" ref={this.carousel}>
          <Carousel
            {...carouselConfig}
            onChange={(i, item) => {
              this.updateActiveImage(i);
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
      </>
    );
  }
}
