import React from 'react';

export default React.createClass({

  render() {
    const items = this.props.data.map((d, i) =>
          <li
            style={{
              top: `${i * 40}px`
            }}
          >{d.letter.toUpperCase()} - {d.number}</li>);

    return (
      <ul>
        {items}
      </ul>
    );
  }

});
