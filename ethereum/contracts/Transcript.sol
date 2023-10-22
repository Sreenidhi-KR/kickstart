pragma solidity ^0.4.17;

contract TranscriptFactory{
    address[] public transcripts;
    mapping(address => address) public studentTranscriptMapping;

    function createTranscript() public{
        require(studentTranscriptMapping[msg.sender] == address(0));
        address newTranscript  = new Transcript(msg.sender);
        transcripts.push(newTranscript);
        studentTranscriptMapping[msg.sender] = newTranscript;
    }

    function getTranscripts() public view returns (address[]){
        return transcripts;
    }

    function doesTranscriptExists(address studentAdd) public view returns (bool){
        return studentTranscriptMapping[studentAdd] != address(0);
    }
}


contract Transcript{

    struct Subject{
        string subjectName;
        string totalGrade;
        string studentGrade;
        string college;
    }

    address public studentAddress;
    Subject [] public subjects;

    function getSubjectsCount() public view returns (uint) {
        return subjects.length;
    }


    function Transcript(address student) public {
        studentAddress = student; 
    }

    function addSubject(string subjectName , string totalGrade , string studentGrade , string college ) public {
        Subject memory newSubject = Subject({
            subjectName : subjectName,
            totalGrade : totalGrade,
            studentGrade : studentGrade,
            college : college
        });
        subjects.push(newSubject);
    }

    
}