import React from 'react';
import RadioGroup from 'react-radio-group';
import shuffle from 'lodash.shuffle';
import Grid from './Grid';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

const ipsum = `Hashtag hoodie food truck XOXO gastropub asymmetrical.
Viral actually sartorial thundercats fixie next level. Ethical skateboard
put a bird on it bespoke, brunch small batch photo booth fashion axe
actually cronut poutine fanny pack microdosing church-key. Post-ironic
90's pug, master cleanse keytar normcore aesthetic viral crucifix selvage
gastropub. Echo park yr organic typewriter blog. Health goth literally
cornhole microdosing fanny pack, bespoke kinfolk heirloom ennui viral
dreamcatcher. Offal VHS helvetica meh.`;

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
      responsive: true,
      layout: 'pinterest',
      enterExitStyle: 'simple',
      duration: 800,
      stiffness: 60,
      damping: 14
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

    const items = data.map(letter => {
      const content = ipsum.slice(0, (letter.charCodeAt(0) % 3 + 1) * 50);

      return (
        <li
          className="grid-item"
          key={letter}
          style={{ width: 150 }}
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
            selectedValue={this.state.useCSS ? 'css' : 'spring'}
            onChange={value => this.setState({ useCSS: value === 'css' })}
          >
            {Radio => (
              <div>
                <label><Radio value="spring" />React Motion</label>
                <label><Radio value="css" />CSS Transitions</label>
              </div>
            )}
          </RadioGroup>
          <label>
            <input
              type="checkbox"
              checked={this.state.responsive}
              onChange={ev => this.setState({ responsive: ev.target.checked })}
            />Responsive
          </label>
          <button
            onClick={this.handleShuffle}
          >Randomize</button>
        </div>
        <Grid
          {...gridProps}
        >
          {items}
        </Grid>
      </div>
    );
  }
});
