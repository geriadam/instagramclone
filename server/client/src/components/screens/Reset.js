import React, {useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import axios from 'axios'
import {PROD_URL} from '../../utils/constants'
import M from 'materialize-css'

const Reset = () => {
    const history = useHistory()
    const [email, setEmail] = useState("")
    const PostData = async () => {
        try {
            const response = await axios.post(PROD_URL + "reset-password", {
                email: email
            });
            console.log(response);
            M.toast({html: response.data.message, classes: "#43a04 green darken-3"})
            history.push('/signin')
        } catch (error) {
            M.toast({html: error.response.data.message, classes: "#c62828 red darken-3"})
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
                <button 
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => PostData()}
                >
                    Reset Password
                </button>
            </div>
        </div>
    )
}

export default Reset;
