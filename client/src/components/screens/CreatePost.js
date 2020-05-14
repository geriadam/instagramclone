import React from 'react'

const CreatePost = () => {
    return (
        <div className="card input-field"
            style={{
                margin: "10px auto",
                maxWidth: "500px",
                padding: "20px",
                textAlign: "center"
            }}
        >
            <input type="text" placeholder="Title" />
            <input type="text" placeholder="Body" />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>File</span>
                    <input type="file" />
                </div>
                <div className="file-path-wrapper">
                    <input type="text" className="file-path validate" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1">Submit Post</button>

        </div>
    )
}

export default CreatePost;
