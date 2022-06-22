import {Carousel} from 'react-responsive-carousel';
import "./face-carousel.scss";

export const FaceCarousel = () => {
  const config = {
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
  }

  const items = [
    {id: 1, title: 'item #1'},
    {id: 2, title: 'item #2'},
    {id: 3, title: 'item #3'},
    {id: 4, title: 'item #4'},
    {id: 5, title: 'item #5'}
  ];

  return (
    <div className="face-carousel">
      <Carousel {...config}>
        {items.map(item => (
          <div
            key={item.id}
            className="face-carousel__image-container"
          >
            <img
              className="face-carousel__image"
              alt=""
              src="https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/03/GettyImages-1092658864_hero-1024x575.jpg?w=1155&h=1528"/>
          </div>
        ))}
      </Carousel>
    </div>
  );
};
