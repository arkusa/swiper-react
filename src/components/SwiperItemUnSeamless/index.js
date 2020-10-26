import React from 'react';

function SwiperItem(props) {
  return (
    <div
      className="swiper-item-unseamless"
    >
      {props.children}
    </div>
  );
}

export default SwiperItem;
