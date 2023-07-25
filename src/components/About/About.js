import React from "react";
import { Container, Row} from "react-bootstrap";
import Github from "./Github";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import Toolstack from "./Toolstack";

function About() {
  return (
    <Container fluid className="about-section">
      {/* <Particle /> */}
      <Container>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
            <h2 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
              About <strong className="teal">Me</strong>
            </h2>
            <Aboutcard />
        </Row>
        <h2 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
          Professional <strong className="teal">Skillset </strong>
        </h2>

        <Techstack />

        <h2 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
          <strong className="teal">Softwares</strong> I use
        </h2>
        <Toolstack />

        <Github />
      </Container>
    </Container>
  );
}

export default About;
