import PropTypes from 'prop-types';
import React, { Component, cloneElement } from 'react';

import DefaultIndicators from '../DefaultIndicators';

export default class Swiper extends Component {
  swiperLock = false;
  autoplayTimer = null;

  constructor(props) {
    super(props);

    const {
      width,
      height,
      children,

      loop,
      seamless,
      vertical,
      autoplay,
      moveDuration,
      moveDirection,
      initialIndex,
      activedDuration,
    } = props;

    this.childrenLength = this.props.children.length;

    this.state = {
      width,
      height,
      children,

      loop,
      seamless,
      vertical,
      vertical,
      autoplay,
      moveDuration,
      moveDirection,
      activedDuration,
      activedIndex:
        initialIndex > children.length - 1 || initialIndex < 0
          ? 0
          : initialIndex,

      direction: moveDirection,
    };
    
    // TODO
    window.swiperNext = this.swiperNext.bind(this);
    window.swiperPrev = this.swiperPrev.bind(this);
    window.swiperTo = this.swiperTo.bind(this);
  }

  componentDidMount() {
    this.autoplay();
  }

  componentWillUnmount() {
    if (this.autoplayTimer)
      clearTimeout(this.autoplayTimer);
  }

  play = () => {
    const { activedDuration, moveDuration } = this.state;

    clearTimeout(this.autoplayTimer);

    this.swiperToNext();

    this.autoplayTimer = setTimeout(this.play, activedDuration + moveDuration);
  };

  autoplay = () => {
    const { loop, autoplay, activedDuration, moveDuration } = this.state;

    clearTimeout(this.autoplayTimer);

    if (!autoplay || !loop || this.childrenLength <= 1) return;

    this.autoplayTimer = setTimeout(this.play, activedDuration + moveDuration);
  };

  swiperNext = () => {
    this.swiperToNext();
    this.autoplay();
  };

  swiperPrev = () => {
    this.swiperToPrev();
    this.autoplay();
  };

  swiperToNext() {
    const { loop, activedIndex } = this.state;

    if (this.childrenLength <= 1) return;
    if (!loop && activedIndex === this.childrenLength - 1) return;
    if (this.isSwipering()) return;

    const index = (activedIndex + 1) % this.childrenLength;

    this.setState(state => ({
      activedIndex: index,
      direction: state.moveDirection,
    }));

    this.props.activedSwiperChangeStart(index);
  }

  swiperToPrev() {
    const { loop, activedIndex } = this.state;

    if (this.childrenLength <= 1) return;
    if (!loop && activedIndex === 0) return;
    if (this.isSwipering()) return;

    const index =
      (this.childrenLength + activedIndex - 1) % this.childrenLength;

    this.setState(state => ({
      activedIndex: index,
      direction: -state.moveDirection,
    }));

    this.props.activedSwiperChangeStart(index);
  }

  swiperTo = index => {
    if (this.childrenLength <= 1) return;
    if (index >= this.childrenLength || index < 0) return;
    if (index === this.state.activedIndex) return;
    if (this.isSwipering()) return;

    const { activedIndex } = this.state;

    this.autoplay();

    this.setState(state => ({
      direction: index > activedIndex,
      activedIndex: index,
    }));

    this.props.activedSwiperChangeStart(index);
  };

  isSwipering = () => {
    if (this.swiperLock) return true;

    this.swiperLock = true;
    setTimeout(() => {
      this.swiperLock = false;
    }, this.state.moveDuration);

    return false;
  }

  renderIndicator = () => {
    const { activedIndex } = this.state;
    const { indicator } = this.props;

    if (!indicator) return null;

    if (typeof indicator === 'boolean')
      return (
        <DefaultIndicators
          count={this.childrenLength}
          activedIndex={activedIndex}
          swiperTo={this.swiperTo}
        />
      );

    return indicator;
  };

  render() {
    const {
      width,
      height,
      children,

      loop,
      seamless,
      vertical,
      direction,
      moveDuration,
      activedIndex,
    } = this.state;

    const newChildren = children.map((child, childIndex) =>
      cloneElement(child, {
        loop, 
        width,
        height,
        seamless,
        vertical,
        direction,
        moveDuration,
        activedIndex,
        ident: childIndex,

        childrenLength: this.childrenLength,
        activedSwiperChangeEnd: this.props.activedSwiperChangeEnd,
      })
    );

    const indicator = this.renderIndicator();

    return (
      <>
        {newChildren}
        {indicator}
      </>
    );
  }
}

Swiper.defaultProps = {
  loop: false,
  autoplay: false,
  seamless: false,
  vertical: false,
  indicator: false,
  initialIndex: 0,
  moveDirection: 1,
  moveDuration: 1000,
  activedDuration: 2000,
  activedSwiperChangeEnd: () => {},
  activedSwiperChangeStart: () => {},
};

Swiper.propTypes = {
  loop: PropTypes.bool,
  autoplay: PropTypes.bool,
  seamless: PropTypes.bool,
  vertical: PropTypes.bool,
  moveDuration: PropTypes.number,
  initialIndex: PropTypes.number,
  moveDirection: PropTypes.number,
  activedDuration: PropTypes.number,
  indicator: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
  activedSwiperChangeEnd: PropTypes.func,
  activedSwiperChangeStart: PropTypes.func,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
