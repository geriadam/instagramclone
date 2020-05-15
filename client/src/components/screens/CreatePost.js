import React, {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import axios from 'axios'
import {PROD_URL} from '../../utils/constants'
import M from 'materialize-css'

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    const PostDetails = async () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "instagramclone")
        data.append("cloud_name", "dtfayaybb")

        try {
            const response = await axios.post("https://api.cloudinary.com/v1_1/dtfayaybb/image/upload", data);
            setUrl(response.data.url)
        } catch (error) {
            console.log(error.response)
            //M.toast({html: error.response, classes: "#c62828 red darken-3"})
        }

        try {
            const response = await axios.post(PROD_URL + "createpost", {
                title: title,
                body: body,
                pic: url
            });
            M.toast({html: response.data.message, classes: "#43a04 green darken-3"})
            history.push('/')
        } catch (error) {
            M.toast({html: error.response.data.error, classes: "#c62828 red darken-3"})
        }
    }

    return (
        <div className="card input-field"
            style={{
                margin: "10px auto",
                maxWidth: "500px",
                padding: "20px",
                textAlign: "center"
            }}
        >
            <input 
                type="text" 
                placeholder="Title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input 
                type="text"
                placeholder="Body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>File</span>
                    <input 
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input type="text" className="file-path validate" />
                </div>
            </div>
            <button 
                className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={() => PostDetails()}
            >
                Submit Post
            </button>

        </div>
    )
}

export default CreatePost;
