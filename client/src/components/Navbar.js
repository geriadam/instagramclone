import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import {UserContext} from '../App'

const Navbar = () => {
    const {state, dispatch} = useContext(UserContext)
    const renderList = () => {
        if(state){
            return (
                <div>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/createpost">Create Post</Link></li>
                </div>
            )
        } else {
            return (
                <div>
                    <li><Link to="/signin">Signin</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                </div>
            )
        }
    }
    return (
        <nav>
            <div className="nav-wrapper white" style={{color: "black"}}>
                <Link to={state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;
