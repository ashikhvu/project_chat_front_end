import './App.css';
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Signin from './Signin.jsx';
import Signup from './Signup.jsx';
import Home from './Home.jsx';
import LoginRoute from './LoginRoute.jsx';
import Test from './Test.jsx';

function App() {
  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/test" element={<Test/>}></Route>
        <Route element={<LoginRoute/>}>
          <Route path="/home" element={<Home/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </>
}

export default App;
