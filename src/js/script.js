'use strict';

import fetch from 'isomorphic-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import CSSTransitionGroup from 'react-addons-css-transition-group';

class ScaleInput extends React.Component {
  handleChangeScale(event) {
    this.props.onChangeValue(event.target.value);
  }
  render() {
    return (
      <div className="scale-input">
        <input type="range" min="2" max="20" value={this.props.scaleValue} onChange={this.handleChangeScale.bind(this)} />
      </div>
    );
  }
}

class MaxInput extends React.Component {
  handleChangeMax(event) {
    this.props.onChangeValue(event.target.value);
  }
  render() {
    return (
      <div className="max-input">
        <input type="number" value={this.props.maxValue} onChange={this.handleChangeMax.bind(this)} />
      </div>
    );
  }
}

class Mas extends React.Component {
  handleClick() {
    this.props.onClick(this.props.number);
  }
  render() {
    let masContentStyle = {
      height: this.props.scale + 'vh',
      width: this.props.scale * 2 + 'vh'
    };
    let ratio = this.props.count / this.props.max;
    let to16 = ((o, n) => ('0' + Math.floor((o - n) * (1 - ratio) + n).toString(16)).substr(-2));
    let progressStyle = {
      height: ratio * 100 + '%',
      backgroundColor: '#' + to16(250, 53) + to16(253, 218) + to16(31, 146)
    };
    return (
      <CSSTransitionGroup component="div" transitionName="mas-transition" transitionEnterTimeout={1000} transitionLeaveTimeout={1000} onClick={this.handleClick.bind(this)} className={['mas', `sec-${this.props.number}`].join(' ')}>
        <div className="mas-content" style={masContentStyle}>
          <span>{this.props.number}</span>
        </div>
        <div className="progress" style={progressStyle}></div>
      </CSSTransitionGroup>
    );
  }
}

class Mass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counts: Array(this.props.nMas).fill().map((v, i) => 0),
    };
  }
  handleMasClick(number) {
    let counts = this.state.counts;
    if(counts[number] < this.props.max) counts[number] += 1;
    this.setState({counts});
  }
  render() {
    let mass = Array(this.props.nMas).fill().map((v, i) => (
      <Mas count={this.state.counts[i]} max={this.props.max} number={i} scale={this.props.scale} key={i} onClick={this.handleMasClick.bind(this)} />
    ));
    return (
      <div className="mass">
        {mass}
      </div>
    );
  }
}

class MassPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      massScale: 5,
      max: 1
    };
  }
  handleChangeScale(scale) {
    this.setState({massScale: scale});
  }
  handleChangeMax(max) {
    this.setState({max});
  }
  render() {
    return (
      <div className="mass-page">
        <ScaleInput onChangeValue={this.handleChangeScale.bind(this)} scaleValue={this.state.massScale} />
        <Mass nMas={45} scale={this.state.massScale} max={this.state.max} />
        <MaxInput maxValue={this.state.max} onChangeValue={this.handleChangeMax.bind(this)} />
      </div>
    );
  }
}

class IntroductionPage extends React.Component {
  handleClickLink(pageName) {
    this.props.onChangePage(pageName);
  }
  render() {
    let buttons = ['MassPage', 'CalendarPage'].map(pageName => (
      <li key={pageName}><a href="#" onClick={this.handleClickLink.bind(this, pageName)}>{pageName}</a></li>
    ));
    return (
      <div className="introduction-page">
        <ul className="introduction-buttons">
          {buttons}
        </ul>
      </div>
    );
  }
}

class CalendarPage extends React.Component {
  render() {
    return (<div></div>);
  }
}

class PageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'IntroductionPage'
    };
  }
  handleChangePage(pageName) {
    this.setState({
      currentPage: pageName
    });
  }
  render() {
    let pages = {
      'IntroductionPage': (<IntroductionPage onChangePage={this.handleChangePage.bind(this)} />),
      'MassPage': (<MassPage onChangePage={this.handleChangePage.bind(this)} />),
      'CalendarPage': (<CalendarPage />)
    };
    return pages[this.state.currentPage];
  }
}

let documentReadyPromise = new Promise((resolve, reject) => {
  if(document.readyState == 'complete') resolve();
  document.addEventListener('DOMContentLoaded', () => {
    resolve();
  });
});

documentReadyPromise.then(() => {
  ReactDOM.render(
    (
      <PageContainer />
    ),
    document.querySelector('.app')
  );
});
