import React from 'react';
import d3Array from 'd3-array';
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
      data: this.generateData()
    };
  },

  handleShuffle() {
    this.setState({
      data: this.generateData()
    });
  },

  generateData() {
    return d3Array.shuffle(alphabet)
      .slice(0, this.props.minItems +
        Math.floor(Math.random() * (26 - this.props.minItems)))
      .sort();
  },

  render() {
    const items = this.state.data.map(letter => {
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
        <button
          onClick={this.handleShuffle}
        >Randomize</button>
        <Grid
          // useCSS
          // duration={800}
          measured
          responsive
          layout="pinterest"
          enterExitStyle="simple"
        >
          {items}
        </Grid>
      </div>
    );
  }
});
