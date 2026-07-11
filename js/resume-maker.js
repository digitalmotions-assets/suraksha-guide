class ResumeMaker {
constructor(containerId = 'resumeMaker') {
this.container = document.getElementById(containerId);
if (!this.container) {
console.error(Container #${containerId} not found.);
return;
}
    this.themes = {
        'Professional Blue': { text: 'text-primary', bg: 'bg-primary', border: 'border-primary' },
        'Corporate Gray': { text: 'text-secondary', bg: 'bg-secondary', border: 'border-secondary' },
        'Modern Green': { text: 'text-success', bg: 'bg-success', border: 'border-success' },
        'Executive Black': { text: 'text-dark', bg: 'bg-dark', border: 'border-dark' }
    };

    this.defaultState = {
        theme: 'Professional Blue',
        personal: {
            fullName: '', mobile: '', email: '', address: '', dob: '', gender: '',
            nationality: '', languages: '', linkedin: '', portfolio: '', photo: ''
        },
        objective: '',
        education: [],
        experience: [],
        skills: [],
        certificates: []
    };

    this.state = this.loadLocal() || JSON.parse(JSON.stringify(this.defaultState));
    this.render();
    this.bindEvents();
    this.updatePreview();
}

loadLocal() {
    const saved = localStorage.getItem('resumeMakerData');
    return saved ? JSON.parse(saved) : null;
}

saveLocal() {
    localStorage.setItem('resumeMakerData', JSON.stringify(this.state));
}

render() {
    this.container.innerHTML = `
        <div class="container-fluid py-4 bg-light min-vh-100">
            <div class="row g-4">
                <!-- Form Column -->
                <div class="col-xl-6 col-lg-6 col-md-12">
                    <div class="card shadow-sm border-0">
                        <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                            <h4 class="mb-0 fw-bold text-dark"><i class="bi bi-file-earmark-person"></i> Resume Builder</h4>
                            <select id="themeSelect" class="form-select form-select-sm w-auto">
                                ${Object.keys(this.themes).map(t => `<option value="${t}" ${this.state.theme === t ? 'selected' : ''}>${t}</option>`).join('')}
                            </select>
                        </div>
                        <div class="card-body p-4 overflow-auto" style="max-height: 85vh;">
                            <form id="resumeForm" novalidate>
                                <!-- Personal Details -->
                                <h5 class="fw-bold mb-3 border-bottom pb-2">Personal Details</h5>
                                <div class="row g-3 mb-4">
                                    <div class="col-md-8">
                                        <label class="form-label">Full Name</label>
                                        <input type="text" class="form-control" id="fullName" value="${this.state.personal.fullName}" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label">Profile Photo</label>
                                        <input type="file" class="form-control" id="photoUpload" accept="image/*">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" id="email" value="${this.state.personal.email}" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Mobile</label>
                                        <input type="tel" class="form-control" id="mobile" value="${this.state.personal.mobile}" pattern="[0-9]{10}" required>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label">Address</label>
                                        <input type="text" class="form-control" id="address" value="${this.state.personal.address}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Date of Birth</label>
                                        <input type="date" class="form-control" id="dob" value="${this.state.personal.dob}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Gender</label>
                                        <select class="form-select" id="gender">
                                            <option value="">Select</option>
                                            <option value="Male" ${this.state.personal.gender === 'Male' ? 'selected' : ''}>Male</option>
                                            <option value="Female" ${this.state.personal.gender === 'Female' ? 'selected' : ''}>Female</option>
                                            <option value="Other" ${this.state.personal.gender === 'Other' ? 'selected' : ''}>Other</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Nationality</label>
                                        <input type="text" class="form-control" id="nationality" value="${this.state.personal.nationality}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Languages Known</label>
                                        <input type="text" class="form-control" id="languages" value="${this.state.personal.languages}" placeholder="English, Hindi, Marathi">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">LinkedIn</label>
                                        <input type="url" class="form-control" id="linkedin" value="${this.state.personal.linkedin}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Portfolio URL</label>
                                        <input type="url" class="form-control" id="portfolio" value="${this.state.personal.portfolio}">
                                    </div>
                                </div>

                                <!-- Career Objective -->
                                <h5 class="fw-bold mb-3 border-bottom pb-2">Career Objective</h5>
                                <div class="mb-4">
                                    <select class="form-select mb-2" id="objectivePreset">
                                        <option value="">Choose a preset or type below...</option>
                                        <option value="Fresher looking for an entry-level position to utilize my skills and grow.">Fresher</option>
                                        <option value="Experienced professional seeking to leverage my expertise in a dynamic organization.">Experienced</option>
                                        <option value="Dedicated Security Guard focused on maintaining safe and secure environments.">Security Guard</option>
                                        <option value="Vigilant Security Supervisor with proven team leadership and risk management skills.">Security Supervisor</option>
                                        <option value="Professional Security Officer committed to protecting personnel and property.">Security Officer</option>
                                        <option value="Certified Fire Guard trained in emergency response and fire prevention protocols.">Fire Guard</option>
                                        <option value="Safety Officer dedicated to ensuring workplace compliance and hazard reduction.">Safety Officer</option>
                                    </select>
                                    <textarea class="form-control" id="objectiveText" rows="3">${this.state.objective}</textarea>
                                </div>

                                <!-- Education -->
                                <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                                    <h5 class="fw-bold mb-0">Education</h5>
                                    <button type="button" class="btn btn-sm btn-outline-primary" id="addEduBtn">+ Add</button>
                                </div>
                                <div id="educationContainer" class="mb-4"></div>

                                <!-- Experience -->
                                <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                                    <h5 class="fw-bold mb-0">Experience</h5>
                                    <button type="button" class="btn btn-sm btn-outline-primary" id="addExpBtn">+ Add</button>
                                </div>
                                <div id="experienceContainer" class="mb-4"></div>

                                <!-- Skills -->
                                <h5 class="fw-bold mb-3 border-bottom pb-2">Skills</h5>
                                <div class="mb-4">
                                    <div class="input-group mb-2">
                                        <input type="text" class="form-control" id="skillInput" placeholder="e.g. Access Control, Fire Fighting">
                                        <button class="btn btn-primary" type="button" id="addSkillBtn">Add Skill</button>
                                    </div>
                                    <div class="small text-muted mb-2">Suggestions: Access Control, Visitor Management, Patrolling, Fire Fighting, CCTV Monitoring, Emergency Response, First Aid, Leadership, Communication, Customer Service</div>
                                    <div id="skillsContainer" class="d-flex flex-wrap gap-2"></div>
                                </div>

                                <!-- Certificates -->
                                <h5 class="fw-bold mb-3 border-bottom pb-2">Certificates</h5>
                                <div class="mb-4">
                                    <div class="input-group mb-2">
                                        <input type="text" class="form-control" id="certInput" placeholder="e.g. PSARA, First Aid">
                                        <button class="btn btn-primary" type="button" id="addCertBtn">Add Cert</button>
                                    </div>
                                    <div class="small text-muted mb-2">Suggestions: PSARA, Fire Fighting, First Aid, Driving Licence, Police Verification, Computer</div>
                                    <div id="certsContainer" class="d-flex flex-wrap gap-2"></div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>

                <!-- Preview Column -->
                <div class="col-xl-6 col-lg-6 col-md-12">
                    <div class="card shadow-sm border-0 h-100 bg-secondary" style="--bs-bg-opacity: .1;">
                        <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                            <h4 class="mb-0 fw-bold text-dark">Live Preview</h4>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-secondary" id="printBtn"><i class="bi bi-printer"></i> Print</button>
                                <button class="btn btn-sm btn-primary" id="downloadBtn"><i class="bi bi-download"></i> Download PDF</button>
                            </div>
                        </div>
                        <div class="card-body p-4 overflow-auto d-flex justify-content-center" style="max-height: 85vh;">
                            <div id="resumePreview" class="bg-white shadow p-5 w-100" style="max-width: 210mm; min-height: 297mm;">
                                <!-- Preview Content Injected Here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    this.renderLists();
}

renderLists() {
    const eduContainer = document.getElementById('educationContainer');
    eduContainer.innerHTML = '';
    this.state.education.forEach((edu, index) => {
        eduContainer.innerHTML += `
            <div class="card mb-2 border-0 bg-light p-3 position-relative">
                <button type="button" class="btn-close position-absolute top-0 end-0 m-2" onclick="resumeApp.removeEducation(${index})"></button>
                <div class="row g-2">
                    <div class="col-md-6"><input type="text" class="form-control form-control-sm edu-degree" placeholder="Degree/Course" value="${edu.degree}" data-idx="${index}"></div>
                    <div class="col-md-6"><input type="text" class="form-control form-control-sm edu-inst" placeholder="Institute/University" value="${edu.institute}" data-idx="${index}"></div>
                    <div class="col-md-6"><input type="text" class="form-control form-control-sm edu-year" placeholder="Year" value="${edu.year}" data-idx="${index}"></div>
                    <div class="col-md-6"><input type="text" class="form-control form-control-sm edu-marks" placeholder="Grade/Percentage" value="${edu.marks}" data-idx="${index}"></div>
                </div>
            </div>
        `;
    });

    const expContainer = document.getElementById('experienceContainer');
    expContainer.innerHTML = '';
    this.state.experience.forEach((exp, index) => {
        expContainer.innerHTML += `
            <div class="card mb-2 border-0 bg-light p-3 position-relative">
                <button type="button" class="btn-close position-absolute top-0 end-0 m-2" onclick="resumeApp.removeExperience(${index})"></button>
                <div class="row g-2">
                    <div class="col-md-6"><input type="text" class="form-control form-control-sm exp-comp" placeholder="Company Name" value="${exp.company}" data-idx="${index}"></div>
                    <div class="col-md-6"><input type="text" class="form-control form-control-sm exp-desig" placeholder="Designation" value="${exp.designation}" data-idx="${index}"></div>
                    <div class="col-12"><input type="text" class="form-control form-control-sm exp-dur" placeholder="Duration (e.g. Jan 2020 - Present)" value="${exp.duration}" data-idx="${index}"></div>
                    <div class="col-12"><textarea class="form-control form-control-sm exp-resp" placeholder="Responsibilities" rows="2" data-idx="${index}">${exp.responsibilities}</textarea></div>
                </div>
            </div>
        `;
    });

    const skillsContainer = document.getElementById('skillsContainer');
    skillsContainer.innerHTML = this.state.skills.map((skill, i) => 
        `<span class="badge bg-secondary d-flex align-items-center gap-1 p-2">${skill} <i class="bi bi-x-circle cursor-pointer" style="cursor:pointer;" onclick="resumeApp.removeSkill(${i})"></i></span>`
    ).join('');

    const certsContainer = document.getElementById('certsContainer');
    certsContainer.innerHTML = this.state.certificates.map((cert, i) => 
        `<span class="badge bg-info text-dark d-flex align-items-center gap-1 p-2">${cert} <i class="bi bi-x-circle cursor-pointer" style="cursor:pointer;" onclick="resumeApp.removeCertificate(${i})"></i></span>`
    ).join('');
}

bindEvents() {
    const form = document.getElementById('resumeForm');
    
    form.addEventListener('input', (e) => {
        const id = e.target.id;
        
        if (id in this.state.personal) {
            this.state.personal[id] = e.target.value;
        } else if (id === 'objectiveText') {
            this.state.objective = e.target.value;
        } else if (e.target.classList.contains('edu-degree')) {
            this.state.education[e.target.dataset.idx].degree = e.target.value;
        } else if (e.target.classList.contains('edu-inst')) {
            this.state.education[e.target.dataset.idx].institute = e.target.value;
        } else if (e.target.classList.contains('edu-year')) {
            this.state.education[e.target.dataset.idx].year = e.target.value;
        } else if (e.target.classList.contains('edu-marks')) {
            this.state.education[e.target.dataset.idx].marks = e.target.value;
        } else if (e.target.classList.contains('exp-comp')) {
            this.state.experience[e.target.dataset.idx].company = e.target.value;
        } else if (e.target.classList.contains('exp-desig')) {
            this.state.experience[e.target.dataset.idx].designation = e.target.value;
        } else if (e.target.classList.contains('exp-dur')) {
            this.state.experience[e.target.dataset.idx].duration = e.target.value;
        } else if (e.target.classList.contains('exp-resp')) {
            this.state.experience[e.target.dataset.idx].responsibilities = e.target.value;
        }
        
        this.saveLocal();
        this.updatePreview();
    });

    document.getElementById('objectivePreset').addEventListener('change', (e) => {
        if (e.target.value) {
            document.getElementById('objectiveText').value = e.target.value;
            this.state.objective = e.target.value;
            this.saveLocal();
            this.updatePreview();
        }
    });

    document.getElementById('photoUpload').addEventListener('change', this.uploadPhoto.bind(this));
    document.getElementById('themeSelect').addEventListener('change', this.changeTheme.bind(this));
    document.getElementById('addEduBtn').addEventListener('click', this.addEducation.bind(this));
    document.getElementById('addExpBtn').addEventListener('click', this.addExperience.bind(this));
    
    document.getElementById('addSkillBtn').addEventListener('click', () => {
        const val = document.getElementById('skillInput').value.trim();
        if (val) this.addSkill(val);
    });

    document.getElementById('skillInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.target.value.trim();
            if (val) this.addSkill(val);
        }
    });

    document.getElementById('addCertBtn').addEventListener('click', () => {
        const val = document.getElementById('certInput').value.trim();
        if (val) this.addCertificate(val);
    });

    document.getElementById('certInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.target.value.trim();
            if (val) this.addCertificate(val);
        }
    });

    document.getElementById('printBtn').addEventListener('click', this.printResume.bind(this));
    document.getElementById('downloadBtn').addEventListener('click', this.downloadPDF.bind(this));
}

updatePreview() {
    const p = this.state.personal;
    const themeCls = this.themes[this.state.theme];
    const preview = document.getElementById('resumePreview');

    let contactHtml = [];
    if (p.mobile) contactHtml.push(`<div><i class="bi bi-telephone-fill ${themeCls.text} me-2"></i>${p.mobile}</div>`);
    if (p.email) contactHtml.push(`<div><i class="bi bi-envelope-fill ${themeCls.text} me-2"></i>${p.email}</div>`);
    if (p.address) contactHtml.push(`<div><i class="bi bi-geo-alt-fill ${themeCls.text} me-2"></i>${p.address}</div>`);
    if (p.linkedin) contactHtml.push(`<div><i class="bi bi-linkedin ${themeCls.text} me-2"></i>${p.linkedin}</div>`);
    if (p.portfolio) contactHtml.push(`<div><i class="bi bi-globe ${themeCls.text} me-2"></i>${p.portfolio}</div>`);

    let personalInfoHtml = [];
    if (p.dob) personalInfoHtml.push(`<strong>DOB:</strong> ${p.dob}`);
    if (p.gender) personalInfoHtml.push(`<strong>Gender:</strong> ${p.gender}`);
    if (p.nationality) personalInfoHtml.push(`<strong>Nationality:</strong> ${p.nationality}`);
    if (p.languages) personalInfoHtml.push(`<strong>Languages:</strong> ${p.languages}`);

    let skillsHtml = this.state.skills.map(s => `<span class="badge ${themeCls.bg} me-1 mb-1 px-3 py-2 fw-normal">${s}</span>`).join('');
    let certsHtml = this.state.certificates.map(c => `<li>${c}</li>`).join('');

    let eduHtml = this.state.education.map(e => `
        <div class="mb-3">
            <div class="d-flex justify-content-between">
                <h6 class="fw-bold mb-1">${e.degree || 'Degree'}</h6>
                <span class="${themeCls.text} fw-bold">${e.year || 'Year'}</span>
            </div>
            <div class="text-muted">${e.institute || 'Institute'}</div>
            ${e.marks ? `<small>Grade/Percentage: ${e.marks}</small>` : ''}
        </div>
    `).join('');

    let expHtml = this.state.experience.map(e => `
        <div class="mb-3">
            <div class="d-flex justify-content-between">
                <h6 class="fw-bold mb-1">${e.designation || 'Designation'}</h6>
                <span class="${themeCls.text} fw-bold">${e.duration || 'Duration'}</span>
            </div>
            <div class="fw-bold text-muted">${e.company || 'Company'}</div>
            <p class="small mt-1 mb-0" style="white-space: pre-wrap;">${e.responsibilities}</p>
        </div>
    `).join('');

    preview.innerHTML = `
        <div class="row h-100">
            <div class="col-md-4 border-end pe-4" style="border-color: #dee2e6 !important;">
                <div class="text-center mb-4">
                    ${p.photo ? `<img src="${p.photo}" class="rounded-circle border border-3 ${themeCls.border} object-fit-cover shadow-sm" style="width:150px; height:150px;">` : `<div class="rounded-circle ${themeCls.bg} text-white d-flex align-items-center justify-content-center mx-auto shadow-sm" style="width:150px; height:150px; font-size:4rem;">${p.fullName.charAt(0) || '<i class="bi bi-person"></i>'}</div>`}
                </div>
                
                <div class="mb-4">
                    <h6 class="fw-bold text-uppercase border-bottom pb-2 mb-3 ${themeCls.text}">Contact</h6>
                    <div class="d-flex flex-column gap-2 small">
                        ${contactHtml.join('')}
                    </div>
                </div>

                ${personalInfoHtml.length ? `
                <div class="mb-4">
                    <h6 class="fw-bold text-uppercase border-bottom pb-2 mb-3 ${themeCls.text}">Details</h6>
                    <div class="d-flex flex-column gap-2 small">
                        ${personalInfoHtml.map(info => `<div>${info}</div>`).join('')}
                    </div>
                </div>
                ` : ''}

                ${this.state.skills.length ? `
                <div class="mb-4">
                    <h6 class="fw-bold text-uppercase border-bottom pb-2 mb-3 ${themeCls.text}">Skills</h6>
                    <div>${skillsHtml}</div>
                </div>
                ` : ''}

                ${this.state.certificates.length ? `
                <div class="mb-4">
                    <h6 class="fw-bold text-uppercase border-bottom pb-2 mb-3 ${themeCls.text}">Certificates</h6>
                    <ul class="ps-3 small m-0">${certsHtml}</ul>
                </div>
                ` : ''}
            </div>

            <div class="col-md-8 ps-4">
                <div class="mb-4">
                    <h1 class="fw-bolder text-uppercase mb-1" style="letter-spacing: 2px; color: #2c3e50;">${p.fullName || 'Your Name'}</h1>
                </div>

                ${this.state.objective ? `
                <div class="mb-4">
                    <h5 class="fw-bold text-uppercase border-bottom pb-2 mb-3 ${themeCls.text}">Career Objective</h5>
                    <p class="small text-justify">${this.state.objective}</p>
                </div>
                ` : ''}

                ${this.state.experience.length ? `
                <div class="mb-4">
                    <h5 class="fw-bold text-uppercase border-bottom pb-2 mb-3 ${themeCls.text}">Experience</h5>
                    ${expHtml}
                </div>
                ` : ''}

                ${this.state.education.length ? `
                <div class="mb-4">
                    <h5 class="fw-bold text-uppercase border-bottom pb-2 mb-3 ${themeCls.text}">Education</h5>
                    ${eduHtml}
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

uploadPhoto(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            this.state.personal.photo = event.target.result;
            this.saveLocal();
            this.updatePreview();
        };
        reader.readAsDataURL(file);
    }
}

addEducation() {
    this.state.education.push({ degree: '', institute: '', year: '', marks: '' });
    this.saveLocal();
    this.renderLists();
    this.updatePreview();
    this.bindEvents();
}

removeEducation(index) {
    this.state.education.splice(index, 1);
    this.saveLocal();
    this.renderLists();
    this.updatePreview();
    this.bindEvents();
}

addExperience() {
    this.state.experience.push({ company: '', designation: '', duration: '', responsibilities: '' });
    this.saveLocal();
    this.renderLists();
    this.updatePreview();
    this.bindEvents();
}

removeExperience(index) {
    this.state.experience.splice(index, 1);
    this.saveLocal();
    this.renderLists();
    this.updatePreview();
    this.bindEvents();
}

addSkill(skill) {
    if (!this.state.skills.includes(skill)) {
        this.state.skills.push(skill);
        document.getElementById('skillInput').value = '';
        this.saveLocal();
        this.renderLists();
        this.updatePreview();
        this.bindEvents();
    }
}

removeSkill(index) {
    this.state.skills.splice(index, 1);
    this.saveLocal();
    this.renderLists();
    this.updatePreview();
    this.bindEvents();
}

addCertificate(cert) {
    if (!this.state.certificates.includes(cert)) {
        this.state.certificates.push(cert);
        document.getElementById('certInput').value = '';
        this.saveLocal();
        this.renderLists();
        this.updatePreview();
        this.bindEvents();
    }
}

removeCertificate(index) {
    this.state.certificates.splice(index, 1);
    this.saveLocal();
    this.renderLists();
    this.updatePreview();
    this.bindEvents();
}

changeTheme(e) {
    this.state.theme = e.target.value;
    this.saveLocal();
    this.updatePreview();
}

printResume() {
    const form = document.getElementById('resumeForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        alert('Please fill out all required personal details fields before printing.');
        return;
    }
    
    const previewHtml = document.getElementById('resumePreview').innerHTML;
    const originalBody = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div class="container-fluid bg-white">
            <div class="d-flex justify-content-center p-0 m-0 w-100 h-100">
                <div id="printArea" class="w-100" style="max-width: 210mm;">
                    ${previewHtml}
                </div>
            </div>
        </div>
    `;
    
    window.print();
    
    document.body.innerHTML = originalBody;
    
    // Restore instance logic
    window.resumeApp = new ResumeMaker('resumeMaker');
}

downloadPDF() {
    if (typeof html2pdf !== 'undefined') {
        const element = document.getElementById('resumePreview');
        const opt = {
            margin: 0,
            filename: `${this.state.personal.fullName || 'Resume'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    } else {
        alert('html2pdf.js is not loaded. Please include it in your document to use this feature.');
        this.printResume(); // Fallback to print functionality
    }
}
}

document.addEventListener('DOMContentLoaded', () => {
window.resumeApp = new ResumeMaker('resumeMaker');
});
