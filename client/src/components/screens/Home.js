import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'
import axios from 'axios'
import {PROD_URL} from '../../utils/constants'
import M from 'materialize-css'
import {Link} from 'react-router-dom'

const Home = () => {
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(PROD_URL + "allpost", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + localStorage.getItem('jwt')
                    }
                });

                setData(response.data.posts)
            } catch (error) {
                M.toast({html: error.response.data.message, classes: "#c62828 red darken-3"})
            }
        }

        getData()
    }, [])

    const likePost = async (id) => {
        try {
            const response = await axios.put(PROD_URL + "like", {
                postId: id
            },{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + localStorage.getItem('jwt')
                }
            });
            const newData = data.map(item => {
                if(item._id == response.data._id){
                    return response.data
                } else {
                    return item
                }
            })
            setData(newData)
        } catch (error) {
            M.toast({html: error.response.data.message, classes: "#c62828 red darken-3"})
        }
    }

    const unlikePost = async (id) => {
        try {
            const response = await axios.put(PROD_URL + "unlike", {
                postId: id
            },{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + localStorage.getItem('jwt')
                }
            });
            const newData = data.map(item => {
                if(item._id == response.data._id){
                    return response.data
                } else {
                    return item
                }
            })

            setData(newData)
        } catch (error) {
            M.toast({html: error.response.data.message, classes: "#c62828 red darken-3"})
        }
    }

    const makeComment = async (text, postId) => {
        try {
            const response = await axios.put(PROD_URL + "comment", {
                postId,
                text
            },{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + localStorage.getItem('jwt')
                }
            });

            console.log(response.data)

            const newData = data.map(item => {
                if(item._id == response.data._id){
                    return response.data
                } else {
                    return item
                }
            })

            setData(newData)
        } catch (error) {
            M.toast({html: error, classes: "#c62828 red darken-3"})
        }
    }

    const deletePost = async (postId) => {
        try {
            const response = await axios.delete(PROD_URL + `deletepost/${postId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + localStorage.getItem('jwt')
                }
            });
            const newData = data.filter(item => {
                return item._id !== response.data.data._id
            })
            setData(newData)
            M.toast({html: response.data.message, classes: "#43a04 green darken-3"})
        } catch (error) {
            M.toast({html: error, classes: "#c62828 red darken-3"})
        }   
    }

    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5>
                                <Link to={item.postedBy._id != state._id ? "/profile/" + item.postedBy._id : "/profile"}>
                                    {item.postedBy.name}
                                </Link>
                                {
                                    item.postedBy._id === state._id &&
                                    <i 
                                        className="material-icons"
                                        style={{float: "right"}}
                                        onClick={() => deletePost(item._id)}
                                    >
                                        delete
                                    </i>
                                }
                            </h5>
                            <dvi className="card-image">
                                <img src={item.photo} alt="" />
                            </dvi>
                            <div className="card-content">
                                <i className="material-icons">favorite</i>
                                {
                                    item.likes.includes(state._id)
                                    ?
                                    <i
                                        className="material-icons"
                                        onClick={() => unlikePost(item.id)}
                                    >
                                        thumb_down
                                    </i>
                                    :
                                    <i
                                        className="material-icons"
                                        onClick={() => likePost(item.id)}
                                    >
                                        thumb_up
                                    </i>
                                }
                                <h6>{item.likes.length}</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(comment => {
                                        return (
                                            <h6 key={comment._id}>
                                                <span style={{fontWeight: "500"}}>{comment.postedBy.name} </span>
                                                {comment.text}
                                            </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type="text" placeholder="add a comment"/>
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home;
