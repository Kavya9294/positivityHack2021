import React from 'react';
import Search from './Search.js';
import logo from './logoHack2021.png';
import filter from './filter.svg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'

import {Row,Container,Col,Navbar,Nav,Image} from 'react-bootstrap';


const Navibar = () => (
    <Container>
        <Row>
          <Col>
          <Navbar bg="light" variant="light">
            <Navbar.Brand href="#home">
              <Image src={logo} rounded height="40px"/>
            </Navbar.Brand>

            <Nav className="mr-auto">
              <Col className="header-nav" style={{color: "green",padding:"1px"}}> News</Col>
              <Col className="header-nav-dot" style={{padding: "0"}}><FontAwesomeIcon icon={faCircle} className="nav-dot" /></Col>
              <Col className="header-nav" style={{color: "orange",padding:"1px"}}> Authentic</Col>
              <Col className="header-nav-dot"style={{padding: "0"}}><FontAwesomeIcon icon={faCircle} className="nav-dot"/></Col>
              <Col className="header-nav" style={{color: "red",padding:"1px"}}>Emotive</Col>
            </Nav>
            {/* <Search></Search> */}
          </Navbar>

          </Col>
        </Row>

        </Container>


    );
export default Navibar;