document.addEventListener("DOMContentLoaded", async function() {
    const fundsTableBody = document.getElementById("funds-table-body");
    const proposalsDiv = document.getElementById("proposals");

    // Set up Web3
    let web3;
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else {
        alert('Please install MetaMask or use a compatible browser.');
        return;
    }

    // Your contract address and ABI (replace with your actual contract's details)
    const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your contract address
    const contractABI = [/* Your Contract ABI Here */]; // Replace with your contract ABI

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Fetch fund usages from smart contract
    async function loadFundUsages() {
        const fundUsages = await contract.methods.getFundUsages().call();
        fundUsages.forEach(data => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${data.project}</td>
                <td>${web3.utils.fromWei(data.amount, 'ether')} ETH</td>
                <td>${data.status}</td>
            `;
            fundsTableBody.appendChild(row);
        });
    }

    // Fetch proposals from smart contract
    async function loadProposals() {
        const proposalCount = await contract.methods.proposalCount().call();
        for (let i = 0; i < proposalCount; i++) {
            const proposal = await contract.methods.proposals(i).call();
            const proposalDiv = document.createElement("div");
            proposalDiv.classList.add("proposal");
            proposalDiv.innerHTML = `
                <h3>${proposal.title}</h3>
                <p>${proposal.description}</p>
                <button class="vote-btn" data-id="${i}">Vote</button>
                <span> Votes: <span class="vote-count">${proposal.voteCount}</span></span>
            `;
            proposalsDiv.appendChild(proposalDiv);
        }
    }

    // Voting functionality
    proposalsDiv.addEventListener("click", async (e) => {
        if (e.target.classList.contains("vote-btn")) {
            const proposalId = e.target.getAttribute("data-id");
            const accounts = await web3.eth.getAccounts();
            await contract.methods.vote(proposalId).send({ from: accounts[0] });
            const proposalVoteCountSpan = e.target.nextElementSibling.querySelector(".vote-count");
            const updatedVoteCount = parseInt(proposalVoteCountSpan.innerText) + 1;
            proposalVoteCountSpan.innerText = updatedVoteCount;
        }
    });

    // Load data on page load
    await loadFundUsages();
    await loadProposals();
});
const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed contract address
const contractABI = [ /* ABI generated from compilation */ ];

const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
const urbanContract = new web3.eth.Contract(contractABI, contractAddress);

async function createProposal(description) {
    const accounts = await web3.eth.getAccounts();
    await urbanContract.methods.createProposal(description).send({ from: accounts[0] });
}

async function vote(proposalId) {
    const accounts = await web3.eth.getAccounts();
    await urbanContract.methods.vote(proposalId).send({ from: accounts[0] });
}
