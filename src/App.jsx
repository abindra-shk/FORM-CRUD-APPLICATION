import './App.scss'
import MainRoute from "./routes/routes";
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <MainRoute />
    </BrowserRouter>  
  );
}

export default App
