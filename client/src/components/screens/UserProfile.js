import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'
import {PROD_URL} from '../../utils/constants'
import M from 'materialize-css'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState([])
    const [post, setPost] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(PROD_URL + "user/" + userid, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + localStorage.getItem('jwt')
                    }
                });

                console.log(response.data)

                setUserProfile(response.data.user)
                setPost(response.data.posts)
            } catch (error) {
                M.toast({html: "Error get profile data", classes: "#c62828 red darken-3"})
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
                    <h4>{userProfile.name}</h4>
                    <div style={{display: "flex"}}>
                        <h5>{post.length} Post</h5>
                        <h5>5 Follower</h5>
                        <h5>5 Following</h5>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    post.map(item => {
                        return (
                            <img key={ item._id } className="item" src={ item.photo } alt={item.title}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default UserProfile;
