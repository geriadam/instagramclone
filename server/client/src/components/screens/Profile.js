import React, {useEffect, useState, useContext} from 'react'
import axios from 'axios'
import {PROD_URL} from '../../utils/constants'
import M from 'materialize-css'
import {UserContext} from '../../App'

const Profile = () => {
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

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

    useEffect(() => {
        const UpdatePhoto = async (file) => {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "instagramclone")
            data.append("cloud_name", "dtfayaybb")

            try {
                const response = await axios.post("https://api.cloudinary.com/v1_1/dtfayaybb/image/upload", data);
                setUrl(response.data.url)
                localStorage.setItem("user", JSON.stringify({...state, photo: response.data.url}))
                dispatch({type: "UPDATEPIC", payload: response.data.url})
                window.location.reload()
            } catch (error) {
                console.log(error.response)
                //M.toast({html: error.response, classes: "#c62828 red darken-3"})
            }
        }

        if(image){
            UpdatePhoto()
        }
    }, [image])

    const UploadPhoto = (file) => {
        setImage(file)
    }

    return (
        <div style={{margin: "0px auto", maxWidth: "550px" }}>
            <div style={{
                margin: "18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around"
                }}>
                    <div>
                        <img style={{width: "160px", height: "160px", borderRadius: "80px"}} src={state?.photo ?? "http://getdrawings.com/free-icon-bw/generic-avatar-icon-3.png"}/>
                    </div>
                    <div>
                        <h4>{state ? state.name : "Loading"}</h4>
                        <h4>{state ? state.email : "Loading"}</h4>
                        <div style={{display: "flex"}}>
                            <h5>{data.length} Post</h5>
                            <h5>{state?.followers?.length} Follower</h5>
                            <h5>{state?.following?.length} Following</h5>
                        </div>
                    </div>
                </div>
                <div style={{
                    margin: "10px 0px 10px 50px"
                }}>
                    <div className="file-field input-field" style={{margin: "10px"}}>
                        <div className="btn #64b5f6 blue darken-1">
                            <span>Update Pic</span>
                            <input 
                                type="file"
                                onChange={(e) => UploadPhoto(e.target.files[0])}
                            />
                        </div>
                        <div className="file-path-wrapper">
                            <input type="text" className="file-path validate" />
                        </div>
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
