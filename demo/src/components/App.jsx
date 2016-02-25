import React from 'react';
import RadioGroup from 'react-radio-group';
import Slider from 'rc-slider';
import shuffle from 'lodash.shuffle';
import camelCase from 'lodash.camelcase';
import Grid from './Grid';

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
      gutters: 5
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
    const { useCSS, layout, enterExitStyle, responsive, gutters } = this.state;

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
          <label>
            <input
              type="checkbox"
              checked={responsive}
              onChange={ev => this.setState({ responsive: ev.target.checked })}
            />Responsive
          </label>
          <div>{'Gutters '}
            <div className="slider-container">
              <Slider
                value={gutters}
                onChange={val => this.setState({ gutters: val })}
                min={0}
                max={20}
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
