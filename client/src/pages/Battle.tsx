import React from 'react'
import { useParams } from 'react-router-dom'

const Battle = () => {
    const {id} = useParams();

  return (
    <div>{id}</div>
  )
}

export default Battle