import React from "react";
import api from "../services/api"

const Home = () => {
    async function handleSearch(){

      try{
        const response = await api.get('/');
        console.log(response.data)
      }catch{
        alert('Ops! Erro ao buscar')
      }
    }

    return (
      <>
        <button onClick={handleSearch}>Carregar content</button>
        <h1>Home</h1>
      </>
    );
};

export default Home;
