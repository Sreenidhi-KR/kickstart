import React, { Component } from "react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Form, Button, Message } from "semantic-ui-react";
import Head from "next/head";
import { Link, Router } from "../../routes";

class StudentNew extends Component {
  // static async getInitialProps() {
  //   return {};
  // }
  state = {
    loading: false,
    errorMessage: "",
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();

      const gasEstimate = await factory.methods
        .createTranscript()
        .estimateGas({ from: accounts[0] });
      console.log(gasEstimate);
      const encode = await factory.methods.createTranscript().encodeABI();

      const tx = await web3.eth.sendTransaction({
        from: accounts[0],
        gas: gasEstimate,
        data: encode,
        to: "0x1e07c52D1304BF41fb4AB14581Cf03C3412282A8",
      });

      // await factory.methods.createTranscript().send({
      //   from: accounts[0],
      // });

      Router.pushRoute(`/student/${accounts[0]}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <div>
        <Head>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
          ></link>
        </Head>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Create Transcript
          </Button>
        </Form>
      </div>
    );
  }
}

export default StudentNew;
