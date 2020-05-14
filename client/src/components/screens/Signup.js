import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {PROD_URL} from '../../utils/constants'
import $ from "jquery";
import M from 'materialize-css'

const Signup = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const PostData = async () => {
        try {
            const response = await axios.post(PROD_URL + "signup", {
                name: name,
                email: email,
                password: password
            });
            M.toast({html: response.data.message, classes: "#43a04 green darken-3"})
        } catch (error) {
            M.toast({html: error.response.data.error, classes: "#c62828 red darken-3"})
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
                    type="text"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => PostData()}
                >
                    Signup
                </button>
                <h5><Link to="/signin">Already Have an Account ? </Link></h5>
            </div>
        </div>
    )
}

export default Signup;
