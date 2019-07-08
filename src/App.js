import React from 'react';
import IncrementalSearch from "./components/IncrementalSearch";

export default class App extends React.Component {
  render() {
    return (
        <div style={{ position: 'relative' }}>
          <IncrementalSearch />
      </div>
    );
  }
}