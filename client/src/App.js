import React, { useEffect, useState } from "react";
import "./App.css";
import socket from "./utils/socketConnection";
import Widget from "./components/Widget";

function App() {
  let [perfData, setPerfData] = useState({});
  useEffect(() => {
    socket.emit("clientAuth", "uiClient");
  }, []);
  //get data
  useEffect(() => {
    socket.on("data", (data) => {
      setPerfData({ ...perfData, [data.macAddress]: data });
    });
  }, [perfData]);
  let renderWidgets = () => {
    return Object.values(perfData).map((widget) => {
      return <Widget key={widget.macAddress} data={widget} />;
    });
  };
  return (
    <div className="App">
      <h1>Wolf is Here</h1>
      {renderWidgets()}
    </div>
  );
}

export default App;
