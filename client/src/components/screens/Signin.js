import React, {useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import axios from 'axios'
import {PROD_URL} from '../../utils/constants'
import M from 'materialize-css'

const Signin = () => {
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const PostData = async () => {
        try {
            const response = await axios.post(PROD_URL + "signin", {
                email: email,
                password: password
            });
            localStorage.setItem("jwt", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))
            dispatch({type: "USER", payload: response.data.user})
            M.toast({html: response.data.message, classes: "#43a04 green darken-3"})
            history.push('/')
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
                <button 
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => PostData()}
                >
                    Signin
                </button>
                <h5><Link to="/signup">Don't have an account ? </Link></h5>
            </div>
        </div>
    )
}

export default Signin;
