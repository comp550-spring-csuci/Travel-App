import React, {useState} from "react";
import './newsletter.css';

function Newsletter(){
    return( 
        <>
        <div id="newsletter">
            <div className="newsletter-content">
                <h1>Become part of the Trvl App</h1>
                <p> Lorem ipsum, dolor sit amet consectetur 
                    adipisicing elit. Animi reiciendis, quis
                    laudantium sunt fugit unde! </p>
                    <button className="login/signup-btn">Join the Trvl App</button>
            </div>
        </div>
        </>
    )
}

export default Newsletter;