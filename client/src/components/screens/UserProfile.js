import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'
import {PROD_URL} from '../../utils/constants'
import M from 'materialize-css'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null)
    const [post, setPost] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showFollow, setShowFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(PROD_URL + "user/" + userid, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + localStorage.getItem('jwt')
                    }
                });

                setUserProfile(response.data.user)
                setPost(response.data.posts)    
            } catch (error) {
                M.toast({html: "Error get profile data", classes: "#c62828 red darken-3"})
            }
        }

        getData()
    }, [])

    const followUser = async () => {
        try {
            const response = await axios.put(PROD_URL + "follow", {
                followId: userid
            },{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + localStorage.getItem('jwt')
                }
            });

            dispatch({type: "UPDATE", payload: {following: response.data.following, followers: response.data.followers}})
            localStorage.setItem("user", JSON.stringify(response.data))
            setUserProfile((prevState) => {
                return {
                    ...prevState,
                    followers: [...prevState.followers, response.data._id]
                }
            })

            setShowFollow(false)

        } catch (error) {
            M.toast({html: "Error follow user", classes: "#c62828 red darken-3"})
        }
    }

    const unfollowUser = async () => {
        try {
            const response = await axios.put(PROD_URL + "unfollow", {
                unfollowId: userid
            },{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + localStorage.getItem('jwt')
                }
            });

            dispatch({type: "UPDATE", payload: {following: response.data.following, followers: response.data.followers}})
            localStorage.setItem("user", JSON.stringify(response.data))
            setUserProfile((prevState) => {
                const newFollower = prevState.followers.filter(item => item != response.data._id)
                return {
                    ...prevState,
                    followers: newFollower
                }
            })

            setShowFollow(true)

        } catch (error) {
            M.toast({html: "Error follow user", classes: "#c62828 red darken-3"})
        }
    }

    return (
        <div style={{margin: "0px auto", maxWidth: "550px" }}>
            {
                userProfile ?
                <div>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "10px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        <div>
                            <img style={{width: "160px", height: "160px", borderRadius: "80px"}} src={userProfile.photo ?? "http://getdrawings.com/free-icon-bw/generic-avatar-icon-3.png"}/>
                        </div>
                        <div>
                            <h4>{userProfile.name}</h4>
                            <h4>{userProfile.email}</h4>
                            <div style={{display: "flex"}}>
                                <h5>{post.length} Post</h5>
                                <h5>{userProfile?.followers?.length} Follower</h5>
                                <h5>{userProfile?.following?.length} Following</h5>
                            </div>
                            {
                                showFollow ?
                                <button 
                                    style={{margin: "10px"}}
                                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                    onClick={() => followUser()}
                                >
                                    Follow
                                </button> :
                                <button 
                                    style={{margin: "10px"}}
                                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                    onClick={() => unfollowUser()}
                                >
                                    Unfollow
                                </button>
                            }
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
                :
                <div>
                    Loading
                </div>
            }
        </div>
    )
}

export default UserProfile;
