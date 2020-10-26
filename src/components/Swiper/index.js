import React, { forwardRef } from 'react';

import SwiperSeamless from '../SwiperSeamless';
import SwiperUnSeamless from '../SwiperUnSeamless';

function swiper(props, ref) {
  const { seamless } = props;
  const Swiper = seamless ? SwiperSeamless : SwiperUnSeamless;

  return <Swiper {...props} ref={ref} />
}

export default forwardRef(swiper);
