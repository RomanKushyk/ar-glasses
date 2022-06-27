import "./face-carousel.scss";

import { Carousel } from "react-responsive-carousel";
import { faceTypes } from "../../consts/faceTypes";

import tensorflowSetUp from "../../utils/tensorflow_setup/tensorflowSetUp";
import React, { useEffect } from "react";
import { image } from "@tensorflow/tfjs-core";
import { IStoreForTF } from "../../interfaces/services/store/StoreForTF";

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
  store: IStoreForTF,
}

export class FaceCarousel extends React.Component<FaceCarouselProps> {
  store: IStoreForTF;
  constructor(props: {
    store: IStoreForTF,
  }) {
    super(props);

    this.store = props.store;

    console.log("created");
  }

  carousel = React.createRef<HTMLDivElement>();

  state: {
    active_item: {
      current: undefined | HTMLImageElement,
    };
  } = {
    active_item: {
      current: undefined
    },
  };

  updateActiveImage(index_of_active: number) {
    if (!this.carousel.current) {
      return;
    }

    let images = this.carousel.current?.querySelectorAll("img");

    if(!images || !images.length) {
      return;
    }


    this.state.active_item.current = images[index_of_active];
  }

  componentDidMount(){
    if (!tf_config.created) {
      tf_config.created = true;
      console.log("start")

      tensorflowSetUp({
        source: this.state.active_item,
        store: this.store,
        listeners: {
          onCreate: () => {},
          onDraw: () => {
            // console.log(this.store.tf.facedata)
          },
        }
      });
    }
  }

  render() {
    return (
      <div className="face-carousel" ref={this.carousel}>
        <Carousel
          onChange={(i, item) => {
            this.updateActiveImage(i);
          }}
          {...carouselConfig}
        >
          {faceTypes.map((item) => (
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
    );
  }
}
