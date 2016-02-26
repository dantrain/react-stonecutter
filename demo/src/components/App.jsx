import React from 'react';
import RadioGroup from 'react-radio-group';
import Slider from 'rc-slider';
import shuffle from 'lodash.shuffle';
import camelCase from 'lodash.camelcase';
import Grid from './Grid';
import { easings } from '../../../lib/react-brickwork';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

const ipsum = `Hashtag hoodie food truck XOXO gastropub asymmetrical
Viral actually sartorial thundercats fixie next level Ethical skateboard
put a bird on it bespoke, brunch small batch photo booth fashion axe
actually cronut poutine fanny pack microdosing church-key Post-ironic
90's pug, master cleanse keytar normcore aesthetic viral crucifix selvage
gastropub Echo park yr organic typewriter blog Health goth literally
cornhole microdosing fanny pack, bespoke kinfolk heirloom ennui viral
dreamcatcher Offal VHS helvetica meh`.split(' ');

const layouts = ['Pinterest', 'Simple'];
const enterExitStyles = ['Simple', 'Skew', 'Newspaper',
  'Fold Up', 'From Center', 'From Left to Right', 'From Top', 'From Top to Bottom'];

export default React.createClass({

  getDefaultProps() {
    return {
      minItems: 10
    };
  },

  getInitialState() {
    return {
      data: this.generateData(),
      useCSS: false,
      measured: true,
      responsive: false,
      layout: camelCase(layouts[0]),
      enterExitStyle: camelCase(enterExitStyles[0]),
      duration: 800,
      stiffness: 60,
      damping: 14,
      gutters: 5,
      easing: easings.quartOut
    };
  },

  handleShuffle() {
    this.setState({
      data: this.generateData()
    });
  },

  generateData() {
    return shuffle(alphabet)
      .slice(0, this.props.minItems +
        Math.floor(Math.random() * (26 - this.props.minItems)))
      .sort();
  },

  render() {
    const { data, ...gridProps } = this.state;
    const { useCSS, layout, enterExitStyle, responsive, gutters,
      stiffness, damping, duration, easing } = this.state;

    const itemHeight = layout === 'simple' ? 215 : null;

    const items = data.map(letter => {
      const contentIndex = letter.charCodeAt(0) % 5 + 1;
      const content = ipsum.slice(contentIndex * 5, contentIndex * 9).join(' ');

      return (
        <li
          className="grid-item"
          key={letter}
          style={{
            width: 150,
            height: itemHeight
          }}
        >
          <h3>{letter.toUpperCase()}</h3>
          <p>{content}</p>
        </li>
      );
    });

    return (
      <div>
        <div>
          <RadioGroup
            name="useCSS"
            selectedValue={useCSS ? 'css' : 'spring'}
            onChange={value => this.setState({ useCSS: value === 'css' })}
          >
            {Radio => (
              <div>
                <label><Radio value="spring" />React Motion</label>
                <label><Radio value="css" />CSS Transitions</label>
              </div>
            )}
          </RadioGroup>
          <label>{'Layout '}
            <select
              value={layout}
              onChange={ev => this.setState({ layout: ev.target.value })}
            >
              {layouts.map(name =>
                <option value={camelCase(name)} key={name}>{name}</option>)}
            </select>
          </label>
          <label>{'Enter/Exit Style '}
            <select
              value={enterExitStyle}
              onChange={ev => this.setState({ enterExitStyle: ev.target.value })}
            >
              {enterExitStyles.map(name =>
                <option value={camelCase(name)} key={name}>{name}</option>)}
            </select>
          </label>
          <label>{'Easing '}
            <select
              value={easing}
              onChange={ev => this.setState({ easing: ev.target.value })}
              disabled={!useCSS}
            >
              {Object.keys(easings).map(name =>
                <option value={easings[name]} key={name}>{name}</option>)}
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={responsive}
              onChange={ev => this.setState({ responsive: ev.target.checked })}
            />Responsive
          </label>
          <div className="slider">{'Gutters '}
            <div className="slider-container">
              <Slider
                value={gutters}
                onChange={val => this.setState({ gutters: val })}
                min={0}
                max={20}
                tipFormatter={val => `${val}px`}
              />
            </div>
          </div>
          <div className="slider">{'Stiffness '}
            <div className="slider-container">
              <Slider
                value={stiffness}
                onChange={val => this.setState({ stiffness: val })}
                min={0}
                max={300}
                disabled={useCSS}
              />
            </div>
          </div>
          <div className="slider">{'Damping '}
            <div className="slider-container">
              <Slider
                value={damping}
                onChange={val => this.setState({ damping: val })}
                min={0}
                max={40}
                disabled={useCSS}
              />
            </div>
          </div>
          <div className="slider">{'Duration '}
            <div className="slider-container">
              <Slider
                value={duration}
                onChange={val => this.setState({ duration: val })}
                min={100}
                max={2000}
                step={10}
                disabled={!useCSS}
                tipFormatter={val => `${val}ms`}
              />
            </div>
          </div>
          <button
            onClick={this.handleShuffle}
          >Randomize</button>
        </div>
        <Grid
          itemHeight={itemHeight}
          {...gridProps}
        >
          {items}
        </Grid>
      </div>
    );
  }
});
