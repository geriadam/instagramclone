import React, {useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import axios from 'axios'
import {PROD_URL} from '../../utils/constants'
import M from 'materialize-css'

const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    useEffect(() => {
        const PostData = async () => {
            try {
                const response = await axios.post(PROD_URL + "signup", {
                    name: name,
                    email: email,
                    password: password,
                    pic: url
                });
                M.toast({html: response.data.message, classes: "#43a04 green darken-3"})
                history.push('/signin')
            } catch (error) {
                M.toast({html: error, classes: "#c62828 red darken-3"})
            }
        }

        if(url){
            PostData()
        }
    }, [url])

    const UploadImage = async () => {
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
    }

    return (
        <div className="myCard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input 
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input 
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload Profile Image</span>
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
                    onClick={() => UploadImage()}
                >
                    Signup
                </button>
                <h5><Link to="/signin">Already Have an Account ? </Link></h5>
            </div>
        </div>
    )
}

export default Signup;
