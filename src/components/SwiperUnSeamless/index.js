import PropTypes from 'prop-types';
import React, { Component, createElement } from 'react';

import DefaultIndicators from '../DefaultIndicators';

export default class Swiper extends Component {
  autoplayTimer = null;

  constructor(props) {
    super(props);

    const {
      width,
      height,
      children,

      loop,
      vertical,
      autoplay,
      moveDuration,
      moveDirection,
      initialIndex,
      activedDuration,
    } = props;

    const newChildren = [...children];
    const { type, props: childProps } = newChildren[0];

    newChildren.push(
      createElement(type, {
        ...childProps,
        key: children.length,
      })
    );

    this.state = {
      loop,
      width,
      height,
      vertical,
      autoplay,
      moveDuration,
      moveDirection,
      activedDuration,
      activedIndex:
        initialIndex > children.length - 1 || initialIndex < 0
          ? 0
          : initialIndex,

      children: newChildren,
      childrenLength: newChildren.length,

      boundarySwiper: false,
      prevActivedIndex: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {
      width,
      height,
      vertical,
      children,
      moveDuration,
      activedIndex,
      boundarySwiper,
      childrenLength,
      prevActivedIndex,
    } = state;

    const offset = vertical ? height : width;

    // 初始化swiperItem位置
    if (prevActivedIndex === null) {
      const initialTranslate = activedIndex * offset;

      return {
        prevActivedIndex: activedIndex,
        style: {
          transition: '',
          transform: vertical
            ? `translate(0%, -${initialTranslate}px)`
            : `translate(-${initialTranslate}px, 0%)`,
        },
      };
    }

    // swiperItem移动的逻辑
    if (
      activedIndex !== prevActivedIndex &&
      activedIndex >= 0 &&
      activedIndex <= children.length - 1
    ) {
      const newState = { prevActivedIndex: activedIndex };

      if (boundarySwiper) {
        const boundaryTranslate =
          activedIndex === 0 ? 0 : (childrenLength - 1) * offset;

        newState.style = {
          transition: '',
          transform: vertical
            ? `translate(0%, -${boundaryTranslate}px)`
            : `translate(-${boundaryTranslate}px, 0%)`,
        };
      } else {
        const translate = activedIndex * offset;

        newState.style = {
          transition: `transform ${moveDuration}ms`,
          transform: vertical
            ? `translate(0%, -${translate}px)`
            : `translate(-${translate}px, 0%)`,
        };
      }

      return newState;
    }

    return null;
  }

  componentDidMount() {
    this.autoplay();
  }

  componentWillUnmount() {
    if (this.autoplayTimer)
      clearTimeout(this.autoplayTimer);
  }

  componentDidUpdate() {
    if (!this.state.boundarySwiper) return;

    // 必要的
    document.body.getBoundingClientRect();

    this.setState({
      boundarySwiper: false,
      activedIndex: this.state.boundarySwiper,
    });
  }

  play = () => {
    const { activedDuration, moveDuration } = this.state;

    clearTimeout(this.autoplayTimer);

    this.swiperToNext();

    this.autoplayTimer = setTimeout(this.play, activedDuration + moveDuration);
  };

  autoplay = () => {
    if (this.autoplayTimer) clearTimeout(this.autoplayTimer);

    const { autoplay, loop, moveDuration, activedDuration, childrenLength } = this.state;

    if (!autoplay || !loop || childrenLength <= 2) return;

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

  swiperToNext = () => {
    const { moveDirection } = this.state;
    /* @desc 反向滑动 */
    if (moveDirection < 0) return this.swiperToIndexReduce();

    this.swiperToIndexIncrease();
  };

  swiperToPrev = () => {
    const { moveDirection } = this.state;
    /* @desc 反向滑动 */
    if (moveDirection < 0) return this.swiperToIndexIncrease();

    this.swiperToIndexReduce();
  };

  swiperToIndexIncrease = () => {
    const { loop, activedIndex, childrenLength } = this.state;

    /* @desc 只有一个滑块的时候 */
    if (childrenLength <= 2) return;

    /* @desc 不循环的时候, 滑动到最后一个滑块后不允许触发滑动 */
    if (!loop && activedIndex === childrenLength - 2) return;

    const index = (activedIndex + 1) % childrenLength;
    const state = { activedIndex: index };

    if (index === 0) state.boundarySwiper = index + 1;

    this.setState(state);

    const changeIndex =
      index === childrenLength - 1 ? 0 : index === 0 ? index + 1 : index;

    this.props.activedSwiperChangeStart(changeIndex);
  };

  swiperToIndexReduce = () => {
    const { loop, activedIndex, childrenLength } = this.state;

    /* @desc 只有一个滑块的时候 */
    if (childrenLength <= 2) return;

    /* @desc 不循环的时候, 滑动到第一个滑块后不允许触发滑动 */
    if (!loop && activedIndex === 0) return;

    const index = (childrenLength + activedIndex - 1) % childrenLength;
    const state = { activedIndex: index };

    if (index === childrenLength - 1) state.boundarySwiper = index - 1;

    this.setState(state);

    this.props.activedSwiperChangeStart(
      index === childrenLength - 1 ? index - 1 : index
    );
  };

  swiperTo = index => {
    const { childrenLength, activedIndex } = this.state;
    /* @desc 只有一个滑块的时候 */
    if (childrenLength <= 2) return;
    /* @desc 索引越界 */
    if (index < 0 || index > childrenLength - 2) return;
    /* @desc 索引是当前滑块的索引 */
    if (activedIndex === index) return;

    this.setState({ activedIndex: index });

    this.autoplay();

    this.props.activedSwiperChangeStart(index);
  };

  transitionEnd = () => {
    const { activedIndex, childrenLength } = this.state;

    this.props.activedSwiperChangeEnd(
      activedIndex === childrenLength - 1 ? 0 : activedIndex
    );
  };

  renderIndicator = () => {
    const { activedIndex , childrenLength } = this.state;
    const { indicator } = this.props;

    if (!indicator) return null;

    if (typeof indicator === 'boolean')
      return (
        <DefaultIndicators
          count={childrenLength - 1}
          activedIndex={activedIndex}
          swiperTo={this.swiperTo}
        />
      );

    return indicator;
  };

  render() {
    const { style, children, vertical } = this.state;

    const className = vertical
      ? 'swiper-unseamless-vertical'
      : 'swiper-unseamless-horizontal';

    const indicator = this.renderIndicator();

    return (
      <>
        <div
          style={style}
          className={className}
          onTransitionEnd={this.transitionEnd}
        >
          {children}
        </div>
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
