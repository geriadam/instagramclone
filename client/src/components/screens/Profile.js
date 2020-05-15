import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'
import {PROD_URL} from '../../utils/constants'
import M from 'materialize-css'
import {UserContext} from '../../App'

const Profile = () => {
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(PROD_URL + "mypost", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + localStorage.getItem('jwt')
                    }
                });

                setData(response.data.posts)
            } catch (error) {
                M.toast({html: "Cannot get post data", classes: "#c62828 red darken-3"})
            }
        }

        getData()
    }, [])

    return (
        <div style={{margin: "0px auto", maxWidth: "550px" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "10px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div>
                    <img style={{width: "160px", height: "160px", borderRadius: "80px"}} src="https://geriadam.github.io/assets/images/profile.png"/>
                </div>
                <div>
                    <h4>{state ? state.name : "Loading"}</h4>
                    <div style={{display: "flex"}}>
                        <h5>5 Post</h5>
                        <h5>5 Follower</h5>
                        <h5>5 Following</h5>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    data.map(item => {
                        return (
                            <img key={ item._id } className="item" src={ item.photo } alt={item.title}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile;
