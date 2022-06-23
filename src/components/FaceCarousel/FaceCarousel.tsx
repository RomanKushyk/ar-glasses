import "./face-carousel.scss";

import { Carousel } from 'react-responsive-carousel';
import {faceTypes} from '../../consts/faceTypes';

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

export const FaceCarousel = () => {
  return (
    <div className="face-carousel">
      <Carousel {...carouselConfig}>
        {faceTypes.map(item => (
          <div
            key={item.id}
            className="face-carousel__image-container"
          >
            <img
              className="face-carousel__image"
              alt=""
              src={document.location.origin + '/' + item.src}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};
