import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {PROD_URL} from '../../utils/constants'
import M from 'materialize-css'

const Home = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(PROD_URL + "allpost", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + localStorage.getItem('jwt') //the token is a variable which holds the token
                    }
                });

                setData(response.data.posts)
            } catch (error) {
                M.toast({html: error.response.data.message, classes: "#c62828 red darken-3"})
            }
        }

        getData()
    }, [])
    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5>{item.postedBy.name}</h5>
                            <dvi className="card-image">
                                <img src={item.photo} alt="" />
                            </dvi>
                            <div className="card-content">
                                <i className="material-icons">favorite</i>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                <input type="text" placeholder="add a comment" />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home;
