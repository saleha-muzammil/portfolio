import React from "react";
import GitHubCalendar from "react-github-calendar";
import { Row } from "react-bootstrap";

function Github() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
      <h2 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
        Days I <strong className="teal">Code</strong>
      </h2>
      <GitHubCalendar
        username="saleha-muzammil"
        blockSize={15}
        blockMargin={5}
        color="#008073"
        fontSize={16}
      />
    </Row>
  );
}

export default Github;
