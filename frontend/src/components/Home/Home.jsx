import './home.css'

import React, { useState } from 'react'
import Home_header from './Home_header'
import Exploremenu from '../Exploremenu/Exploremenu'
import FoodDisplay from './../FoodDisplay/FoodDisplay';

const Home = () => {

  const [category,setCategory] = useState("All");
  return (
    <div>
      <Home_header/>
      <Exploremenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
    </div>
  )
}

export default Home
