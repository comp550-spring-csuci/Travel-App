import React from "react";
import './about.css';

function About() {
    return(
        <>
        <div id="about">
            <div className="container">
                <div className="about-container">
                    <div className="about-content-left">
                        <h5>Established in 2025</h5>
                        <h1>All about The Trvl App</h1>
                        <p className="about-p">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Laudantium praesentium vitae nemo cum eum, 
                            autem deserunt quaerat commodi, ullam tempora 
                            dicta non sequi, laborum iste! Veritatis ut 
                            aspernatur expedita quasi maxime temporibus, 
                            ipsum fugiat consequuntur.
                        </p>
                        <p>
                            Lorem ipsum dolor, sit amet consectetur
                            adipisicing elit. Saepe impedit ea, cum 
                            ipsa praesentium explicabo blanditiis 
                            velit! Soluta, ab placeat?
                        </p>
                        <button className="about-btn">Learn More</button>
                    </div>
                    <div className="about-content-right">
                        <img src="images/about-the-trvl-app.jpg" className="images" 
                        alt="The-Trvl-App" />
                    </div>
                </div>
            </div>
        </div>
        </>
    )

}

export default About;