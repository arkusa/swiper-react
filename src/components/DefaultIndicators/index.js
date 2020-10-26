import React from 'react';

function DefaultIndicator(props) {
  const { activedIndex, swiperTo, id } = props;

  const className =
    id === activedIndex ? 'actived-indicator indicator' : 'indicator';

  return (
    <i
      className={className}
      onClick={() => swiperTo(id)}
    />
  );
}

function DefaultIndicators(props) {
  const { count, activedIndex, swiperTo } = props;

  const indicators = [];
  for (let i = 0; i < count; i += 1) {
    indicators.push(
      <DefaultIndicator
        id={i}
        key={i}
        swiperTo={swiperTo}
        activedIndex={activedIndex}
      />
    );
  }

  return (
    <ul
      className="indicator-wrap"
    >
      {indicators}
    </ul>
  );
}

export default DefaultIndicators;
