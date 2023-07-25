import React from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import me from "../../Assets/me.png";
import Type from "./Type";
import {AiFillGithub, AiOutlineTwitter} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { RxOpenInNewWindow } from "react-icons/rx"; // Import the arrow icon from react-icons

function Home() {

  return (

    <div fluid className="home-section" id="home"  style = {{zIndex: '100'}}>
        <div className="home-content" style={{ paddingBottom: 0}}>
          <Row>
            <Col md={7} className="home-header">
              <br></br>
              <h1 style={{ paddingBottom: 15, paddingLeft: 30 }} className="heading">
                Hi, I'm <strong className="main-name">Saleha Muzammil</strong> .
              </h1>
              <div style={{ paddingLeft: 200, textAlign: "left" }}>
                <Type />
              </div>
              <div style={{ paddingLeft: 200, textAlign: "left" }}>
              <p style={{ textAlign: "justify" }}>
                <br/>
            A self-driven and determined individual with a passion for  <span className="teal">   Applied Machine Learning</span>.
            <br /> Committed to working on solving real-life challenges through ML to make the world a better place.

            <br />
            </p>
             
              </div>
              <Col md={12} className="home-about-social">
                <div style={{ paddingLeft: 200, textAlign: "left" }}>
            <ul  className="home-about-social-links">
              <li className="social-icons">
              <a
                  href="https://github.com/saleha-muzammil"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub/>
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://twitter.com/MuzammilSaleha"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiOutlineTwitter />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/salehamuzammil/"
                  rel="noreferrer"
                  target="_blank"
                  className="icon-colour  home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>
            </ul>
            </div>
          </Col> 
          <Col>
          <br/>
          <div style={{ paddingLeft: 200, textAlign: "left" }}>
          <Link to="/about" className="read-more">
            Read More <RxOpenInNewWindow className="icon" />
          </Link>
          </div>
              <div>
                <div style={{ width: "10px", height: "140px"}}></div>
                <div style={{ width: "50px", height: "140px" }}></div>
              </div>
              </Col>           
            </Col>

            <Col md={5} style={{  position: "relative" }}>
  <img
    src={me}
    alt="home pic"
    className="img-fluid"
    style={{  width: "62.5%", height: "62.5%", objectFit: "fit" }}
  />
</Col>

          </Row>
        </div>
    </div>
  );
}

export default Home;
