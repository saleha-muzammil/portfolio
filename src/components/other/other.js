import React from "react";
import { Container, Row } from "react-bootstrap";
import PhotoAlbum from "react-photo-album";

const photos = [
  { src: require("../../Assets/art/im1.png"), width: 800, height: 900 },
  { src: require("../../Assets/art/im2.png"), width: 800, height: 1000 },
  { src: require("../../Assets/art/im3.png"), width: 1000, height: 900 },
  { src: require("../../Assets/art/im4.png"), width: 1000, height: 900 },
  { src: require("../../Assets/art/im5.png"), width: 800, height: 600 },
  { src: require("../../Assets/art/im6.png"), width: 800, height: 600 },
  { src: require("../../Assets/art/im7.png"), width: 800, height: 600 },
  { src: require("../../Assets/art/im8.png"), width: 800, height: 600 },
  { src: require("../../Assets/art/im9.png"), width: 500, height: 600 },
  { src: require("../../Assets/art/im10.png"), width: 800, height: 600 },
  { src: require("../../Assets/art/im11.png"), width: 800, height: 600 },
  { src: require("../../Assets/art/im12.png"), width: 800, height: 600 },
  { src: require("../../Assets/art/im13.png"), width: 800, height: 600 },
];

export default function Other() {
  return (
  <Container fluid className="about-section">
         <Container>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <h1 style={{ fontSize: "2.4em", paddingBottom: "20px" }}>
            Extra<strong className="teal">Curricular</strong>
          </h1>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ fontSize: "1.2em" }}>
              <strong>
                <a
                  href="https://www.ted.com/tedx/events/52803"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="teal-link"
                >
                  TEDxFASTLahore
                </a>
              </strong>
              , Organizer (2023)
            </li>
            <li style={{ fontSize: "1.2em" }}>
              CCS, FAST Lahore, General Secretary (2022-23)
            </li>
          </ul>
        </Row>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
              Art & <strong className="teal">Calligraphy</strong>
            </h1>
            <p style={{fontSize: "1.2em"}}>
                My art account:  
                <strong>
                <a
                  href="https://www.instagram.com/artbysaleha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="teal-link"
                > @artbysaleha
                </a>
              </strong>
            </p>
  <PhotoAlbum layout="rows" photos={photos} />
  </Row>
  </Container>
  </Container> );
}
