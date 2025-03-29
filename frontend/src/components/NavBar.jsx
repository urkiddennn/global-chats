import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { IoPerson } from "react-icons/io5";
import { IoChatbubbles } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();


    const gotoHome = () => {
        navigate("/main")
    }
    const gotoProfile = () => {
        navigate("/profile")
    }
    const gotoChats = () => {
        navigate("/chats")
    }
    return (
        <div className='w-auto rounded-lg p-3 outline-1 absolute bottom-3 flex justify-evenly gap-3'>
            {location.pathname === "/main" &&

                < button className='w-10 '><GoHomeFill size={"2em"} className='hover:text-blue-500 text-blue-500  ' /></button>
                || < button className='w-10 ' onClick={gotoHome}><GoHomeFill size={"2em"} className='hover:text-blue-500 ' /></button>
            }
            {location.pathname === "/chats" &&
                < button className='w-10'> <IoChatbubbles size={"2em"} className='hover:text-blue-500 text-blue-500' /></button> ||
                < button className='w-10' onClick={gotoChats}> <IoChatbubbles size={"2em"} className='hover:text-blue-500' /></button>
            }
            {location.pathname === "/profile" &&
                <button className='w-10 ' ><IoPerson size={"2em"} className='hover:text-blue-500 text-blue-500' /></button> || <button className='w-10 ' onClick={gotoProfile}><IoPerson size={"2em"} className='hover:text-blue-500 ' /></button>
            }



        </div >
    )
}
export default NavBar
