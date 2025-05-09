const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("SingleElectionVoting", function () {
  let electionContract;
  let admin, voter1, voter2, candidate1, candidate2;

  beforeEach(async function () {
    // Deploy the contract and get test accounts
    [admin, voter1, voter2, candidate1, candidate2] = await ethers.getSigners();
    const ElectionContract = await ethers.getContractFactory(
      "SingleElectionVoting"
    );
    electionContract = await ElectionContract.deploy();
    await electionContract.waitForDeployment();
  });

  it("should deploy the contract and set admin", async function () {
    const contractAdmin = await electionContract.admin();
    expect(contractAdmin).to.equal(admin.address);
  });

  describe("Admin Functions", function () {
    it("should create an election", async function () {
      const startTime = (await time.latest()) + 3600; // 1 hour from now
      const endTime = startTime + 3600; // 2 hours from now
      await electionContract.createElection(
        "Test Election",
        startTime,
        endTime
      );

      const electionName = await electionContract.getElectionName();
      expect(electionName).to.equal("Test Election");
    });

    it("should add a candidate", async function () {
      const currentTime = await time.latest();
      const startTime = currentTime + 2 * 86400; // 2 days later
      const endTime = startTime + 2 * 86400; // 2 days after startTime

      await electionContract.createElection(
        "Test Election",
        startTime,
        endTime
      );
      await electionContract.addCandidate(
        candidate1.address,
        "Candidate 1",
        "Party A"
      );

      const candidates = await electionContract.getCandidates();
      expect(candidates.length).to.equal(1);
      expect(candidates[0].name).to.equal("Candidate 1");
    });

    it("should add a voter", async function () {
      const startTime = (await time.latest()) + 86400; // 1 day later
      const endTime = startTime + 3600;

      await electionContract.createElection(
        "Test Election",
        startTime,
        endTime
      );
      await electionContract.addVoter(voter1.address, "Voter 1", 25);

      const voters = await electionContract.getVoters();
      expect(voters.length).to.equal(1);
      expect(voters[0].name).to.equal("Voter 1");
    });

    it("should start the election", async function () {
      await electionContract.createElection(
        "Test Election",
        (await time.latest()) + 3600,
        (await time.latest()) + 7200
      );

      await electionContract.startElection();
      const started = await electionContract.hasElectionStarted();
      expect(started).to.be.true;
    });
  });

  describe("Voting Functionality", function () {
    beforeEach(async function () {
      // Setup election
      const startTime = (await time.latest()) + 3600; // 1 hour from now
      const endTime = startTime + 3600;

      await electionContract.createElection(
        "Test Election",
        startTime,
        endTime
      );
      await electionContract.addCandidate(
        candidate1.address,
        "Candidate 1",
        "Party A"
      );
      await electionContract.addVoter(voter1.address, "Voter 1", 25);

      // Start the election
      await time.increaseTo(startTime);
      await electionContract.startElection();
    });

    /*it("should allow a voter to cast a vote", async function () {
      await electionContract.connect(voter1).vote(candidate1.address);

      const candidates = await electionContract.getCandidates();
      expect(candidates[0].voteCount).to.equal(1);
    });*/

    /*it("should not allow voting twice", async function () {
      await electionContract.connect(voter1).vote(candidate1.address);
      await expect(
        electionContract.connect(voter1).vote(candidate1.address)
      ).to.be.revertedWith("You have already voted.");
    });*/
  });

  describe("Election Results", function () {
    beforeEach(async function () {
      const startTime = (await time.latest()) + 3600; // 1 hour from now
      const endTime = startTime + 3600;

      await electionContract.createElection(
        "Test Election",
        startTime,
        endTime
      );
      await electionContract.addCandidate(
        candidate1.address,
        "Candidate 1",
        "Party A"
      );
      await electionContract.addCandidate(
        candidate2.address,
        "Candidate 2",
        "Party B"
      );
      await electionContract.addVoter(voter1.address, "Voter 1", 25);
      await electionContract.addVoter(voter2.address, "Voter 2", 30);

      await time.increaseTo(startTime);
      await electionContract.startElection();
    });

    /*it("should determine the winner correctly", async function () {
      await electionContract.connect(voter1).vote(candidate1.address);
      await electionContract.connect(voter2).vote(candidate2.address);

      await electionContract.endElection();
      const [name, party, voteCount] = await electionContract.getWinner();

      expect(voteCount).to.equal(1);
      expect(name).to.not.be.empty;
    });*/
  });
});
