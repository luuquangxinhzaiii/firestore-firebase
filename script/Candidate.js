class Candidate {
  constructor(name, department, position, photo) {
    this.name = name;
    this.department = department;
    this.position = position;
    this.photo = photo;
  }
}
import { addCandidate, getCandidates, getCandidateById, updateCandidate, deleteCandidateById } from './firebaseService.js';
import { uploadPhoto } from './fileUpload.js';

let updateCandidateData;
let deleteId;

const defaultUrl = 'https://ucarecdn.com/'

document.getElementById("createCandidateForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const department = document.getElementById("department").value;
  const position = document.getElementById("position").value;
  const photoFile = document.getElementById("photo").files[0];
  const maxSize = 2 * 1024 * 1024; 
  if (photoFile && photoFile.size > maxSize) {
    alert('File size must be less than 2MB.');
    return;
  }
  const data = await uploadPhoto(photoFile);
  const photoURL = defaultUrl + data.file + '/' + photoFile.name;

  await addCandidate(name, department, position, photoURL)
    .then(() => {
      $('#addCandidateModal').modal('hide');
      document.getElementById('statusMessage').textContent = 'Ứng viên đã được thêm thành công!';
      $('#statusModal').modal('show');
    })
    .catch((error) => {
      $('#addCandidateModal').modal('hide');
      document.getElementById('statusMessage').textContent = 'Có lỗi xảy ra khi thêm ứng viên: ' + error.message;
      $('#statusModal').modal('show');
    });;
});

$('#statusModal').on('hidden.bs.modal', function () {
  location.reload();
});

async function loadCandidateList() {
  const querySnapshot = await getCandidates();
  const tbody = $('table tbody');
  tbody.empty();

  querySnapshot.forEach((doc) => {
    const row = `
          <tr>
              <td>
                  <span class="custom-checkbox">
                      <input type="checkbox" id="checkbox${doc.id}" name="options[]" value="${doc.id}">
                      <label for="checkbox${doc.id}"></label>
                  </span>
              </td>
              <td>${doc.name}</td>
              <td>${doc.department}</td>
              <td>${doc.position}</td>
              <td><img src="${doc.photo}" alt="Candidate Photo" width="100" height="100"></td>
              <td>
                  <a href="#editCandidateModal" onclick="editCandidate('${doc.id}')" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                  <a href="#deleteCandidateModal" onclick="waittingConfirmDelete('${doc.id}')" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
              </td>
          </tr>
      `;
    tbody.append(row);
  });
}

$(document).ready(function () {
  loadCandidateList();
});

async function editCandidate(candidateId) {
  const candidateDoc = await getCandidateById(candidateId);
  const candidate = candidateDoc.data();
  updateCandidateData = candidateDoc;

  $('#editCandidateModal #name').val(candidate.name);
  $('#editCandidateModal #department').val(candidate.department);
  $('#editCandidateModal #position').val(candidate.position);
  $('#editCandidateModal #photo').val('');

  $('#editCandidateModal').data('candidateId', candidateId);
}

document.getElementById("editCandidateModal").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = $('#editCandidateModal #name').val();
  const department = $('#editCandidateModal #department').val();
  const position = $('#editCandidateModal #position').val();
  const photoFile = $('#editCandidateModal #photo')[0].files[0];
  let photoURL = null;
  if (photoFile) {
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (photoFile.size > maxSize) {
      alert('File size must be less than 2MB.');
      return;
    }
    const data = await uploadPhoto(photoFile);
    photoURL = defaultUrl + data.file + '/' + photoFile.name;
  } else {
    const candidateDoc = updateCandidateData.data();
    photoURL = candidateDoc.uri;
  }

  const updatedCandidate = new Candidate(name, department, position, photoURL);

  await updateCandidate(updateCandidateData.id, updatedCandidate)
    .then(() => {
      $('#editCandidateModal').modal('hide');
      document.getElementById('statusMessage').textContent = 'Ứng viên đã được cập nhật thành công!';
      $('#statusModal').modal('show');
    })
    .catch((error) => {
      $('#editCandidateModal').modal('hide');
      document.getElementById('statusMessage').textContent = 'Có lỗi xảy ra khi cập nhật ứng viên: ' + error.message;
      $('#statusModal').modal('show');
    });
});

async function waittingConfirmDelete(candidateId) {
  deleteId = candidateId;  
}

document.getElementById("deleteCandidateModal").addEventListener("submit", async (event) => {
  event.preventDefault();

  await confirmDelete(deleteId);
});

async function confirmDelete(){
  try {
    await deleteCandidateById(deleteId);
    $('#deleteCandidateModal').modal('hide');
    document.getElementById('statusMessage').textContent = 'Candidate deleted successfully!';
    $('#statusModal').modal('show');
} catch (error) {
    $('#deleteCandidateModal').modal('hide');
    document.getElementById('statusMessage').textContent = 'Error deleting candidate: ' + error.message;
    $('#statusModal').modal('show');
}
}

window.editCandidate = editCandidate;
window.waittingConfirmDelete = waittingConfirmDelete;


