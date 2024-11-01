import { signIn, voteForCandidate, resetVote, getVoteResults } from "./firebaseService.js";

signIn();

const votes = await getVoteResults();
let totalVoteA = votes.A;
let totalVoteB = votes.B;
let totalVoteC = votes.C;

let totalVotes = totalVoteA + totalVoteB + totalVoteC;
document.getElementById('totalVotes').textContent = totalVotes;

const ctx = document.getElementById("resultsChart").getContext("2d");
let resultsChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Candidate A", "Candidate B", "Candidate C"],
    datasets: [
      {
        label: "Votes",
        data: [totalVoteA, totalVoteB, totalVoteC],
        backgroundColor: ["#3498db", "#e74c3c", "#2ecc71"],
        borderColor: ["#2980b9", "#c0392b", "#27ae60"],
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Hàm bầu chọn và cập nhật kết quả
async function handleVote(candidate) {
    try {
        await voteForCandidate(candidate);
        updateResults();
        showConfirmation(candidate);
    } catch (error) {
        alert(error.message);
    }
}

// Hàm hiển thị kết quả
async function updateResults() {
    const votes = await getVoteResults();

    // Cập nhật biểu đồ
    resultsChart.data.datasets[0].data = [votes.A, votes.B, votes.C];
    resultsChart.update();

    // Cập nhật hiển thị chi tiết
    totalVoteA = votes.A;
    totalVoteB = votes.B;
    totalVoteC = votes.C;
    const totalVotes = votes.A + votes.B + votes.C;
    document.getElementById('totalVotes').textContent = totalVotes;
}

function showDetailedResults() {
  document.getElementById('votesA').textContent = totalVoteA;
  document.getElementById('votesB').textContent = totalVoteB;
  document.getElementById('votesC').textContent = totalVoteC;

  document.getElementById('percentA').textContent = totalVotes > 0 ? ((votes.A / totalVotes) * 100).toFixed(2) + '%' : '0%';
  document.getElementById('percentB').textContent = totalVotes > 0 ? ((votes.B / totalVotes) * 100).toFixed(2) + '%' : '0%';
  document.getElementById('percentC').textContent = totalVotes > 0 ? ((votes.C / totalVotes) * 100).toFixed(2) + '%' : '0%';

  document.getElementById('detailedResults').style.display = 'block';
}

// Hàm reset phiếu bầu và cập nhật kết quả
async function handleReset() {
    try {
        await resetVote();
        alert("Phiếu bầu của bạn đã được xóa!");
        updateResults();
    } catch (error) {
        alert(error.message);
    }
}

function showConfirmation(candidate) {
  const confirmationMessage = document.createElement('div');
  confirmationMessage.classList.add('confirmation');
  confirmationMessage.innerHTML = `Thank you for voting for Candidate ${candidate}!`;

  document.body.appendChild(confirmationMessage);

  setTimeout(() => {
      confirmationMessage.classList.add('fade-out');
      setTimeout(() => confirmationMessage.remove(), 500);
  }, 3000);
}

// Gán hàm vào window để có thể gọi từ HTML
window.vote = handleVote;
window.resetVotes = handleReset;
window.showDetailedResults = showDetailedResults;

