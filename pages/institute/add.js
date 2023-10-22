import React, { Component } from "react";
import Transcript from "../../ethereum/transcript";
import factory from "../../ethereum/factory";
import { Form, Button, Message, Input } from "semantic-ui-react";
import { Link, Router } from "../../routes";
import web3 from "../../ethereum/web3";

import Head from "next/head";

class InstituteAdd extends Component {
  state = {
    subjectName: "",
    collegeName: "",
    totalGrade: "",
    studentGrade: "",
    loading: false,
    errorMessage: "",
  };

  static async getInitialProps(props) {
    let transcriptAddress;

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

      //const subjects = await transcript.methods.subjects(0).call();
    }

    return { transcriptAddress, accountExists };
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const transcript = Transcript(this.props.transcriptAddress);
    const { collegeName, subjectName, studentGrade, totalGrade } = this.state;

    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      const gasEstimate = await transcript.methods
        .addSubject(subjectName, totalGrade, studentGrade, collegeName)
        .estimateGas({ from: accounts[0] });
      const encode = await transcript.methods
        .addSubject(subjectName, totalGrade, studentGrade, collegeName)
        .encodeABI();

      const tx = await web3.eth.sendTransaction({
        from: accounts[0],
        gas: gasEstimate,
        data: encode,
        value: 0,
        to: this.props.transcriptAddress,
      });
      // await transcript.methods
      //   .addSubject(subjectName, totalGrade, studentGrade, collegeName)
      //   .send({
      //     from: accounts[0],
      //     value: 0,
      //     gasLimit: 500000,
      //   });
      Router.pushRoute(`/`);
    } catch (err) {
      console.log(err);
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return !this.props.accountExists ? (
      <div>
        <h1>No User registered with this wallet address</h1>
      </div>
    ) : (
      <div>
        <Head>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
          ></link>
        </Head>
        <div
          style={{
            marginBottom: 15,
          }}
        >
          Transcript Address : {this.props.transcriptAddress}
        </div>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Form.Field>
            <label>College Name</label>
            <Input
              value={this.state.collegeName}
              onChange={(event) =>
                this.setState({ collegeName: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Subject Name</label>
            <Input
              value={this.state.subjectName}
              onChange={(event) =>
                this.setState({ subjectName: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Student Grade</label>
            <Input
              value={this.state.studentGrade}
              onChange={(event) =>
                this.setState({ studentGrade: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Total Grade</label>
            <Input
              value={this.state.totalGrade}
              onChange={(event) =>
                this.setState({ totalGrade: event.target.value })
              }
            />
          </Form.Field>
          <Button primary loading={this.state.loading}>
            ADD Grade
          </Button>
        </Form>
      </div>
    );
  }
}

export default InstituteAdd;
