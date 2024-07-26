import React, {useState, useEffect} from "react";
import api from "../services/api"

const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData(){

      try{
        const response = await api.get('/');
        console.log(response.data)
      }catch{
        alert('Ops! Erro ao buscar')
      }
    }

    fetchData();
  })

    return (
      <>
        <h1>Home</h1>
      </>
    );
};

export default Home;
