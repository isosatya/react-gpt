import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await fetch(
        'http://localhost:8000/completions',
        options
      );
      const data = await response.json();
      setMessage(data?.choices[0].message);
      // console.log('just clicked');
      // console.log('message', data.choices[0].message);
      // console.log('variante message', message);
    } catch (error) {
      console.log(error);
    }
  };

  const createNewChat = async () => {
    setMessage(null);
    setValue('');
    setCurrentTitle(null);
  };

  const handleClick = async (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue('');
  };

  useEffect(() => {
    console.log(
      `currentTitle ${currentTitle}, value ${value}, message ${message}`
    );
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }

    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => {
        return [
          ...prevChats,
          {
            title: currentTitle,
            role: 'user',
            content: value,
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content,
          },
        ];
      });
    }
  }, [message, currentTitle]);

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );

  let uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

  console.log('uniqueTitles', uniqueTitles);

  return (
    <div className='app'>
      <section className='side-bar'>
        <button onClick={createNewChat}>+ New chat</button>
        <ul className='history'>
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by Andrew</p>
        </nav>
      </section>

      <section className='main'>
        {!currentTitle && <h1>AndrésGPT</h1>}
        <ul className='feed'>
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className='role'>{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className='bottom-section'>
          <div className='input-container'>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
            ></input>
            <div id='submit' onClick={getMessages}>
              ➤
            </div>
          </div>
          <p className='info'>ChatGPT Disclaimer</p>
        </div>
      </section>
    </div>
  );
}

export default App;
