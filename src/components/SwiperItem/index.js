import React from 'react';

import SwiperItemSeamless from '../SwiperItemSeamless';
import SwiperItemUnSeamless from '../SwiperItemUnSeamless';

function swiperItem(props) {
  const { seamless } = props;
  const SwiperItem = seamless ? SwiperItemSeamless : SwiperItemUnSeamless;

  return <SwiperItem {...props} />
}

export default swiperItem;
