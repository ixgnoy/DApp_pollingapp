// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.27;

import "hardhat/console.sol";

contract SingleElectionVoting {

	//******* Phase-1 ********

	//1. Create the struct for Voter
    struct Voter {
        address voterAddress;
        string name;
        uint256 age;
        bool hasVoted;
    }

	//2. Create the struct for Candidate
    struct Candidate {
        address candidateAddress;
        string name;
        string partyName;
        uint256 voteCount;
    }

	//3. Create the struct for Election
    struct Election {
        string name;
        uint256 startDate;
        uint256 endDate;
        address[] candidateAddresses;
        address[] voterAddresses;
        mapping(address=>Voter)voterList;
        mapping(address=>Candidate)candidateList;
        bool started;
        bool finalized;
    }
  
	//4. Add Properties to smart contract
    Election public election;

    address public admin;

	//5. Add modifiers to establish constraints
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only Admin can perform this operation");
        _;
    }

    modifier onlyBefore(uint256 _timestamp) {
        require(block.timestamp < _timestamp,"Operation is not allowed after this time.");
        _;
    }

    modifier onlyDuring(uint256 _start, uint256 _end) {
        require(block.timestamp >= _start && block.timestamp <= _end, "Action only allowed during the election.");
        _;
    }

    modifier onlyAfter(uint256 _timestamp) {
        require(block.timestamp > _timestamp, "Action only allowed after this time.");
        _;
    }
    
	//6. Add constructor
    constructor() {
        console.log("Contract Deployed by: ", msg.sender);
        admin = msg.sender;
    }

	//******* Phase-2 ********
	
	//7. Add function to create election
    function createElection(string memory _name, uint256 _startDate, uint256 _endDate) external onlyAdmin {
        require(bytes(election.name).length == 0, "Election already created.");
        require(_startDate > block.timestamp, "Start date must be in the future.");
        require(_endDate > _startDate, "End date must be after start date.");
        election.name = _name;
        election.startDate = _startDate;
        election.endDate = _endDate;
        election.started = false;
        election.finalized = false;  
    }

	//8. Add function to get election name
    function getElectionName() external view returns (string memory) {
        return election.name;
    }

	//9. Add candidate
    function addCandidate(address _candidateAddress, string memory _name, string memory _party) external onlyAdmin onlyBefore(election.startDate - 1 days) {
        require(election.candidateList[_candidateAddress].candidateAddress == address(0), "Candidate already added.");
        election.candidateList[_candidateAddress] = Candidate(_candidateAddress, _name, _party, 0);
        election.candidateAddresses.push(_candidateAddress);

    }

	//10. Get Candidates
    function getCandidates() external view returns (Candidate[] memory) {
        uint256 numCandidates = election.candidateAddresses.length;

        Candidate[] memory candidates = new Candidate[](numCandidates);
        for (uint256 i = 0; i < numCandidates; i++) {
            candidates[i] = election.candidateList[election.candidateAddresses[i]];
        }

        return candidates;
    }

	//11. Add voter
     function addVoter(address _voterAddress, string memory _name, uint256 _age) 
        external 
        onlyAdmin 
        onlyBefore(election.startDate) 
    {
        require(election.voterList[_voterAddress].voterAddress == address(0), "Voter already added.");
        election.voterList[_voterAddress] = Voter(_voterAddress, _name, _age, false);
        election.voterAddresses.push(_voterAddress);
    }
    

	//12. Get Voters
     function getVoters() external view returns (Voter[] memory) {
        uint256 numVoters = election.voterAddresses.length;
        
        Voter[] memory voters = new Voter[](numVoters);
        for(uint256 i = 0; i < numVoters; i++) {
            voters[i] = election.voterList[election.voterAddresses[i]];
        }
        return voters;
    }

	//******* Phase-3 ********

	//13. Start Election, hasElectionStarted
     function startElection() external onlyAdmin {
        election.started = true;
    }

    function hasElectionStarted() external view returns (bool) {
        return election.started;
    }
    
	//14. End Election, hasElectionFinalized
    function endElection() external onlyAdmin {
        election.finalized = true;
    }

    function hasElectionFinalized() external view returns (bool) {
        return election.finalized;
    }

	//15. Vote
    function vote(address _candidateAddress) external {
        console.log("Voter Address: ",msg.sender);
        Voter storage voter = election.voterList[msg.sender];
        require(voter.voterAddress != address(0), "You are not eligible to vote.");
        require(election.candidateList[_candidateAddress].candidateAddress != address(0), "Invalid candidate.");
        require(election.started);
        require(!voter.hasVoted, "You have already voted.");
        voter.hasVoted = true;
        election.candidateList[_candidateAddress].voteCount++;
    }

    //16. Get Winner
    function getWinner() external view returns (string memory name, string memory partyName, uint256 voteCount) {
        require(election.candidateAddresses.length > 0, "No candidates in the election.");
        require(election.finalized, "Election has not been finalized.");
        uint256 maxVotes = 0;
        address winnerAddress = address(0);
        for (uint256 i = 0; i < election.candidateAddresses.length; i++) {
            address candidateAddress = election.candidateAddresses[i];
            Candidate storage candidate = election.candidateList[candidateAddress];
            if (candidate.voteCount > maxVotes) {
                maxVotes = candidate.voteCount;
                winnerAddress = candidateAddress;
            }
        }

        if (winnerAddress != address(0)) {
            Candidate storage winner = election.candidateList[winnerAddress];
            return (winner.name, winner.partyName, winner.voteCount);
        } else {
            return ("No winner", "", 0);
        }

    }
}