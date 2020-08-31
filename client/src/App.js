import React from "react";
import socket from "./utils/socket";

import Widget from "./components/Widget/Widget";

class App extends React.Component {
  state = {
    perfData: {},
  };
  componentDidMount() {
    socket.emit("clientAuth", "uiClient");
    socket.on("data", (data) => {
      this.setState({ perfData: { [data.macAddress]: data } });
    });
  }

  renderWidgets() {
    return Object.values(this.state.perfData).map((data) => (
      <Widget key={data.macAddress} data={data} />
    ));
  }

  render() {
    return <div className="container">{this.renderWidgets()}</div>;
  }
}

export default App;
