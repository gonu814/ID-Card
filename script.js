
      document.addEventListener('DOMContentLoaded', function() {
            // Elements
            const photoSection = document.getElementById('photoSection');
            const formSection = document.getElementById('formSection');
            const listSection = document.getElementById('listSection');
            const video = document.getElementById('video');
            const captureBtn = document.getElementById('captureBtn');
            const switchCamera = document.getElementById('switchCamera');
            const previewImg = document.getElementById('previewImg');
            const photoUpload = document.getElementById('photoUpload');
            const uploadTrigger = document.getElementById('uploadTrigger');
            const nextToForm = document.getElementById('nextToForm');
            const idCardForm = document.getElementById('idCardForm');
            const studentsList = document.getElementById('studentsList');
            const idCardModal = new bootstrap.Modal(document.getElementById('idCardModal'));
            const printBtn = document.getElementById('printBtn');
            const downloadBtn = document.getElementById('downloadBtn');
            
    // Step indicators
            const step1 = document.getElementById('step1');
            const step2 = document.getElementById('step2');
            const step3 = document.getElementById('step3');
            
            let stream = null;
            let currentFacingMode = 'user'; // 'user' for front camera, 'environment' for back camera
            let capturedPhotoData = null;
            let students = JSON.parse(localStorage.getItem('students')) || [];
            
             // Footer button actions
document.getElementById("homeBtn").addEventListener("click", function () {
    goToStep("capture");
});

document.getElementById("listBtn").addEventListener("click", function () {
    // Hide other sections
    document.getElementById("photoSection").classList.add("d-none");
    document.getElementById("formSection").classList.add("d-none");

    // Show list section
    document.getElementById("listSection").classList.remove("d-none");

    // Remove active from step indicator
    document.querySelectorAll(".step").forEach(step => step.classList.remove("active"));
});
function reverseGoToStep(stepId) {
    // Hide all sections
    photoSection.classList.add("d-none");
    formSection.classList.add("d-none");
    listSection.classList.add("d-none");

    // Reset step indicators
    step1.classList.remove("active", "completed");
    step2.classList.remove("active", "completed");
    step3.classList.remove("active", "completed");

    if (stepId === "capture") {
        // Go back to Step 1 (Capture Photo)
        photoSection.classList.remove("d-none");
        initCamera(); // restart camera
        step1.classList.add("active");
if (lastStudent.photo) {
    capturedPhotoData = lastStudent.photo;
    previewImg.src = capturedPhotoData;
    previewImg.style.display = 'block';
    document.querySelector('.photo-preview i').style.display = 'none';
}
    } else if (stepId === "form") {
        // Go back to Step 2 (Form) with last entered data
        formSection.classList.remove("d-none");
        step1.classList.add("completed");
        step2.classList.add("active");

        // Load the last student data from localStorage
        let savedStudents = JSON.parse(localStorage.getItem("students")) || [];
        if (savedStudents.length > 0) {
            let lastStudent = savedStudents[savedStudents.length - 1];
            document.getElementById("studentId").value = lastStudent.id;
            document.getElementById("studentName").value = lastStudent.name;
            document.getElementById("class").value = lastStudent.class;
             document.getElementById("section").value = lastStudent.section;
            document.getElementById("father").value = lastStudent.father;
            document.getElementById("dob").value = lastStudent.dob;
            document.getElementById("bloodGroup").value = lastStudent.bloodGroup;
            document.getElementById("phone").value = lastStudent.phone;
        }

    } else if (stepId === "preview") {
        // Stay at Step 3 (List/Preview)
        listSection.classList.remove("d-none");
        step1.classList.add("completed");
        step2.classList.add("completed");
        step3.classList.add("active");
    }
}

// Attach reverse navigation to step buttons
step1.addEventListener("click", () => reverseGoToStep("capture"));
step2.addEventListener("click", () => reverseGoToStep("form"));
step3.addEventListener("click", () => reverseGoToStep("preview"));
// Wrapper for Home button navigation
function goToStep(stepId) {
    reverseGoToStep(stepId);

    if (stepId === "capture") {
        // Reset form fields
        document.getElementById("idCardForm").reset();

        // Reset photo preview
        capturedPhotoData = null;
        previewImg.src = "";
        previewImg.style.display = "none";
        document.querySelector(".photo-preview i").style.display = "block";

        // Disable "Continue to Form" until new photo is captured/uploaded
        nextToForm.disabled = true;

        // Restart camera
        initCamera();
    }
}

           // Initialize camera
            function initCamera(facingMode = 'user') {
                stopCamera(); // Stop any existing stream
                
                const constraints = {
                    video: { 
                        facingMode: facingMode,
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    }
                };
                
                navigator.mediaDevices.getUserMedia(constraints)
                    .then(function(mediaStream) {
                        stream = mediaStream;
                        video.srcObject = stream;
                        currentFacingMode = facingMode;
                    })
                    .catch(function(err) {
                       console.error("Error accessing camera: ", err);
                       alert("Unable to access camera: " + err.message);
                  });
            }
            
            // Stop camera
            function stopCamera() {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }
            
            // Switch camera
            switchCamera.addEventListener('click', function() {
                const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
                initCamera(newFacingMode);
            });
            
            // Capture photo
            captureBtn.addEventListener('click', function() {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                capturedPhotoData = canvas.toDataURL('image/png');
                previewImg.src = capturedPhotoData;
                previewImg.style.display = 'block';
                document.querySelector('.photo-preview i').style.display = 'none';
                
                nextToForm.disabled = false;
            });
            
            // Upload photo trigger
            uploadTrigger.addEventListener('click', function() {
                photoUpload.click();
            });
            
            // Handle photo upload
            photoUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        capturedPhotoData = event.target.result;
                        previewImg.src = capturedPhotoData;
                        previewImg.style.display = 'block';
                        document.querySelector('.photo-preview i').style.display = 'none';
                        
                        nextToForm.disabled = false;
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // Next to form
            nextToForm.addEventListener('click', function() {
                photoSection.classList.add('d-none');
                formSection.classList.remove('d-none');
                stopCamera();
                
                step1.classList.remove('active');
                step1.classList.add('completed');
                step2.classList.add('active');
            });
            
          // Modified form submission
    idCardForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Build student object
        const student = {
            id: document.getElementById('studentId').value,
            name: document.getElementById('studentName').value,
            class: document.getElementById('class').value,
            section: document.getElementById('section').value,
            father: document.getElementById('fatherName').value,
            dob: document.getElementById('dob').value,
            bloodgroup: document.getElementById('bloodGroup').value,
            phone: document.getElementById('phone').value,
            photo: capturedPhotoData, // <-- from your camera/image capture
            issueDate: new Date().toLocaleDateString()
        };
        // Save to localStorage
        let students = JSON.parse(localStorage.getItem('students')) || [];
        if (students.length > 0) {
            students[students.length - 1] = student;
        } else {
            students.push(student);
        }
        localStorage.setItem('students', JSON.stringify(students));

        // --- SEND TO GOOGLE SHEETS (Cloud Excel) ---
        const formData = new FormData();
        for (const key in student) {
            formData.append(key, student[key]);
        }

        fetch(idCardForm.action, {
            method: "POST",
            body: formData
        })
        .then(res => res.json().catch(() => ({})))
        .then(response => {
            alert("Data saved to Google Sheet successfully!");
            console.log("Response:", response);
        })
        .catch(err => {
            alert("Failed to save data to Google Sheet");
            console.error(err);
        });

    // Update UI
    formSection.classList.add('d-none');
    listSection.classList.remove('d-none');
    updateStudentsList();

    step2.classList.remove('active');
    step2.classList.add('completed');
    step3.classList.add('active');
});
            
let studentss = []; // store all students from Google Sheet

// Fetch all students from your Apps Script Web App
async function loadStudents() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbziJ-DNNkOm0uRrGwCAba9JxLXU5STtianiFtoVN_2G8ujO_lCZp0BjsrGRSvlR1lpH/exec'); // replace with your doGet URL
        studentss = await response.json();
        updateStudentsList();
    } catch (err) {
        console.error('Failed to fetch students:', err);
    }
}

// Update table list
function updateStudentsList() {
    studentsList.innerHTML = '';

    studentss.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>
                <button class="btn btn-sm btn-primary view-btn" data-index="${index}">
                    <i class="bi bi-eye"></i> View Card
                </button>
            </td>
        `;
        studentsList.appendChild(row);
    });

    // Add click event listeners to all view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            showIdCard(studentss[index]);
        });
    });
}

            
            // Show ID card
           function showIdCard(student) {
    const dobDate = new Date(student.dob);
    const formattedDob = dobDate.toLocaleDateString('en-GB');

    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    const formattedValidUntil = validUntil.toLocaleDateString('en-GB');

    document.getElementById('previewName').textContent = student.name;
    document.getElementById('previewId').textContent = student.id;
    document.getElementById('backPreviewId').textContent = student.id;
    document.getElementById('previewclass').textContent = student.class;
    document.getElementById('previewsection').textContent = student.section;
    document.getElementById('backPreviewfather').textContent = student.father;
    document.getElementById('previewDob').textContent = `DOB: ${formattedDob}`;
    document.getElementById('previewBloodGroup').textContent = `Blood Group: ${student.bloodgroup || 'N/A'}`;
    document.getElementById('previewPhone').textContent = `Phone: ${student.phone || 'N/A'}`;
    document.getElementById('backPreviewName').textContent = student.name;
    document.getElementById('validUntil').textContent = formattedValidUntil;

   
        // 5️⃣ Handle photo
        let photoUrl = student.photo || '';

        // If it's Google Drive link, convert to direct viewable link
        if (photoUrl.includes('drive.google.com')) {
            const fileIdMatch = photoUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (fileIdMatch && fileIdMatch[1]) {
                const fileId = fileIdMatch[1];
                photoUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
            }
        }

        // 6️⃣ Fallback to placeholder if photo missing
        if (!photoUrl) {
            photoUrl = 'https://via.placeholder.com/150.png?text=No+Photo';
        }

        // 7️⃣ Apply photo to card
        const cardPhotoImg = document.getElementById('cardPhotoImg');
        cardPhotoImg.src = photoUrl;
        cardPhotoImg.alt = 'Student Photo';
        cardPhotoImg.style.display = 'block';

        console.log('Final photo URL:', photoUrl);

    
    // Show Bootstrap modal
    const idCardModal = new bootstrap.Modal(document.getElementById('idCardModal'));
    idCardModal.show();
}
            
            // Print ID card
            printBtn.addEventListener('click', function() {
                const printContent = document.getElementById('idCardContainer').innerHTML;
                const originalContent = document.body.innerHTML;
                
                document.body.innerHTML = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Print ID Card</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
                        <style>
                            body { 
                                padding: 20px; 
                                background: white !important;
                            }
                            .id-card {
                                width: 100%;
                                max-width: 400px;
                                background: white;
                                border-radius: 12px;
                                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                                overflow: hidden;
                                border: 1px solid #e0e0e0;
                                margin: 0 auto 20px auto;
                                page-break-inside: avoid;
                            }
                            .id-card-back {
                                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                            }
                            @media print {
                                body { 
                                    padding: 0; 
                                    margin: 0;
                                }
                                .id-card {
                                    box-shadow: none;
                                    margin: 0;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            ${printContent}
                        </div>
                    </body>
                    </html>
                `;
                
                window.print();
                document.body.innerHTML = originalContent;
                location.reload();
            });
            
            // Download ID card
            downloadBtn.addEventListener('click', function() {
                html2canvas(document.getElementById('idCardContainer')).then(function(canvas) {
                    const link = document.createElement('a');
                    link.download = `id-card-${document.getElementById('previewId').textContent}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                });
            });
            loadStudents();
            // Initialize the app
            initCamera();
            
            // If we have students, show the list directly
            if (studentss.length > 0) {
                photoSection.classList.add('d-none');
                formSection.classList.add('d-none');
                listSection.classList.remove('d-none');
                updateStudentsList();
                
                step1.classList.add('completed');
                step2.classList.add('completed');
                step3.classList.add('active');
            }
            
        });
        
