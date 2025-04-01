import React from "react";
import { AppContext } from '../lib'

export default class NavbarSI extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        if (event.target === event.currentTarget) {
            this.setState({ isOpen: !this.state.isOpen });
        }
    }

    render() {
        return (
            <nav className="container-fluid nav-container">
                <div className="white row align-items-center p-3">
                    <div className="col-1 croissant brand">Travel</div>
                    <div className="col-1">
                        <a href="#sign-up" className="nav-links p-5">Register</a>
                    </div>
                    <div className="col-1">
                        <a href="#sign-in" className="nav-links p-4">Login</a>
                    </div>
                </div>
            </nav>
        )
    }
}

NavbarSI.contextType = AppContext;