import React from "react";
import './Landingpage.css';


function LandingPage(){
    return(
        <>
        <div className="landingpage-container">
            <div className="landingpage-content">
                <h1> The Trvl App </h1>
                <h3> Where will the road take you next?</h3>
            </div>
            <div className="arrow bounce"><i className="fa fa-angle-down fa-5x"></i></div>
            <video autoPlay muted loop id="myVideo">
                <source src="videos/roads.mp4"/>
            </video>
        </div>
        
        </>

    )

}
export default LandingPage;