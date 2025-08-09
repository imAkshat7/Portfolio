import { useState } from 'react';
import { About,Footer,Header,Project,Skill} from './container';
import { Navbar } from './components/Navbar';
import './App.scss';
import './enhanced-styles.scss';

const App = () => {
  return (
    <div className="app">
      <Navbar/>
      <Header/>
      <About/>
      <Project/>
      <Skill/>
      <Footer/>  
      </div>
  )
}

export default App 