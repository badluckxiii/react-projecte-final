import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink,Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../assets/images/icon64x64.png";
import {Peu} from "./peu";
import About from '../Routes/About';
import Plataforma from '../Routes/Plataforma';
import Buscar from '../Routes/Buscar';
import Carret from '../Routes/Carret';
import Index from '../Routes/Index';
import Login from '../Routes/Login';
import PresentarJoc from '../Routes/Presentar-joc';
import Profile from '../Routes/Profile';
import Notfound from '../Routes/404';
import FiltratgePreu from '../Routes/FiltratgePreu';
import MenuCookies from "../components/MenuCookies";
import FiltrePreu from './Filtratge';
//Objecte de titols
const vosTitle={
  "about": "Vos - Sobre nosaltres",
  "dashboard":"Vos - Perfil",
  "login": "Vos - Inici de sesió",
  "carret": "Vos - Carret de la compra",
  "comprar": "Vos - Comprar",
  "joc": "Vos - Joc",
  "registrar":"Vos - Registrar usuari",
  "inici": "Vos - Inici",
  "filtratge": "Vos - Filtrar per preu",
  "buscar": "Vos - Buscar per titol",
  "plataforma": "Vos - Plataforma",
  "notfound": "Vos - Pàgina no trobada",
  "perfil": "Vos - Perfil",
  "cookies": "Vos - Avis de galletes",
}
const Contain = () => {
  const [title, setTitle] = useState("");
  const [Usuari, setUsuari] = useState({});
  const [Marques, setMarques] = useState([]);
  const [Email, setEmail] = useState("Login");
  const arrayAux = [];
  const [Carrito, setCarrito] = useState([]);
  const [CarritoTamany, setCarritoTamany] = useState(0);
  
  const modificarTitul = (title) => {
    setTitle(title);
  };




  const afegirProducteAlCarret = (producte) => {
    const carrito=JSON.parse(localStorage.getItem("carrito"));
    if(carrito){
      Carrito.push(producte);
      setCarrito(Carrito);
      localStorage.setItem("carrito", JSON.stringify(Carrito));
    }
 
  };

  useEffect(() => {
    setCarritoTamany(Carrito.length)
  
  
  }, [Carrito])
  

  useEffect(() => {
    cargarMarques();
    if (localStorage.getItem("token")) {
      const email = JSON.parse(localStorage.getItem("token"));
      console.log(email);
      setEmail(email.email);
    }
    return () => { };
  }, []);

  const cargarMarques = async () => {
    const response = await fetch(`http://vos.es/api/v1/marques`);
    const resultat = await response.json();
    setMarques(resultat);
  };

  const usuariNoLogin = () => {
    return (
      <>
        <NavDropdown.Item as={NavLink} to="/registrar">Registrar</NavDropdown.Item>
        <NavDropdown.Item as={NavLink} to="/login">Login</NavDropdown.Item>
      </>
    );
  };

  const borrarLS = () => {
    localStorage.removeItem("token");
  }


  const buidarCarret=()=>{
    localStorage.setItem("carrito", "");
    setCarrito();
  }
  const buidar=()=>{
    buidarCarret();
  }

  return (
    <div>
      <Router>
        <div>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
              <Navbar.Brand as={NavLink} to="/">	<img className="logo-header" src={Logo} alt="" />
                VOS</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={NavLink} to="/">Inici</Nav.Link>
                  {Marques.length > 1
                    ? Marques.map((marca) => {
                      return (
                        <NavDropdown
                          key={marca.id}
                          title={marca.marca}
                          className={`text-white bg-dark mx-03 ${marca.marcaPlataforma.length > 0 ? "" : "d-none"
                            }`}
                          id="basic-nav-dropdown"
                        >
                          {marca?.marcaPlataforma
                            ? marca?.marcaPlataforma.map((plataforma) => {
                              return (
                                <NavDropdown.Item
                                  as={Link}
                                  key={plataforma.id}
                                  to={`/plataforma/${plataforma.id}`}
                                >
                                  {plataforma.plataforma}
                                </NavDropdown.Item>
                              );
                            })
                            : ""}
                        </NavDropdown>
                      );
                    })
                    : ""}
             

                  <Nav.Link title="Carret" as={NavLink} className="text-white mx-3" to="/carret">
                    {CarritoTamany > 0
                      ? <small>{CarritoTamany}</small>
                      : ``}
                    <i className="bi bi-cart"></i>

                  </Nav.Link>
                </Nav>
                <Nav>
                  <i className="bi mt-1 bi-person-circle text-white"></i>
                  <NavDropdown
                    className="text-white"
                    title={Email}
                    id="basic-nav-dropdown"
                  >
                    {Email === "Login" ? usuariNoLogin() : ""}
                    {Email !== "Login" ? <NavDropdown.Item onClick={() => borrarLS()}>
                      Tanca sesió
                    </NavDropdown.Item> : ""}
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <MenuCookies></MenuCookies>
        </div>
        <Routes>
          <Route path='/carret' element={<Carret title={vosTitle.carret} props={[Carrito,buidar]}/>}></Route>
          <Route path='/galletes' element={<Carret title={vosTitle.cookies} props={[Carrito,buidar]}/>}></Route>
          <Route path='/buscar' element={<Buscar title={vosTitle.buscar} />}></Route>
          <Route path='/buscar/:buscar' element={<Buscar title={vosTitle.buscar} />}></Route>
          <Route path='/filtrar/:min/:max' element={<FiltratgePreu title={vosTitle.filtratge} />}></Route>
          <Route path='/' element={<Index title={vosTitle.inici} afegirProducteAlCarret={afegirProducteAlCarret} />}></Route>
          <Route path='/videojoc/:id' element={<PresentarJoc title={vosTitle.joc} />}></Route>
          <Route path='/sobre-nosotros' element={<About title={vosTitle.about}></About>}></Route>
          <Route path='/perfil' element={<Profile  title={vosTitle.dashboard}Usuari></Profile>}></Route>
          <Route path='/plataforma/:id' element={<Plataforma title={vosTitle.plataforma}></Plataforma>}></Route>
          <Route path='/login' element={<Login title={vosTitle.login} Usuari></Login>}></Route>
          <Route path='*' element={<Notfound title={vosTitle.notfound} />}></Route>
        </Routes>
      <Peu></Peu>
      </Router>
    </div>
  )
}
export default Contain;