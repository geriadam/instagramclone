import React, {useState, useContext} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import {UserContext} from '../../App'
import axios from 'axios'
import {PROD_URL} from '../../utils/constants'
import M from 'materialize-css'

const NewPassword = () => {
    const history = useHistory()
    const [password, setPassword] = useState("")
    const {token} = useParams()
    console.log(token)
    const PostData = async () => {
        try {
            const response = await axios.post(PROD_URL + "new-password", {
                password: password,
                token
            });
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
                    type="password"
                    placeholder="Enter New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => PostData()}
                >
                    Update Password
                </button>
                <h5><Link to="/signup">Don't have an account ? </Link></h5>
                <h5><Link to="/reset-password">Reset Password</Link></h5>
            </div>
        </div>
    )
}

export default NewPassword;
