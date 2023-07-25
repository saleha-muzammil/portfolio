import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import haqbaat from "../../Assets/Projects/haqbaat.jpeg";
import birthday from "../../Assets/Projects/birthday.png";
import apnacomp from "../../Assets/Projects/apnacomp.png";
import house from "../../Assets/Projects/house.jpg";
import raftaar from "../../Assets/Projects/raftaar.png";
import meme from "../../Assets/Projects/meme.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Container>
        <h1 className="project-heading">
          Recent <strong className="teal">Projects </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={haqbaat}
              isBlog={false}
              title="HaqBaat Bot"
              description="Haqbaat is a WhatsApp bot designed to empower and uplift Pakistani women by providing them an easy interface to access information regarding their rights in Pakistan. The bot is built to interact with users in Roman Urdu, making it convenient for women to communicate and obtain information easily. Built using Twilio API, OpenAI API, Flask , and Python."
              ghLink="https://github.com/saleha-muzammil/HaqBaat-bot"            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={apnacomp}
              isBlog={false}
              title="Apna Computer"
              description="Apna Computer is a web application that helps users build custom PC configurations by selecting compatible parts from a vast inventory. It is built using the MERN stack (MongoDB, Express, React, Node.js) and features a beautiful user interface designed for a seamless user experience. "
              ghLink="https://github.com/saleha-muzammil/Apna-Computer"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={house}
              isBlog={false}
              title="House Price Prediction Using Real Estate Data"
              description="A machine learning project that predicts house prices using linear regression with L2 regularization. The model was trained using a dataset of house features, and evaluated using R2, MSE, RMSE, and MAE metrics.  Built using Flask, and Python."
              ghLink="https://github.com/saleha-muzammil/House-Price-Prediction-Using-Real-Estate-Data"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={birthday}
              isBlog={false}
              title="Auto Birthday Wisher Bot"
              description="The Automated WhatsApp Birthday Wishes project is a Python script that uses the Selenium WebDriver to automate the process of sending birthday wishes to your friends and family on WhatsApp."
              ghLink="https://github.com/saleha-muzammil/auto-birthday-wisher-whatsapp"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={raftaar}
              isBlog={false}
              title="Raftaar"
              description="(Upcoming)"
              ghLink="https://github.com/saleha-muzammil/Raftaar"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={meme}
              isBlog={false}
              title="Meme Sensei"
              description="(Upcoming)"
              ghLink="https://github.com/saleha-muzammil/Raftaar"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
