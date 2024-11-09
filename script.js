import { signIn, voteForCandidate, resetVote, getVoteResults, getCandidates } from "./script/firebaseService.js";
signIn();

const votes = await getVoteResults();
let totalVotes = votes.reduce((total, candidate) => total + candidate.totalVote, 0);
updateResults(votes);

async function updateResults(voteResults) {
  const totalVotes = voteResults.reduce((total, candidate) => total + candidate.totalVote, 0);
  document.getElementById('totalVotes').textContent = totalVotes;

  const ctx = document.getElementById("resultsChart").getContext("2d");
  const resultsChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: voteResults.map(candidate => candidate.name),
      datasets: [{
        label: "Votes",
        data: voteResults.map(candidate => candidate.totalVote),
        backgroundColor: ["#3498db", "#e74c3c", "#2ecc71"],
        borderColor: ["#2980b9", "#c0392b", "#27ae60"],
        borderWidth: 2,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      scales: { x: { beginAtZero: true } },
    },
  });

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

async function handleVote(candidate) {
  try {
    await voteForCandidate(candidate);
    const updatedVotes = await getVoteResults();
    updateResults(updatedVotes);
    showConfirmation(candidate);
  } catch (error) {
    alert(error.message);
  }
}

function showDetailedResults() {
  const votingBreakdown = document.getElementById('voteBreakdown');
  votingBreakdown.innerHTML = votes.map(candidate => `
    <p>${candidate.name}: <span>${candidate.totalVote}</span> votes (<span>${totalVotes > 0 ? ((candidate.totalVote / totalVotes) * 100).toFixed(2) + '%' : '0%'}</span>)</p>
  `).join('');
  document.getElementById('detailedResults').style.display = 'block';
}

async function handleReset() {
  try {
    await resetVote();
    alert("Phiếu bầu của bạn đã được xóa!");
    const updatedVotes = await getVoteResults();
    updateResults(updatedVotes);
  } catch (error) {
    alert(error.message);
  }
}

function showConfirmation(candidate) {
  const confirmationMessage = document.createElement('div');
  confirmationMessage.classList.add('confirmation');
  confirmationMessage.innerHTML = `Cảm ơn bạn đã bình chọn cho ${candidate.name}!`;

  document.body.appendChild(confirmationMessage);
  setTimeout(() => {
    confirmationMessage.classList.add('fade-out');
    setTimeout(() => confirmationMessage.remove(), 500);
  }, 3000);
}

async function loadVotingSection() {
  const candidates = await getCandidates();
  const votingSection = document.getElementById('voting-section');
  votingSection.innerHTML = candidates.map(candidate => `
    <div class="candidate-card">
      <img src="${candidate.photo}" alt="${candidate.name}">
      <h2>${candidate.name}</h2>
      <p>Position: ${candidate.position}</p>
      <button onclick="vote('${candidate.id}')">Vote for ${candidate.name}</button>
    </div>
  `).join('');
}

$(document).ready(() => {
  loadVotingSection();
});

window.vote = handleVote;
window.resetVotes = handleReset;
window.showDetailedResults = showDetailedResults;
