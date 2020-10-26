import React, { Component } from 'react';

import Swiper from './components/Swiper';
import SwiperItem from './components/SwiperItem';

import './css/index.css';
import './App.css';

function Item(props) {
  return <div className={'div' + props.text}>{props.text}</div>;
}

const array = [1, 2, 3, 4, 5];

function DefaultIndicator(props) {
  const { swiper, id, activedIndex } = props;

  const className =
    id === activedIndex ? 'actived-indicator indicator' : 'indicator';

  return (
    <li className={className} onClick={() => swiper.current.swiperTo(id)} />
  );
}

function DefaultIndicators(props) {
  const { swiper, activedIndex } = props;

  return (
    <ul className="indicator-wrap">
      {array.map((item, index) => (
        <DefaultIndicator
          key={index}
          id={index}
          swiper={swiper}
          activedIndex={activedIndex}
        />
      ))}
    </ul>
  );
}

class App extends Component {
  swiper = React.createRef();

  state = {
    seamless: false,
    initialIndex: 0,
    activedIndex: 0,
  };

  activedSwiperChangeStart = index => {
    console.log('change start', index);
    this.setState({ activedIndex: index });
  };

  activedSwiperChangeEnd = index => {
    console.log('change end', index);
  };

  componentDidMount() {
    window.swiper = this.swiper.current;
  }

  render() {
    const indicator = (
      <DefaultIndicators
        swiper={this.swiper}
        activedIndex={this.state.activedIndex}
      />
    );

    return (
      <div className="wrap">
        <Swiper
          loop
          autoplay={false}
          seamless={false}
          vertical={false}
          width={200}
          height={150}
          ref={this.swiper}
          indicator={true}
          // indicator={indicator}
          activedSwiperChangeStart={this.activedSwiperChangeStart}
          activedSwiperChangeEnd={this.activedSwiperChangeEnd}
        >
          {array.map((item, index) => (
            <SwiperItem key={index}>
              <Item text={item} />
            </SwiperItem>
          ))}
        </Swiper>
      </div>
    );
  }
}

export default App;
