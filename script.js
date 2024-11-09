import { signIn, voteForCandidate, resetVote, getVoteResults, getCandidates } from "./script/firebaseService.js";
signIn();

let votes = await getVoteResults();

let totalVotes = votes.reduce((total, candidate) => total + candidate.totalVote, 0);
document.getElementById('totalVotes').textContent = totalVotes;

const ctx = document.getElementById("resultsChart").getContext("2d");
let resultsChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: votes.map(candidate => candidate.name),
    datasets: [
      {
        label: "Votes",
        data: votes.map(candidate => candidate.totalVote),
        backgroundColor: ["#3498db", "#e74c3c", "#2ecc71"],
        borderColor: ["#2980b9", "#c0392b", "#27ae60"],
        borderWidth: 2,
      },
    ],
  },
  options: {
    indexAxis: "y",
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  },
});

// Hàm bầu chọn và cập nhật kết quả
async function handleVote(candidate) {
    try {
        await voteForCandidate(candidate);
        votes = await getVoteResults();
        updateResults();
        showConfirmation(candidate);
    } catch (error) {
        alert(error.message);
    }
}

async function updateResults() {
  const voteResults = votes;

  resultsChart.data.labels = voteResults.map(candidate => candidate.name);
  resultsChart.data.datasets[0].data = voteResults.map(candidate => candidate.totalVote);
  resultsChart.update();

  const totalVotes = voteResults.reduce((total, candidate) => total + candidate.totalVote, 0);
  document.getElementById('totalVotes').textContent = totalVotes;

  voteResults.forEach((candidate, index) => {
    const candidateElement = document.getElementById(`candidate-${index}`);
    if (candidateElement) {
      candidateElement.innerHTML = `
        <h2>${candidate.name}</h2>
        <p>Tổng số phiếu: ${candidate.totalVote}</p>
      `;
    }
  });
}

function showDetailedResults() {
  const voteResults = votes;

  const votingBreakdown = document.getElementById('voteBreakdown');
  votingBreakdown.innerHTML = ''; 

  voteResults.forEach(candidate => {
      const candidateElement = document.createElement('div');
      candidateElement.innerHTML = `
          <p>
            ${candidate.name}: <span>${candidate.totalVote}</span> votes (<span >${totalVotes > 0 ? ((candidate.totalVote / totalVotes) * 100).toFixed(2) + '%' : '0'}%</span>)
          </p>
      `;

      votingBreakdown.appendChild(candidateElement);
  });
  // document.getElementById('votesA').textContent = totalVoteA;
  // document.getElementById('votesB').textContent = totalVoteB;
  // document.getElementById('votesC').textContent = totalVoteC;

  // document.getElementById('percentA').textContent = totalVotes > 0 ? ((votes.A / totalVotes) * 100).toFixed(2) + '%' : '0%';
  // document.getElementById('percentB').textContent = totalVotes > 0 ? ((votes.B / totalVotes) * 100).toFixed(2) + '%' : '0%';
  // document.getElementById('percentC').textContent = totalVotes > 0 ? ((votes.C / totalVotes) * 100).toFixed(2) + '%' : '0%';

   document.getElementById('detailedResults').style.display = 'block';
}

async function handleReset() {
    try {
        await resetVote();
        votes = await getVoteResults();
        alert("Phiếu bầu của bạn đã được xóa!");
        updateResults();
    } catch (error) {
        alert(error.message);
    }
}

function showConfirmation(candidate) {
  const confirmationMessage = document.createElement('div');
  confirmationMessage.classList.add('confirmation');
  confirmationMessage.innerHTML = `Thank you for voting for Candidate!`;

  document.body.appendChild(confirmationMessage);

  setTimeout(() => {
      confirmationMessage.classList.add('fade-out');
      setTimeout(() => confirmationMessage.remove(), 500);
  }, 3000);
}

async function loadVotingSection() {
  const candidates = await getCandidates();
  const votingSection = document.getElementById('voting-section');
  votingSection.innerHTML = ''; 

  candidates.sort((a, b) => {
    if (a.department < b.department) {
      return -1;
    } else if (a.department > b.department) {
      return 1;
    } else {
      return 0;
    }
  });

  candidates.forEach(candidate => {
      const candidateElement = document.createElement('div');
      candidateElement.classList.add('candidate-card');

      candidateElement.innerHTML = `
          <img src="${candidate.photo}" alt="${candidate.name}">
          <h2>${candidate.name}</h2>
          <p>${candidate.position}</p>
          <p>${candidate.department}</p>
          <button onclick="vote('${candidate.id}')">Vote</button>
      `;

      votingSection.appendChild(candidateElement);
  });
}

$(document).ready(function () {
  loadVotingSection();
  getVoteResults();
  updateResults();
});

// Gán hàm vào window để có thể gọi từ HTML
window.vote = handleVote;
window.resetVotes = handleReset;
window.showDetailedResults = showDetailedResults;