import React, { useState, useEffect } from "react";
//1. Import the Admin functionalities exported by contract.js
//create election
//get election name
//start election
//election started state
//end election
//election end state
//election winner
//add candidate
//get candidate
//add voter
//get voters
import {
  createElection,
  getElectionName,
  startElection,
  hasElectionStartedFromContract,
  endElection,
  hasElectionFinalizedFromContract,
  getWinner,
  addCandidate,
  getCandidates,
  addVoter,
  getVoters,
} from "../contract";

const AdminPanel = () => {
  //2. Create the states for following required data
  //election name
  //election name while adding
  //election startDate
  //election endData
  //has election started
  //has election finalized
  //election winner
  const [electionName, setElectionName] = useState("");
  const [addElectionName, setAddElectionName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hasElectionStarted, setElectionStarted] = useState(false);
  const [hasElectionFinalized, setHasElectionFinalized] = useState(false);
  const [winnerName, setWinnerName] = useState("");

  //candidate address
  //candidate name
  //candidate party
  //candidates array
  const [candidateAddress, setCandidateAddress] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateParty, setCandidateParty] = useState("");
  const [candidates, setCandidates] = useState([]);

  //voter address
  //voter name
  //voter age
  //voters array
  const [voterAddress, setVoterAddress] = useState("");
  const [voterName, setVoterName] = useState("");
  const [voterAge, setVoterAge] = useState("");
  const [voters, setVoters] = useState([]);

  //3. Implement the useEffect hooks to load data
  //a. fetch election name
  //b. fetch election start status
  //c. fetch election end status
  //d. fetch winner
  //e. fetch candidates
  //f. fetch voters

  useEffect(() => {
    const fetchElectionName = async () => {
      try {
        const electionName = await getElectionName();
        if (!electionName || electionName.trim() === "") {
        } else {
          setElectionName(electionName);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    const fetchElectionStartStatus = async () => {
      try {
        const status = await hasElectionStartedFromContract();
        setElectionStarted(status);
      } catch (error) {
        console.error(error.message);
      }
    };
    const fetchElectionFinalizedStatus = async () => {
      try {
        const status = await hasElectionFinalizedFromContract();
        setHasElectionFinalized(status);
      } catch (error) {
        console.error(error.message);
      }
    };
    const fetchWinner = async () => {
      try {
        const winner = await getWinner();
        if (!winner || winner.name.trim() === "") {
        } else {
          setWinnerName(winner.name);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    const fetchCandidates = async () => {
      try {
        const candidates = await getCandidates();
        if (Array.isArray(candidates) && candidates.length === 0) {
        } else {
          setCandidates(candidates);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    const fetchVoters = async () => {
      try {
        const voters = await getVoters();
        if (Array.isArray(voters) && voters.length === 0) {
        } else {
          setVoters(voters);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchElectionName();
    fetchElectionStartStatus();
    fetchElectionFinalizedStatus();
    fetchWinner();
    fetchCandidates();
    fetchVoters();
  }, []);

  //3. Implement the event handlers
  //a. button click to create election
  const handleCreateElection = async () => {
    try {
      await createElection(addElectionName, startDate, endDate);
      setElectionName(addElectionName);
    } catch (error) {
      alert(`Error creating election: ${error.message}`);
    }
  };
  //b. button click to add the candidate
  const handleAddCandidate = async () => {
    try {
      await addCandidate(candidateAddress, candidateName, candidateParty);
      setCandidates((prev) => [
        ...prev,
        {
          address: candidateAddress,
          name: candidateName,
          party: candidateParty,
        },
      ]);
      setCandidateAddress("");
      setCandidateName("");
      setCandidateParty("");
    } catch (error) {
      alert(`Error creating election: ${error.message}`);
    }
  };

  //c. button click to add the voter
  const handleAddVoter = async () => {
    try {
      await addVoter(voterAddress, voterName, voterAge);
      setVoters((prev) => [
        ...prev,
        { address: voterAddress, name: voterName, age: voterAge },
      ]);
      alert("Voter added successfully!");
      setVoterAddress("");
      setVoterName("");
      setVoterAge("");
    } catch (error) {
      alert(`Error adding voter: ${error.message}`);
    }
  };
  //d. button click to start the election
  const handleStartElection = async () => {
    try {
      await startElection();
      alert("Election Started successfully!");
      setElectionStarted(true);
    } catch (error) {
      alert(`Error adding voter: ${error.message}`);
    }
  };

  //e. button click to end the election
  const handleEndElection = async () => {
    try {
      await endElection();
      alert("Election Finalized successfully!");
      //setFinalized
    } catch (error) {
      alert(`Error adding voter: ${error.message}`);
    }
  };

  //4. Create the UI
  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Section to create election */}
      <div>
        {electionName ? (
          <h2>Election Name: {electionName}</h2>
        ) : (
          <>
            <h2>Create Election</h2>
            <input
              type="text"
              placeholder="Election Name"
              value={addElectionName}
              onChange={(e) => setAddElectionName(e.target.value)}
            />
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button onClick={handleCreateElection}>Create Election</button>
          </>
        )}
      </div>
      <div>{winnerName ? <h3>Winner Name: {winnerName}</h3> : <></>}</div>
      {/* Section to manage candidates */}
      <div>
        <h2>Manage Candidates</h2>
        <input
          type="text"
          placeholder="Candidate Address"
          value={candidateAddress}
          onChange={(e) => setCandidateAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Candidate Party"
          value={candidateParty}
          onChange={(e) => setCandidateParty(e.target.value)}
        />
        <button onClick={handleAddCandidate}>Add Candidate</button>
        <ul>
          {candidates.length === 0 ? (
            <li>No candidates available.</li>
          ) : (
            candidates.map((candidate, index) => (
              <li key={index}>
                <strong>Name:</strong> {candidate.name},<strong> Party:</strong>{" "}
                {candidate.party},<strong>Address:</strong>{" "}
                {candidate.candidateAddress}
              </li>
            ))
          )}
        </ul>
      </div>
      {/* Section to manage voters */}
      <div>
        <h2>Manage Voters</h2>
        <input
          type="text"
          placeholder="Voter Address"
          value={voterAddress}
          onChange={(e) => setVoterAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Voter Name"
          value={voterName}
          onChange={(e) => setVoterName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Voter Age"
          value={voterAge}
          onChange={(e) => setVoterAge(e.target.value)}
        />
        <button onClick={handleAddVoter}>Add Voter</button>
        <ul>
          {voters.length === 0 ? (
            <li>No voters available.</li>
          ) : (
            voters.map((voter, index) => (
              <li key={index}>
                <strong>Name:</strong> {voter.name}
                <strong> Address:</strong> {voter.voterAddress}
              </li>
            ))
          )}
        </ul>
      </div>
      {/* Section to manage start and end of election */}
      <div>
        {hasElectionStarted ? (
          hasElectionFinalized ? (
            <></>
          ) : (
            <button onClick={handleEndElection}>End Election</button>
          )
        ) : hasElectionFinalized ? (
          <></>
        ) : (
          <button onClick={handleStartElection}>Start Election</button>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
