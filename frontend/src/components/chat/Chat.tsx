import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaArrowAltCircleUp, FaKey, FaKeyboard, FaSearch, FaYoutube, FaHammer, FaCode, FaFolder, FaCopy } from 'react-icons/fa';
import { IoGitNetworkOutline } from "react-icons/io5";
import { GiBrickWall } from "react-icons/gi";
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import avatar from '../../assets/images/bro.jpg'
import ai from '../../assets/images/ai.jpg'
import * as monaco from 'monaco-editor';
import { getCookie, GlobalContext } from '../../App';

interface codeProps {
  code: string
  language: string
  mode: string
  name?: string
}

const MonacoEditor = ({ code, language, mode, name = "" }: codeProps) => {
  const [copied, setCopied] = useState(false)
  const rand = Math.floor(Math.random() * 1000000000)

  function copyText(str: string) {
    var copyText_: any = document.getElementById(str);
    console.log(copyText_)
    copyText_!.select();
    copyText_!.setSelectionRange(0, 99999); // For mobile devices

    if (navigator.clipboard) {
      navigator.clipboard.writeText(copyText_.value).then(() => {
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

  return (
    <div className="code-group">
      <input id={`cl-${rand}`} className='hidden' value={code} />
      <div className="code-header">
        {/* <p>{language}</p> */}

        <p>{name}</p>
        <span onClick={() => { copyText(`cl-${rand}`) }}><FaCopy /> {copied ? "copied" : "Copy"}</span>
      </div>
      <Editor
        height="100%"
        defaultLanguage={language}
        defaultValue={code}
        theme={mode}
        options={{
          readOnly: true,
          // lineNumbers: 'off',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          renderLineHighlight: 'none',
          folding: false,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          selectionHighlight: false,
          cursorBlinking: 'solid',
          contextmenu: false,
          links: false,
          renderControlCharacters: false,
          renderWhitespace: 'none',
          wordWrap: 'on',
        }}
      />
    </div>

  );
};


interface typeProps {
  text: string
  speed: number,
  color?: boolean
  effect?: boolean
}
const Typewriter = ({ text, speed = 500, color = true, effect = true }: typeProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0)
  const words = text.split(' ');
  useEffect(() => {

    const interval = setInterval(() => {
      if (index < words.length - 1) {
        setDisplayedText((prev) => prev + (index > 0 ? ' ' : '') + words[index]);
        setIndex(prev => prev + 1)

      }
      if (index === words.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, words]);

  return (
    <span>
      {
        effect && (
          <>
            <span >
              {displayedText}
            </span>
            <span className={`${color ? 'animate-slowly' : ""}`}> {words[index]}</span>
          </>
        )
      }
      {
        !effect && (
          <span>{text}</span>
        )
      }

    </span>


  );
};

interface cardProps {
  text: string
  icon: any
}

const Card = ({ text, icon }: cardProps) => {
  return (
    <div className="pos-top-cards">
      <p>{text}</p>
      <span className='fa-112'>{icon}</span>
    </div>
  )
}

interface dialogue {
  text: string
}

const Dialogue = ({ text }: dialogue) => {
  const global = useContext(GlobalContext)
  const pp = global.profilePic!
  return (
    <div className="dialogue">
      <img src={avatar} alt="AI" />
      <p className="dialogue-content"><ReactMarkdown>{text}</ReactMarkdown></p>
    </div>
  )
}


const AiDialogue = ({ text }: dialogue) => {
  return (
    <div className="ai-dialogue">
      <img src={ai} alt="AI" />
      {
        text !== "" && (
          <>
            <div className="ai-dialogue-content">
              <p><ReactMarkdown>{text}</ReactMarkdown></p>
            </div>
          </>
        )
      }

      {
        text === "" && (
          <AiLoader />
        )
      }

    </div>
  )
}

const AiLoader = () => {
  return (
    <div className="ai-loader">
      <div className="ai-load-card">
        <p className='er-4 red'><IoGitNetworkOutline /></p>
        <p>Establishing connection to your local machine</p>
      </div>
      <div className="ai-load-card">
        <p className='er-4 hammer-anime'><FaHammer /></p>
        <p>Creating plan to accomplish task</p>
      </div>
      <div className="ai-load-card">
        <p className='er-4 blue code-anime'><FaCode /></p>
        <p>Creating plan to accomplish task</p>
      </div>
      <div className="ai-load-card">
        <p className='er-4 brown'><GiBrickWall /></p>
        <p>Creating plan to accomplish task</p>
      </div>
      <div className="ai-load-card">
        <p className='er-4 grey'><FaFolder /></p>
        <p>Creating plan to accomplish task</p>
      </div>
    </div>
  )
}

interface dataProps {
  user: string
  ai: string
}


const Chat = () => {
  let { id } = useParams();

  // const [id_, setId] = useState(id)
  const [chat, setChat] = useState([])
  const { id_, setId, accessToken, setKnowActive, apiKey } = useContext(GlobalContext)
  // const id_ = globalContext.id_
  // const setId = globalContext.setId
  // const accessToken = globalContext.accessToken
  // const setKnowActive = globalContext.setKnowActive
  if (id !== "new") {
    setId(id)
  }

  setKnowActive(`${id}/`)
  const code = `function copyText(str: string) {
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
}`
  const data: Array<dataProps> = [
    {
      user: "Using the Newton-Raphson method, write a code that approximates the solution of quadratic quations in python",
      ai: "Using the Newton-Raphson's formula, the approximation of quadratic equations using Python is..."
    },
    {
      user: "Yes, okay I don't want to use Newton-Raphson's method I want to use Secant method.",
      ai: "For the newton rapson's method, use an inverse trigonemtric solution to discern the root of quations of the fourth order.",
      // ai:''
    }
  ]


  async function createRoom() {
    const url = "http://178.79.131.91/api/create_room"
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        "name": "New_room"
      })
    };
    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error("Response is not okay " + response.statusText)
        }
        else {
          return response.json()
        }
      })
      .then(data => {
        console.log(data)
        setId((prev: any) => data["room_id"])
      })
      .catch(error => {
        console.error('Error:', error); // Handle any errors that occur
      });
  }
  async function postData() {
    const url = "http://178.79.131.91/api/view_message"
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({ "room_id": id })
    };
    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error("Response is not okay " + response.statusText)
        }
        else {
          return response.json()
        }
      })
      .then(data => {
        console.log(data)
        setChat(data["message"])
      })
      .catch(error => {
        console.error('Error:', error); // Handle any errors that occur
      });
  }
  const [userChat, setUserChat] = useState("")
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: any) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${e.target.scrollHeight - 16}px`;
    }
  };
  const options = {
    selectOnLineNumbers: true
  };

  const socketRef = useRef(null)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const targetElement = document.querySelector("#sectionChat");

    if (targetElement !== null) {
      targetElement.scrollTo(0, targetElement.scrollHeight)
    }

    // Add keypress event listener to the input field
    const input = ref.current;
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter' && !event.shiftKey && userChat.trim() !== "") {
        sendMessage();
      }
    };

    input.addEventListener('keypress', handleKeyPress);

    // Clean up the event listener on component unmount
    return () => {
      input.removeEventListener('keypress', handleKeyPress);
    };
  }, [userChat, messages, id_]);

  useEffect(() => {
    console.log(`ws://localhost:8001/ws/chat/${id_}/?api_key=${apiKey}`, id, id_)
    if (id_ !== "new") {
      socketRef.current = new WebSocket(`ws://localhost:8001/ws/chat/${id_}/?api_key=${apiKey}`);

      // 2. Handle the connection open event
      socketRef.current.onopen = () => {
        console.log('Connected to the WebSocket server');
      };

      // 3. Handle incoming messages
      socketRef.current.onmessage = (event: any) => {
        setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
        console.log("Messages", messages, event.data)
      };

      // 4. Handle connection errors
      socketRef.current.onerror = (error: any) => {
        console.error('WebSocket error:', error);
      };

      // 5. Handle connection closure
      socketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
      };

      return () => {
        socketRef.current.close()
      };
    }

    // postData()
  }, [apiKey, id_])


  const sendMessage = async () => {
    if (id_ === "new") {
      if (apiKey !== "" && userChat.trim() !== "") {
        const newRoomId = await createRoom();
        socketRef.current = new WebSocket(`ws://localhost:8001/ws/chat/${newRoomId}/?api_key=${apiKey}`);

        socketRef.current.onopen = () => {
          console.log('Connected to the WebSocket server in new room');
          sendMessageToSocket();
        };

        socketRef.current.onmessage = (event: any) => {
          setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
          console.log("Messages", messages, event.data);
        };

        socketRef.current.onerror = (error: any) => {
          console.error('WebSocket error:', error);
        };

        socketRef.current.onclose = () => {
          console.log('WebSocket connection closed');
        };
      }
    } else {
      sendMessageToSocket();
    }
  }

  const sendMessageToSocket = () => {
    if (socketRef.current.readyState === WebSocket.OPEN) {
      const messageData = {
        "message": userChat,
      };
      socketRef.current.send(JSON.stringify(messageData));
      setUserChat('');
    } else {
      socketRef.current.onopen = () => {
        const messageData = {
          "message": userChat,
        };
        socketRef.current.send(JSON.stringify(messageData));
        setUserChat('');
      };
    }
  };

  // const sendMessage = () => {
  //   if (id_ !== "new") {
  //     if (socketRef.current.readyState === WebSocket.OPEN) {
  //     const messageData = {
  //       "message": userChat,
  //     };
  //     socketRef.current.send(JSON.stringify(messageData));
  //     setUserChat('');
  //   }
  //   }
  //   else {
  //     if (globalContext.apiKey !== "" && userChat.trim() !== "") {
  //       console.log("Boss boy")
  //       createRoom()
  //       // sendMessage2()
  //       console.log("id_____", id_)
  //     }
  //   }

  // }
  // const sendMessage2 = () => {
  //   console.log("Entry  pig", userChat.trim()!=="", id_!=="new")
  //   if (id_ !== "new" && userChat.trim() !== "") {
  //     console.log("Neat pig")

  //     if (socketRef.current.readyState === WebSocket.OPEN) {
  //     const messageData = {
  //       "message": userChat,
  //     };
  //     socketRef.current.send(JSON.stringify(messageData));
  //     setUserChat('');
  //   }
  //   }
  //   else {
  //     console.log("Filthy pig")
  //   }

  // }


  return (
    <div className='mainchat'>
      <div className={`sections-main ${messages.length <= 0 ? "" : "hidden"}`}>
        <div className="abeg">
          <div className="fst-h">
            <h1 className="main-b-h">
              <Typewriter text={`Hello ${localStorage.getItem("firstName")}`} speed={500} />
            </h1>
            <h1 className='sub-b-h'>
              <Typewriter text="What do you want to build today?" speed={300} />
            </h1>
          </div>
          <div className="poss-top-sec">
            <Card icon={<FaYoutube />} text='Create a snake game in python.' />
            <Card icon={<FaSearch />} text='Create a snake game in python.' />
            <Card icon={<FaKeyboard />} text='Create a snake game in python.' />
            <Card icon={<FaKey />} text='Create a snake game in python.' />
          </div>
        </div>


        <div className="chat-sect-in">
          <form>
            <div className="fr-in-con">
              <textarea
                onInput={handleInput}
                ref={ref}
                spellCheck={false}
                onChange={(e) => {
                  setUserChat(e.target.value)
                }}
                placeholder='Enter a prompt here...'
                value={userChat}
                className='dynamo'
              >

              </textarea>
              <span className={`${userChat === "" ? "color-grey" : ""}`} onClick={sendMessage}><FaArrowAltCircleUp /></span>
            </div>
          </form>
        </div>
      </div>
      {
        messages.length > 0 && (
          <div className={`sections-chat ${messages.length > 0 ? "" : "hidden"}`} id='sectionChat' key={messages.length}>
            {
              messages.map(({ created_at, id, message, receiver, sender, language, name }) => {
                return (
                  <>
                    {
                      receiver === "Stellarcode" ? (<Dialogue text={message} key={id} />) :
                        sender === "DrymFyre" ? (
                          <div className="code-editor">
                            <MonacoEditor
                              code={message}
                              language={language}
                              mode='vs-dark'
                              name={name}
                            />
                          </div>
                        ) :
                          (<AiDialogue text={message} key={id} />)
                    }
                  </>
                )
              })
            }
            {/* <div className="code-editor">
            <MonacoEditor
            code={code}
            language="javascript"
            mode='vs-dark'
            name='script.js'
          />
        </div> */}

            <div className="bosslion">
              <div className="chat-sect-in">
                <form>
                  <div className="fr-in-con">
                    <textarea
                      onInput={handleInput}
                      spellCheck={false}
                      ref={ref}
                      onChange={(e) => {
                        setUserChat(e.target.value)
                      }}
                      placeholder='Enter a prompt here...'
                      value={userChat}
                      className='dynamo'
                    >

                    </textarea>
                    <span className={`${userChat === "" ? "color-grey" : ""}`} onClick={() => { sendMessage() }}><FaArrowAltCircleUp /></span>
                  </div>
                </form>
              </div>
            </div>

          </div>
        )
      }

    </div>
  )
}

export default Chat
