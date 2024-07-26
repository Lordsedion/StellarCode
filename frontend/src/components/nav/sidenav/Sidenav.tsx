import React, { useContext, useEffect, useState } from 'react'
import './sidenav.css'
import { getCookie, GlobalContext } from '../../../App'
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
  link: string
}
export const BarItems = ({ title, link}: barProps) => {
  const globalContext = useContext(GlobalContext)
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const handleThemeClose = () => {
    setThemeDropdownOpen(false);
  };

  const handleThemeClick = (event: any) => {
    event.stopPropagation();
    setThemeDropdownOpen(!themeDropdownOpen);
  };
  return (
    <a href={`/chat/${link}`} className={`chd ${globalContext.knowActive === link ? "hoverColor": ""}`}>
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

interface roomType {
  name: string
  id: number
  room_id: number,
  created_at: any
}

const Sidenav = () => {
  const globalContext = useContext(GlobalContext);
  const close = globalContext!.close
  const accessToken = globalContext!.accessToken
  const [rooms, setRooms] = useState(
    [
      {
        created_at: "",
        id: 0,
        name: "",
        room_id: "",
        user_id: 0
      },
    ]
  )
  const [older, setOlder] = useState(
    [
      {
        created_at: "",
        id: 0,
        name: "",
        room_id: "",
        user_id: 0
      },

    ]
  )

  async function getRooms (token:string) {
    const options = {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        // 'X-CSRFToken': getCookie('csrftoken'),
        'Authorization': `Bearer ${token}`
        },
    };

    const url_ = "http://178.79.131.91/api/room_view"
    fetch(url_, options)
    .then(response=> {
        if (!response.ok) {
            throw new Error("Response is not okay " + response.statusText)
        }
        else {
            return response.json()
        }
    })
    .then(data => {
        console.log(data)
        setRooms(data["room"])
        setOlder(data["older"])
      })
      .catch(error => {
        console.error('Error:', error); // Handle any errors that occur
      });       

}

  useEffect(()=> {
    getRooms(accessToken)
  }, [globalContext.id_])

  return (
    <div className={`sidenav ${close ? "width-0" : 'width-full'}`} id='sidenav'>
      <div className="section-timeline">
        <div className="ct-container">
          <p className="light-header">Recent</p>
          <div className="sect-tl-cnt">
            {
              rooms.map(({name, id, room_id, created_at})=> {
                return (
                   <BarItems title={name} link={`${room_id}/`} key={id}/>
                )
              })
            }
          </div>
        </div>

        <div className="ct-container">
          <p className="light-header">Older</p>
          <div className="sect-tl-cnt">
          {
              older.map(({name, id, room_id, created_at})=> {
                return (
                   <BarItems title={name} link={`${room_id}/`} key={id}/>
                )
              })
            }
          </div>
        </div>

      </div>
      <div className="recm">Recomend Project</div>
    </div>
  )
}

export default Sidenav
