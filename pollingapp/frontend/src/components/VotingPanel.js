import React, { useEffect, useState } from "react";
//1. Import exported functionality from contract.js for voting
//a. get candidates
//b. vote for candidate
import { getCandidates, voteForCandidate } from "../contract";

const VotingPanel = () => {
  //2. add states for components
  //candidates
  //selected candidate
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");

  //3. Implement the use effect
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const candidatesList = await getCandidates();
        setCandidates(candidatesList);
      } catch (error) {
        console.error(error.message);
        alert("Error fetching candidates.");
      }
    };

    fetchCandidates();
  }, []);

  //4. Implement Vote Btn Click
  const handleVote = async () => {
    try {
      await voteForCandidate(selectedCandidate);
      alert("Vote successfully cast!");
    } catch (error) {
      console.error(error.message);
      alert("Error casting vote.");
    }
  };

  //5. Implement the UI
  return (
    <div>
      <h1>Voting Panel</h1>
      <select onChange={(e) => setSelectedCandidate(e.target.value)}>
        <option>Select a Candidate</option>
        {candidates.map((candidate) => (
          <option
            key={candidate.candidateAddress}
            value={candidate.candidateAddress}
          >
            {candidate.name}
          </option>
        ))}
      </select>
      <button onClick={handleVote}>Vote</button>
    </div>
  );
};

export default VotingPanel;
