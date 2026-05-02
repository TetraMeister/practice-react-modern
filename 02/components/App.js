// ./src/components/App.js
import React from "react";
import Box from "./Box";

class App extends React.Component {
  state = {
    text: "React HelloWorld Modern!",
  };

  render() {
    const { text } = this.state;

    return <Box text={text} />;
  }
}

export default App;
