import React from "react";
import { Link } from "react-router-dom";
import { Col } from "react-bootstrap";
import me from "../../Assets/me.png";
import Type from "./Type";
import { AiFillGithub, AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { RxOpenInNewWindow } from "react-icons/rx";

function Home() {
  return (
    <div fluid className="home-section" id="home" style={{ zIndex: '100' }}>
      <div className="home-content">
        <div className="row">
          <div className="col-lg-6">
            <Col md={12} className="home-header">
              <div className="content-container">
                <h1 className="heading">
                 Hi, I'm <strong className="main-name">Saleha Muzammil</strong>.
                </h1>
                <div className="type-container">
                  <Type />
                  <br/>
                  <br/>
                </div>
                <div className="paragraph-container">
                  <p>
                    A self-driven and determined individual with a passion for <span className="teal">software and systems</span>.
                    <br /> Committed to working on solving real-life challenges to make the world a better place.
                  </p>
                </div>
              <Col md={12}>
                <div>
                  <ul className="home-about-social-links">
                    <li className="social-icons">
                      <a
                        href="https://github.com/saleha-muzammil"
                        target="_blank"
                        rel="noreferrer"
                        className="icon-colour  home-social-icons"
                      >
                        <AiFillGithub />
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
              <br />
              <div >
                <Link to="/about" className="read-more">
                  Read More <RxOpenInNewWindow className="icon" />
                </Link>
              </div>
              </div>
              <div>
                <div style={{ width: "10px", height: "132px" }}></div>
                <div style={{ width: "50px", height: "132px" }}></div>
              </div>
            </Col>
          </div>
          <div className="col-lg-6" style={{ paddingLeft: 130,  position:  "relative" }}>
              <img
                className="myimage"
                src={me}
                alt="home pic"
                style={{ width: "60%", height: "auto" }}
              />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
