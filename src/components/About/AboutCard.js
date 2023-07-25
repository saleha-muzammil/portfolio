import React from "react";
import Card from "react-bootstrap/Card";
import {FaCaretRight } from "react-icons/fa";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
          I am based in <a href="https://www.google.com/maps?q=Lahore,Pakistan" target="_blank" rel="noopener noreferrer" className="teal-link">Lahore, Pakistan</a>.
<br /> I am a Senior Year student, pursuing a Bachelor's in Computer Science from <a href="https://www.nu.edu.pk/" target="_blank" rel="noopener noreferrer" className="teal-link">FAST-NUCES</a>.
<br /> My interests are centered around Machine Learning and its applications. With hands-on experience in working with ML models, I have served as a Research Assistant on projects related to NLP, ML, and Vision.
<br/> I am also an <a href="https://www.instagram.com/artbysaleha" target="_blank" rel="noopener noreferrer" className="teal-link">artist</a> with a love for Arabic calligraphy (Khat-e-Suls).
<br/>
<br/>

          </p>
          <h2 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
              What am I <strong className="teal">working</strong> on ?
            </h2>
          <ul style={{ listStyleType: "disc", paddingLeft: 30 }}>
            <li className="about-activity">
            <FaCaretRight className="bullet-icon" /> <strong className="teal"> FedMed: </strong> Working on increasing accuracy in Retinal Vessels Segmentation implemented on a Federated Learning Framework
            </li>
            <li className="about-activity">
            <FaCaretRight className="bullet-icon" /><strong className="teal"> Kahaani: </strong> Working on enhancing an assistive, e-learning platform to enhance Urdu language of students through a TTS implementation
            </li>
            <li className="about-activity">
            <FaCaretRight className="bullet-icon" /><strong className="teal"> Omdena Project: </strong> Enhancing Orphanage Well-Being Through Computer Vision by accurately determing children's emotional states and activities
            </li>
          </ul>

        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
