'use strict';

$(document).ready(function () {
    createProjs();
    renderProjs();
})


function renderProjs() {
    var strHTML = '';
    gProjs.forEach(proj => {
        strHTML += `<div class="col-md-4 col-sm-6 portfolio-item">
          <a class="portfolio-link" data-toggle="modal" onclick="renderProjModal('${proj.id}')" href="#portfolioModal">
            <div class="portfolio-hover">
              <div class="portfolio-hover-content">
                <i class="fa fa-plus fa-3x"></i>
              </div>
            </div>
            <img class="img-fluid" src=${proj.imgThumbnail} alt="">
          </a>
          <div class="portfolio-caption">
            <h4>${proj.name}</h4>
            <span class="badge badge-dark">${proj.labels.join(', ')}</span>
          </div>
        </div>`
    });
    $('#portfolio .row-of-projs').html(strHTML);
}

function renderProjModal(elProjId) {
    // debugger;
    var proj = getProjById(elProjId);
    var strHTML = `<h2>${proj.name}</h2>
    <p class="item-intro text-muted">${proj.title}</p>
    <img class="img-fluid d-block mx-auto" src=${proj.imgUrl} alt="">
    <p>${proj.desc}</p>
    <ul class="list-inline">
      <li>Date Published: ${proj.publishedAt}</li>
      <li>Category: ${proj.labels.join(', ')}</li>
      <li>Link To Project: <a href="${proj.url}">${proj.url}</a></li>
    </ul>
    <button class="btn btn-primary" data-dismiss="modal" type="button">
      <i class="fa fa-times"></i>
      Close Project</button>`
    $('#portfolioModal .modal-body').html(strHTML)
}

function onRedirectToGmail() {
    // debugger;
    var submittedEmail = $('#inputEmail').val();
    var submittedSubject = $('#inputSubject').val();
    var submittedBody = $('#inputTextBody').val();
    window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=stavdorkam119@gmail.com&su=${submittedSubject}&body=${submittedBody}&bcc=${submittedEmail}&tf=1`,
    '_blank');
}