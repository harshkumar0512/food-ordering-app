import './Header.css';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import img from '../../assets/profilepic.jpeg';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';

const Header = (props) => {

    const [anchorEl, setAnchorE1] = React.useState(null)

    const handleClick = (event) => {
        setAnchorE1(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorE1(null);
    };

    const logOutHandler = () => {
        sessionStorage.removeItem("access-token")
    }

    const searchItems = (e) => {
        props.filterCaptions(e.target.value)
    }

    return (
        <div className="header unselectable">
            <div className="innerHeader" to="/home">
                {window.location.pathname === "/profile" ?
                    <Link to={"/home"} className="logo" style={{ textDecoration: "none" }}>
                        Image Viewer
                    </Link> :
                    <div className="logo">
                        Image Viewer
                    </div>
                }
                <div className="loggedInUserOptions">
                    {props.dispalySearchBar && <div className="search">
                        <div className="searchIcon">
                            <SearchIcon />
                        </div>
                        <Input disableUnderline={true} placeholder="Search…" onChange={searchItems} />
                    </div>}
                    {props.displayUserProfileIcon && <div>
                        <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} size="small">
                            <Avatar src={img}></Avatar>
                        </IconButton>
                        {window.location.pathname === "/home" ?
                            <Menu
                                id="profileMenu"
                                anchorEl={anchorEl}
                                getContentAnchorEl={null}
                                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                transformOrigin={{ vertical: "top", horizontal: "center" }}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem component={Link} to={"/profile"} onClick={handleClose}>My Account</MenuItem>
                                <hr className="menuItemSeperator" />
                                <MenuItem component={Link} to={"/"} onClick={() => {
                                    handleClose();
                                    logOutHandler();
                                }}>Logout</MenuItem>
                            </Menu>
                            :
                            <Menu
                                id="profileMenu"
                                anchorEl={anchorEl}
                                getContentAnchorEl={null}
                                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                transformOrigin={{ vertical: "top", horizontal: "center" }}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem component={Link} to={"/"} onClick={() => {
                                    handleClose();
                                    logOutHandler();
                                }}>Logout</MenuItem>
                            </Menu>
                        }
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default Header;