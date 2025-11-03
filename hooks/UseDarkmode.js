import React from 'react'
import {useSelector} from 'react-redux'

const UseDarkmode = (dark, light) => {
  const {darkMode} = useSelector(state => state.config)
  return  darkMode ? dark : light

}

export default UseDarkmode