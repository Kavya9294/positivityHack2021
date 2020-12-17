
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// Include only the reset
import 'instantsearch.css/themes/reset.css';
// or include the full Algolia theme
import 'instantsearch.css/themes/algolia.css';

import {Row,Container,Col,Image} from 'react-bootstrap';

import Navibar from "./Navibar.js";
import NewsComponent from "./NewsComponent.js";

// import { useState, useEffect } from 'react';

function App() {

  // const [currentTime, setCurrentTime] = useState(0);

  // useEffect(() => {
  //   fetch('/time').then(res => res.json()).then(data => {
  //     setCurrentTime(data.time);
  //   });
  // }, []);
  return (
    <div className="App">
        <Navibar></Navibar>
        <NewsComponent title="December Holidays around the World" url="https://worldstrides.com/blog/2015/12/december-holidays-around-the-world/" sentiment="think" trust_score="20"></NewsComponent>
      
    </div>
  );
}

export default App;
