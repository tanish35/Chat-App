import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/chatPage";
import HomePage from "./pages/homePage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/chat">Chat</a>
            </li>
          </ul>
        </nav> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
