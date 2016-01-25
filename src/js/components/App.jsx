import React from 'react';
import d3Array from 'd3-array';
import ResponsiveTransitionMotionGrid from './ResponsiveTransitionMotionGrid';
import MeasuredTransitionMotionGrid from './MeasuredTransitionMotionGrid';
import TransitionMotionGrid from './TransitionMotionGrid';

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
      .sort()
      .map(letter => {
        return {
          letter,
          number: Math.floor(Math.random() * 100)
        };
      });
  },

  render() {
    const items = this.state.data.map(d => {
      // const height = (d.letter.charCodeAt(0) % 3) * 50 + 100;
      const content = ipsum.slice(0, (d.letter.charCodeAt(0) % 3 + 1) * 50);

      return (
        <li
          className="grid-item"
          // style={{ height }}
          key={d.letter}
          // itemHeight={height}
        >
          <h3>{d.letter.toUpperCase()} - {parseInt(d.number, 10)}</h3>
          <p>{content}</p>
        </li>
      );
    });

    return (
      <div>
        <button
          onClick={this.handleShuffle}
        >Randomize</button>
        <ResponsiveTransitionMotionGrid
          columnWidth={200}
          gutterWidth={10}
          defaultColumns={4}
          maxWidth={1920}
          minPadding={100}
        >
          <MeasuredTransitionMotionGrid
            className="grid"
            component="ul"
            gutterHeight={10}
            springConfig={[60, 9]}
          >
            {items}
          </MeasuredTransitionMotionGrid>
        </ResponsiveTransitionMotionGrid>
      </div>
    );
  }
});
