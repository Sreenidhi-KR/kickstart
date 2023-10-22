import React, { Component } from "react";
import Transcript from "../../ethereum/transcript";
import factory from "../../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
//import Head from "next/document";

class StudentShow extends Component {
  static async getInitialProps(props) {
    let transcriptAddress;
    let subjects;
    let accountExists = false;

    try {
      accountExists = await factory.methods
        .doesTranscriptExists(props.query.address)
        .call();
    } catch (e) {
      accountExists = false;
    }

    if (accountExists) {
      transcriptAddress = await factory.methods
        .studentTranscriptMapping(props.query.address)
        .call();
      const transcript = Transcript(transcriptAddress);
      //const subjects = await transcript.methods.subjects(0).call();
      const requestCount = await transcript.methods.getSubjectsCount().call();

      subjects = await Promise.all(
        Array(parseInt(requestCount))
          .fill()
          .map((element, index) => {
            return transcript.methods.subjects(index).call();
          })
      );
    }

    return { transcriptAddress, subjects, accountExists };
  }

  render() {
    return !this.props.accountExists ? (
      <div>
        <h1>No User registered with this wallet address</h1>
        {/* <Button content="Create Campaign" icon="add circle" primary /> */}
      </div>
    ) : (
      <div>
        <h1>Welcome </h1>
        <div
          style={{
            marginBottom: 15,
          }}
        >
          Transcript Address : {this.props.transcriptAddress}
        </div>

        <div>College &emsp; Subject &emsp; Grade</div>
        {this.props.subjects.map((element) => (
          <div>
            {element.college} &emsp; {element.subjectName} &emsp;{" "}
            {element.studentGrade} /{element.totalGrade}
          </div>
        ))}
      </div>
    );
  }
}

export default StudentShow;
