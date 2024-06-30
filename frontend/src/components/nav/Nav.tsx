import React, { useContext, useEffect, useState } from 'react';
import "./nav.css";
import { FiSidebar } from "react-icons/fi";
import { IoCreateOutline } from "react-icons/io5";
import { FaAngleDown, FaCheck, FaKey, FaTimes } from "react-icons/fa";
import avatar from "../../assets/images/bro.jpg";
import { IoIosSettings } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { RiRobot3Line } from "react-icons/ri";
import { AiOutlineRobot } from "react-icons/ai";
import { IoReorderThree } from "react-icons/io5";

// Modal material UI
import Modal from '@mui/material/Modal';
import { GlobalContext } from '../../App';
import { BarItems } from './sidenav/Sidenav';

const style = {
};

interface SettingsType {
    paramOpen: boolean;
    handleClose: () => void;
}

export interface ThemeDropdownProps {
    open: boolean;
    handleClose: () => void;
}

const ThemeDropdown = ({ open, handleClose }: ThemeDropdownProps) => {
    const globalContext = useContext(GlobalContext)
    const setTheme = globalContext!.setTheme
    const theme = globalContext!.theme


    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (!event.target.closest('.theme-dropdown')) {
                handleClose();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [handleClose]);

    return (
        <div className={`theme-dropdown ${open ? '' : 'hidden'}`}>
            <div className="dropdown-item" onClick={() => { setTheme("light") }}>Light {theme==="light" && (<FaCheck/>)}</div>
            <div className="dropdown-item" onClick={() => { setTheme("dark") }}>Dark {theme==="dark" && (<FaCheck/>)}</div>
        </div>
    );
};



const Settings = ({ paramOpen, handleClose }: SettingsType) => {
    const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
    const [copied, setCopied] = useState(false)
    const [active, SetActive] = useState(false)
    const globalContext = useContext(GlobalContext)


    function copyText(str: string) {
        var copyText: any = document.getElementById(str);

        copyText!.select();
        copyText!.setSelectionRange(0, 99999); // For mobile devices

        if (navigator.clipboard) {
            navigator.clipboard.writeText(copyText.value).then(() => {
                setCopied(true)
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }
        else {
            document.execCommand("copy");
            setCopied(true)

        }
    }

    const theme = globalContext?.theme
    const setTheme = globalContext?.setTheme

    const handleThemeClick = (event: any) => {
        event.stopPropagation();
        setThemeDropdownOpen(!themeDropdownOpen);
    };

    const handleThemeClose = () => {
        setThemeDropdownOpen(false);
    };


    return (
        <Modal
            open={paramOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className="settings-1">
                <div className="settings-top">
                    <h3>Settings</h3>
                    <p onClick={handleClose}><span><FaTimes /></span></p>
                </div>
                <div className="settings-body">
                    <div className="fl-lft-1">
                        <p onClick={() => { SetActive(false) }}><span><IoIosSettings /></span> <div>Settings</div></p>
                        <p onClick={() => { SetActive(true) }}><span><FaKey /></span> <div>API key</div></p>
                    </div>
                    <div className="fl-rht-1">
                        <div className={`rg-shp-items ${active ? 'hidden' : ''}`}>
                            <p>Theme</p>
                            <p onClick={handleThemeClick} style={{
                                textTransform: "capitalize",
                                cursor: "pointer"
                            }}>{theme} <span><FaAngleDown /></span></p>
                            <ThemeDropdown open={themeDropdownOpen} handleClose={handleThemeClose} />
                        </div>
                        <div className={`rg-shp-items ${active ? 'hidden' : ''}`}>
                            <p>Language</p>
                            <p>English <span><FaAngleDown /></span></p>
                        </div>
                        <div className={`rg-shp-items ${active ? 'hidden' : ''}`}>
                            <p>Harrasment</p>
                            <input type="range" min={1} max={5} />
                        </div>
                        <div className={`rg-shp-items ${active ? 'hidden' : ''}`}>
                            <p>Hate speech</p>
                            <input type="range" min={1} max={5} />
                        </div>
                        <div className={`rg-shp-items ${active ? 'hidden' : ''}`}>
                            <p>Sexually explicit</p>
                            <input type="range" min={1} max={5} />
                        </div>
                        <div className={`rg-shp-items ${active ? 'hidden' : ''}`}>
                            <p>Dangerous content</p>
                            <input type="range" min={1} max={5} />
                        </div>
                        <div className={`rg-shp-items ${active ? 'hidden' : ''}`}>
                            <p>Delete all projects</p>
                            <button>Delete all</button>
                        </div>

                        <div className={`sect-api ${!active ? 'hidden' : ''}`}>
                            <p><span>Your API key: </span><input type="text" id='apikey' value={"fseufq3y7nf85y4rff78obdcvsrgj44r3r2e2twtyt"} /></p>
                            <div className="cto-comp">
                                <button className='blue-bg' onClick={() => {
                                    copyText("apikey")
                                }}>{copied ? 'Copied' : 'Copy key'}</button>
                                <button className='blue-bg'>Generate new key</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

const Mob = () => {
    return (
        <div className="mb-nv-cards">
            <p className="h-22">Today</p>
            <div className="mb-boss-card">
                <p className="mb-bs-1">Integrate JWT tokens in django project</p>
                <p className="mb-bs-1">Integrate JWT tokens in django project</p>
                <p className="mb-bs-1">Integrate JWT tokens in django project</p>
                <p className="mb-bs-1">Integrate JWT tokens in django project</p>
                <p className="mb-bs-1">Integrate JWT tokens in django project</p>
            </div>

        </div>
    )
}

const Nav = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [mbnav, setMbnav] = useState(false)
    const globalContext = useContext(GlobalContext)
    const setClose = globalContext!.setClose
    const close = globalContext!.close

    const wait = () => {
        setTimeout(() => {
            document.querySelector("#bossboss")?.classList.add("hidden")
            document.querySelector("#sidenav")?.classList.add("hidden")
        }, 230)
    }


    useEffect(() => {

        if (close) {
            wait()
        }
        const handleClickOutside = (event: any) => {
            if (!event.target.closest('.avatar-img') && !event.target.closest('.modal-nav-content')) {
                setDropdownOpen(false);
            }
        };

        const handleClickOutside2 = (event: any) => {
            if (!event.target.closest('.fa-33') && !event.target.closest('.mobile-side-nav')) {
                setMbnav(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('click', handleClickOutside2);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };



    }, [[close]]);

    const handleAvatarClick = (event: any) => {
        event.stopPropagation(); // Prevent the event from bubbling up to the document
        setDropdownOpen((prev) => !prev);
    };

    const handleSettingsClick = () => {
        setSettingsOpen(true);
    };

    const handleSettingsClose = () => {
        setSettingsOpen(false);
    };

    return (
        <nav>
            <div className="container">

                {/* ################################################ */}
                <div className="mobile-nav">
                    <p className='fa-33' onClick={() => { setMbnav(prev => !prev) }}><IoReorderThree /></p>
                    <div className="mb-nav-title"><span>Gemini 1.5 pro </span><span><FaAngleDown /></span></div>
                    <a href='/'><p className="fa-cr" ><IoCreateOutline /></p></a>
                </div>

                <div className={`mobile-side-nav ${mbnav ? 'fade-right flex' : 'fade-left flex'}`} >
                    <div className="m-abeg">
                        <div className="mb-111-1">
                            <span onClick={() => { setMbnav(prev => !prev) }}><FaTimes /></span>
                            {/* <span><IoCreateOutline /></span> */}
                            <a href='#'>Stellarcode</a>
                        </div>
                        <div className="mb-snt">
                            <Mob />
                            <Mob />
                        </div>
                    </div>

                    <div className="mb-sd-btm" onClick={handleAvatarClick}>
                        <img src={avatar} alt="Image" />
                        <p className="dy-nt-us">Joshua Okechukwu</p>
                        <div className={`mb-22 ${dropdownOpen ? 'appear' : 'ghostly'}`}>
                            <div className="mb-2-sec" onClick={handleSettingsClick}><span><IoIosSettings /></span> <p>Settings</p></div>
                            <div className="mb-2-sec" style={{ color: "red" }}><span><CiLogout /></span> <p>Log out</p></div>
                        </div>
                    </div>
                </div>

                {/* ############################################### */}


                <div className="nav-container">
                    <div className={`nav-left ${close ? "width-0" : "width-full-s"}`} id='bossboss'>
                        <p className="fl-1" onClick={() => { setClose(!close) }}><span><FiSidebar /></span> <div className='goat'> <span></span>Close sidebar</div></p>
                        <p className="fl-2"><span><IoCreateOutline /></span> <div className='goat'> <span></span>New project</div></p>
                    </div>
                    <div className={`nav-right ${close ? 'f-wd-1' : 'aggress'}`}>
                        <div className="n-right-l">
                            <div className={`nav-left-r ${close ? '' : 'hidden'}`}>
                                <p className="fl-1" onClick={() => { setClose(!close) }}><span><FiSidebar /></span> <div className='goat'> <span></span>Open sidebar</div></p>
                                <p className="fl-2"><span><IoCreateOutline /></span> <div className='goat'> <span></span>New project</div></p>
                            </div>
                            <p className='cat'>Stellar <div className='agle'><FaAngleDown /></div></p>
                            
                        </div>
                        <div className="avatar">
                            <img src={avatar} alt="Image" className='avatar-img' onClick={handleAvatarClick} />
                            <div className={`modal-nav-content ${dropdownOpen ? '' : 'hidden'}`} id='modal-nav'>
                                <div className="nav-s-list">
                                    <p><span><AiOutlineRobot /></span> <div>MY GPT</div></p>
                                    <p><span><RiRobot3Line /></span><div>Customize GPT</div></p>
                                    <p onClick={handleSettingsClick}><span><IoIosSettings /></span><div>Settings</div></p>
                                    <p style={{ color: 'red' }}><span style={{ color: 'red' }}><CiLogout /></span><div>Log out</div></p>
                                </div>
                                <Settings paramOpen={settingsOpen} handleClose={handleSettingsClose} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;