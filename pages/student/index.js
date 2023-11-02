import React, { Component } from "react";
import Transcript from "../../ethereum/transcript";
import factory from "../../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
//import Head from "next/document";

class StudentShow extends Component {
  institutes = [
    {
      id: "IIITB",
      name: "International Institute Bangalore",
      wallet: "",
    },
    {
      id: "IIITH",
      name: "International Institute Hyderbad",
      wallet: "",
    },
    {
      id: "IIITD",
      name: "International Institute Dharwad",
      wallet: "",
    },
  ];

  courses = ["10", "12", "UG", "PG"];

  state = {
    selectedCourse: "",
    selectedCollege: "",
  };

  static async getInitialProps(props) {
    let transcriptAddress;
    let subjects = {};
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
      const courses = ["10", "12", "UG", "PG"];
      for (const course of courses) {
        const requestCount = await transcript.methods
          .getSubjectsCount(course)
          .call();

        let subs = await Promise.all(
          Array(parseInt(requestCount))
            .fill()
            .map((element, index) => {
              return transcript.methods.getSubject(course, index + 1).call();
            })
        );

        console.log(subs);

        subjects[course] = subs;
      }
    }
    console.log("subjects", subjects);
    return { transcriptAddress, subjects, accountExists };
  }

  handleCourseChange = (event) => {
    this.setState({ selectedCourse: event.target.value });
  };

  handleCollegeChange = (event) => {
    this.setState({ selectedCollege: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // You can handle form submission here
    console.log("Selected Course: ", this.state.selectedCourse);
    console.log("Selected College: ", this.state.selectedCollege.id);
  };

  componentDidMount() {}

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
        <h1> Register</h1>

        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="course">Course:</label>
            <select
              id="course"
              value={this.state.selectedCourse}
              onChange={this.handleCourseChange}
            >
              <option value="">Select a course</option>
              {this.courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="college">College:</label>
            <select
              id="college"
              value={this.state.selectedCollege}
              onChange={this.handleCollegeChange}
            >
              <option value="">Select a college</option>
              {this.institutes.map((college) => (
                <option key={college.id} value={college}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Submit</button>
        </form>

        <h1>Courses</h1>
        <div>Course &emsp; College &emsp; Subject &emsp; Grade</div>

        <div>
          {Object.keys(this.props.subjects).map((key) => (
            <div key={key}>
              {this.props.subjects[key].map((element, index) => (
                // <div key={index}>{JSON.stringify(item)}</div>
                <div>
                  {key} &emsp;
                  {element["0"]} &emsp; {element["1"]} &emsp; {element["3"]} /
                  {element["2"]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default StudentShow;
