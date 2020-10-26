import React, { Component } from 'react';

class SwiperItem extends Component {
  state = {
    // 初始状态
    isBoundary: false,
    prevActivedIndex: null,
  };

  // TODO 是否有优化效果需要测试
  shouldComponentUpdate(nextProps, nextState) {
    nextState = Object.assign({}, nextState);
    const state = Object.assign({}, this.state);

    delete state.isBoundary;
    delete state.prevActivedIndex;
    delete nextState.isBoundary;
    delete nextState.prevActivedIndex;

    const propsKeys = Object.keys(this.props);
    const stateKeys = Object.keys(this.state);
    const nextPropsKeys = Object.keys(nextProps);
    const nextStateKeys = Object.keys(nextState);

    return (
      propsKeys.length !== nextPropsKeys.length ||
      stateKeys.length !== nextStateKeys.length ||
      propsKeys.some(propKey => this.props[propKey] !== nextProps[propKey]) ||
      stateKeys.some(stateKey => this.state[stateKey] !== nextState[stateKey])
    );
  }

  static computedTranslate(props, percent) {
    if (props.vertical) return `translate(0%, ${percent}%)`;

    return `translate(${percent}%)`;
  }

  static getInitialStyle(props) {
    const { ident, activedIndex } = props;

    return {
      transition: '',
      transform:
        ident === activedIndex
          ? SwiperItem.computedTranslate(props, 0)
          : SwiperItem.computedTranslate(props, 100),
    };
  }

  static getBoundaryStyle(props) {
    return {
      transition: '',
      transform:
        props.direction > 0
          ? SwiperItem.computedTranslate(props, 100)
          : SwiperItem.computedTranslate(props, -100),
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.prevActivedIndex === null) {
      return {
        style: SwiperItem.getInitialStyle(props),
        prevActivedIndex: props.activedIndex,
      };
    }

    if (
      props.activedIndex === state.prevActivedIndex
      || props.activedIndex < 0
      || props.activedIndex > props.childrenLength - 1
    ) return null;

    const nextState = {
      prevActivedIndex: props.activedIndex,
    };

    if (props.activedIndex === props.ident) {
      nextState.style = SwiperItem.getBoundaryStyle(props);
    }

    nextState.isBoundary =
      props.activedIndex === props.ident ||
      state.prevActivedIndex === props.ident
        ? true
        : false;

    return nextState;
  }

  static getSwiperStyle(props) {
    const style = { transition: `transform ${props.moveDuration}ms` };

    if (props.direction > 0)
      style.transform =
        props.activedIndex === props.ident
          ? SwiperItem.computedTranslate(props, 0)
          : SwiperItem.computedTranslate(props, -100);
    else
      style.transform =
        props.activedIndex === props.ident
          ? SwiperItem.computedTranslate(props, 0)
          : SwiperItem.computedTranslate(props, 100);

    return style;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.isBoundary) return;

    /**
     * @desc 这里需要强制浏览器回流, 防止发生下面情况
     * 在滑动到最后滑块的时候, 导致首个滑块不能瞬间位移到最后滑块的后面
     * TODO 或者加计时器也可以fix, 个人觉得这个比较好
     * */
    document.body.getBoundingClientRect();

    this.setState({
      isBoundary: false,
      style: SwiperItem.getSwiperStyle(this.props),
    });
  }

  transitionEnd = () => {
    if (this.props.ident === this.props.activedIndex)
      this.props.activedSwiperChangeEnd(this.props.activedIndex);
  };

  render() {
    return (
      <div
        className="swiper-item-seamless"
        style={this.state.style}
        onTransitionEnd={this.transitionEnd}
      >
        {this.props.children}
      </div>
    );
  }
}

export default SwiperItem;
