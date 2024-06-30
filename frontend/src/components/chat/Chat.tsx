import React, { useEffect, useRef, useState } from 'react'
import { FaArrowAltCircleUp, FaKey, FaKeyboard, FaSearch, FaYoutube, FaHammer, FaCode, FaFolder, FaCopy } from 'react-icons/fa';
import { IoGitNetworkOutline } from "react-icons/io5";
import { GiBrickWall } from "react-icons/gi";
import Editor from '@monaco-editor/react';


import avatar from '../../assets/images/bro.jpg'
import ai from '../../assets/images/ai.jpg'
import * as monaco from 'monaco-editor';

interface codeProps {
  code: string
  language: string
  mode: string
  name?: string
}

const MonacoEditor = ({code, language, mode, name=""}: codeProps) => {
  const [copied, setCopied] = useState(false)
  const rand = Math.floor(Math.random()*1000000000)



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
       <input id={`cl-${rand}`} className='hidden' value={code}/>
      <div className="code-header">
        {/* <p>{language}</p> */}
       
        <p>{name}</p>
        <span onClick={()=>{copyText(`cl-${rand}`)}}><FaCopy/> {copied ? "copied": "Copy"}</span>
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
  return (
    <div className="dialogue">
      <img src={avatar} alt="AI" />
      <p className="dialogue-content">{text}</p>
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
              <p><Typewriter text={text} speed={100} color={false} effect={false}/></p>
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
  const data:Array<dataProps> = [
    // {
    //   user: "Using the Newton-Raphson method, write a code that approximates the solution of quadratic quations in python",
    //   ai: "Using the Newton-Raphson's formula, the approximation of quadratic equations using Python is..."
    // },
    // {
    //   user: "Yes, okay I don't want to use Newton-Raphson's method I want to use Secant method.",
    //   ai: "For the newton rapson's method, use an inverse trigonemtric solution to discern the root of quations of the fourth order.",
    //   // ai:''
    // }
  ]
  const [userChat, setUserChar] = useState("")
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

  return (
    <div className='mainchat'>
      <div className={`sections-main ${data.length <= 0 ? "" : "hidden"}`}>
        <div className="abeg">
          <div className="fst-h">
            <h1 className="main-b-h">
              <Typewriter text="Hello Lordseidon" speed={500} />
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
                  setUserChar(e.target.value)
                }}
                placeholder='Enter a prompt here...'
                value={userChat}
                className='dynamo'
              >

              </textarea>
              <span className={`${userChat === "" ? "color-grey" : ""}`}><FaArrowAltCircleUp /></span>
            </div>
          </form>
        </div>
      </div>
      
      {
        data.length > 0 && (
          <div className={`sections-chat ${data.length > 0 ? "" : "hidden"}`}>
        {
          data.map(({ user, ai }, index) => {
            return (
              <>
                <Dialogue text={user} key={index} />
                <AiDialogue text={ai} key={index} />
              </>
            )
          })
        }
        <div className="code-editor">
            <MonacoEditor
            code={code}
            language="javascript"
            mode='vs-dark'
            name='script.js'
          />
        </div>
        
        <div className="bosslion">
          <div className="chat-sect-in">
            <form>
              <div className="fr-in-con">
                <textarea
                  onInput={handleInput}
                  spellCheck={false}
                  ref={ref}
                  onChange={(e) => {
                    setUserChar(e.target.value)
                  }}
                  placeholder='Enter a prompt here...'
                  value={userChat}
                  className='dynamo'
                >

                </textarea>
                <span className={`${userChat === "" ? "color-grey" : ""}`}><FaArrowAltCircleUp /></span>
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
