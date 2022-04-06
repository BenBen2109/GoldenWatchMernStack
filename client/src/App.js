import React from "react";
import {BrowserRouter as Router} from 'react-router-dom'
import {DataProvider} from './GlobalState'
import Header from './components/headers/Header'
import MainPages from './components/mainpages/Pages'
import Footers from './components/footers/Footer'

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
            <Header />
            <MainPages />
            <Footers />
         </div>
      </Router> 
    </DataProvider> 
  );
}

export default App;
