import './App.css'
import io from 'socket.io-client'
import { useState, useEffect } from 'react'

const levels = Array(5).fill(0).map((i, idx) => idx + 1)

const App = () => {
    const [socket, setSocket] = useState<Object>();
    const [url, setUrl] = useState<String>("")
    const [depth, setDepth] = useState<Number>(0)
    const [working, setWorking] = useState<String>("waiting")

    useEffect(() => {
        const newSocket = io("http://localhost:5000")
        setSocket(newSocket)
        return () => {
            newSocket.close()
        }
    }, [])

    const handleSubmit = () => {
        setWorking("working")
    }

    const checkURL = (e: React.ChangeEvent<HTMLInputElement>) => {
        const check = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/)

        if (check.test(e.target.value)) {
            setUrl(e.target.value)
        }
        else {
            setUrl("")
            setDepth(0)
            setWorking("waiting")
        }
    }


    const activateLevel = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const levels = document.getElementsByClassName('level')
        for (const level of Array.from(levels)) {
            if (level.classList.contains('active')) level.classList.remove('active')
        }
        event.currentTarget.classList.add('active')
        setDepth(Number(event.currentTarget.id))
    }

    return (
        <div className="App-header">
            <h3>Email Finder</h3>
            {working === "waiting" && (
                <div className="app-form-container">
                    <input type="text" placeholder="Enter URL" onChange={checkURL} />
                    {url && (
                        <div className="levels">
                            {levels.map(level => <div className="level" id={level.toString()} key={level} onClick={activateLevel}>{level}</div>)}
                        </div>
                    )}
                    {depth > 0 && <button type="button" onClick={handleSubmit}>Begin</button>}
                </div>
            )}

            {working === "working" && (
                <div className="app-console">
                    Working
                </div>
            )}
        </div>
    )
}

export default App
