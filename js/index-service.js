'use strict';

const PAGE_SIZE = 3;
var gProjs;

function createProjs(){
    gProjs = [
        createProj('todos', 'Todos', 'Don\'t Forget To...', 
        'A handy application for you to write memos, just in case you\'re forgetful.' + 
        'Features sorting functionality and crossing marked items',
        ['Array of Objects', 'Click events']),
        createProj('minesweeper', 'MineSweeper', 'Try not to explode and die',
        `My own personal version of minesweeper, possesses full functionality of original game
        and a custom theme thats reminiscent of retro game design.`,
        ['Matrixes', 'Random Algorithms', 'Game', 'Retro'])
    ];
}

function createProj(id, name, title, desc, labels){
    var timestamp = + new Date();
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth();
    var year = currentDate.getFullYear();
    return {
        id: id,
        name: name,
        title: title,
        desc: desc,
        url: `projs/${id}`,
        timestamp: timestamp,
        publishedAt: date + "/" +(month + 1) + "/" + year,
        labels: labels,
        imgUrl: `img/portfolio/${id}-full.jpg`,
        imgThumbnail: `img/portfolio/${id}-thumbnail.jpg`
    }
}

function getProjById(elProjId) {
    return gProjs.find(function(proj){return proj.id === elProjId});
}