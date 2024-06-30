import React, { useContext, useEffect, useState } from 'react'
import './sidenav.css'
import { GlobalContext } from '../../../App'
import { BsThreeDots } from "react-icons/bs";
import { FaPen } from 'react-icons/fa';
import { GoTrash } from "react-icons/go";
import { ThemeDropdownProps } from '../Nav';

const OptionsDrowdown = ({ open, handleClose }: ThemeDropdownProps
) => {
  const globalContext = useContext(GlobalContext)
  const setTheme = globalContext!.setTheme
  let varOpen = open


  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!event.target.closest('.small-trouble')) {
        handleClose();
      }
    };


    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClose]);

  return (
    <div className="overlay-boss">
      <div className={`small-trouble ${open ? '' : 'hidden'}`}>
        <p><span><FaPen /></span> <div>Edit</div></p>
        <p style={{ color: "red" }}><span><GoTrash /></span> <div>Delete</div></p>
      </div>
    </div>

  );
};


interface barProps {
  title: string
}
export const BarItems = ({ title }: barProps) => {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const handleThemeClose = () => {
    setThemeDropdownOpen(false);
  };

  const handleThemeClick = (event: any) => {
    console.log("Bosss")
    event.stopPropagation();
    setThemeDropdownOpen(!themeDropdownOpen);
  };
  return (
    <a href='#' className="chd">
      <span className='fst-boy'>{title} </span><span onClick={
        (e) => {
          handleThemeClick(e)
          for (let i = 0; i < document.getElementsByClassName("small-trouble").length; i++) {
            document.getElementsByClassName("small-trouble")[i].classList.add("hidden")
          }
        }
      }><BsThreeDots /></span>
      <OptionsDrowdown open={themeDropdownOpen} handleClose={handleThemeClose} />
    </a>
  )
}

const Sidenav = () => {

  const globalContext = useContext(GlobalContext);
  const close = globalContext!.close

  return (
    <div className={`sidenav ${close ? "width-0" : 'width-full'}`} id='sidenav'>
      <div className="section-timeline">
        <div className="ct-container">
          <p className="light-header">Recent</p>
          <div className="sect-tl-cnt">
            <BarItems title='Develop a flying jet simulator in c++' />
            <BarItems title='Configure a UAV handover DQN in python' />
            <BarItems title='Pytorch code conversion to Tensorflow and Jax ' />
          </div>
        </div>

        <div className="ct-container">
          <p className="light-header">Older</p>
          <div className="sect-tl-cnt">
            <BarItems title='Develop a flying jet simulator in c++' />
            <BarItems title='Configure a UAV handover DQN in python' />
            <BarItems title='Pytorch code conversion to Tensorflow and Jax ' />
          </div>
        </div>

      </div>
      <div className="recm">Recomend Project</div>
    </div>
  )
}

export default Sidenav
