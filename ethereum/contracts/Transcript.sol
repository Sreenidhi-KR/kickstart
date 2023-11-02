pragma solidity ^0.4.17;

contract TranscriptFactory{
    address[] public transcripts;
    mapping(address => address) public studentTranscriptMapping;
    uint public instituteCount;
    struct Institute{
        string id;
        string name;
        address wallet;
    }
    Institute[] public institutes;

    function TranscriptFactory() public{
        instituteCount = 0;
    }


    function registerInstitute (string id , string name) public{
        Institute memory newInstitute = Institute({
            id : id,
            name : name,
            wallet : msg.sender
        });
        instituteCount ++;
        institutes.push(newInstitute);
    }


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
    }

    struct Course {
        string instituteId;
        string instituteName;
        string courseName;
        uint subjectCount;
        address instituteWallet;
        mapping(uint => Subject) subjects;
        uint creditRequirements;
        uint studentCredits;
        bool completed;
    }

   
    struct Request {
        string name;
        address requestor;
        bool status;
        uint index;
    }

    Request[] public requests;

    uint public requestCount;

    address public studentAddress;
    mapping (string => Course)  courses;
    mapping (address => bool) accessors;
    function Transcript(address studAdd) public {
        studentAddress = studAdd; 
        accessors[studAdd] = true;
        requestCount = 0;
    }

    

    function registerCourse(string courseName , address instituteWallet , string instituteName , string instituteId , uint creditReq) public{
        Course memory newCourse = Course({
            instituteId : instituteId,
            instituteName : instituteName,
            subjectCount : 0,
            courseName : courseName,
            instituteWallet : instituteWallet,
            creditRequirements : creditReq,
            studentCredits : 0,
            completed : false
        });
        courses[courseName] = newCourse;
    }


    function addSubject(string courseName , string subjectName , string totalGrade , string studentGrade , uint credits  ) public {
        Course storage course = courses[courseName];
        require(course.instituteWallet == msg.sender);
        Subject memory newSubject = Subject({
            subjectName : subjectName,
            totalGrade : totalGrade,
            studentGrade : studentGrade
        });
        course.subjectCount++;
        course.studentCredits += credits;
        if(course.studentCredits >= course.creditRequirements){
            course.completed = true;
        }
        course.subjects[course.subjectCount] = newSubject;
    }

    function requestPermission(string name ) public{
        Request memory newRequest = Request({
            name : name,
            requestor : msg.sender ,
            status : false,
            index : requestCount + 1
        });
        requestCount++;
        requests.push(newRequest);
    }

    function acceptRequest(uint index) public{
        require(msg.sender == studentAddress);
        Request storage request = requests[index];
        request.status = true;
        accessors[request.requestor] = true;
    }

    function getSubject( string courseName , uint index) public view returns (string  , string , string , string  ){
        require(accessors[msg.sender] == true);
        Course storage course = courses[courseName];
        if(compareStringsbyBytes(course.courseName , "")) return ("" , "" ,"" ,"");
        Subject memory subject = course.subjects[index];
        return (course.instituteName , subject.subjectName , subject.totalGrade , subject.studentGrade);
    }

    function getSubjectsCount(string courseName) public view returns (uint) {
        Course memory course = courses[courseName];
        return course.subjectCount;
    }

    function compareStringsbyBytes(string s1, string s2) public pure returns(bool){
     return keccak256(s1) == keccak256(s2);
    }
}