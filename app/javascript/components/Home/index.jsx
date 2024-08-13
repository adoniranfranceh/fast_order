import React from "react"
import { Button, OrderList } from "../index.js"
import { StyledHome, StyledButton } from './style'

const handleNewOrderClick = () => {
  console.log('clicou')
}

const Home = () => {
  return (
    <StyledHome>
      <StyledButton> 
        <Button primary onClick={handleNewOrderClick}>
          Novo pedido
        </Button>
      </StyledButton>
      <OrderList></OrderList>
    </StyledHome>
  )
}

export default Home;
