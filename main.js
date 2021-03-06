(function () {
    'use strict'

    var addNoteButton = document.getElementById('add_note_button');
    var removeAllNotesButton = document.getElementById('remove_all_notes_button');
    var grabPointX;
    var grabPointY;
    var noteToDrag;

    function addNote(ev, noteConfiguration) {
        var ev = ev || window.event;

        var noteConfiguration = noteConfiguration || {
            id: 'id_' + Date.now(),
            title: "",
            content: "",
            posX: Math.random() * 400 + 'px',
            posY: Math.random() * 400 + 'px'
        };

        var noteDiv = document.createElement('div');
        noteDiv.setAttribute('class', 'note');
        noteDiv.setAttribute('id', noteConfiguration.id);

        var barDiv = document.createElement('div');
        barDiv.setAttribute('class', 'bar');

        var deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'X';
        deleteButton.setAttribute('class', 'delete_button');
        deleteButton.addEventListener('click', function () {
            var noteDiv = this.parentElement.parentElement;
            document.body.removeChild(noteDiv);
        })

        var titleTextArea = createTitleTxtArea();
        titleTextArea.value = noteConfiguration.title;
        var noteContentTextArea = createNoteContentTxtArea();
        noteContentTextArea.value = noteConfiguration.content;

        barDiv.appendChild(deleteButton);
        noteDiv.appendChild(barDiv);
        noteDiv.appendChild(titleTextArea);
        noteDiv.appendChild(noteContentTextArea);

        noteDiv.style.left = noteConfiguration.posX;
        noteDiv.style.top = noteConfiguration.posY;
        noteDiv.addEventListener('mouseover', function () {
            noteDiv.style.zIndex = 1;
            noteDiv.style.background = 'red';
        });
        noteDiv.addEventListener('mouseout', function () {
            noteDiv.style.zIndex = 0;
            noteDiv.style.background = 'tomato';
        });
        noteDiv.addEventListener('mousedown', onDragStart);

        document.body.appendChild(noteDiv);
    };

    function createTitleTxtArea() {
        var titleTextArea = document.createElement('textarea');
        titleTextArea.setAttribute('class', 'title');
        titleTextArea.setAttribute('cols', '28');
        titleTextArea.setAttribute('rows', '1');
        titleTextArea.setAttribute('maxlength', '28');
        titleTextArea.setAttribute('placeholder', 'Title');

        return titleTextArea;
    };

    function createNoteContentTxtArea() {
        var contentTextArea = document.createElement('textarea');
        contentTextArea.setAttribute('class', 'note_content');
        contentTextArea.setAttribute('cols', '28');
        contentTextArea.setAttribute('rows', '20');
        contentTextArea.setAttribute('maxlength', '560');
        contentTextArea.setAttribute('placeholder', 'Save your idea...');

        return contentTextArea;
    };

    function onDragStart(ev) {
        if (ev.target.className.indexOf('bar') === -1) {
            return;
        }

        noteToDrag = this;

        grabPointX = ev.clientX - parseInt(noteToDrag.style.left);
        grabPointY = ev.clientY - parseInt(noteToDrag.style.top);
    };

    function onDrag(ev) {
        if (!noteToDrag) {
            return;
        }

        var positionX = ev.clientX - grabPointX;
        var positionY = ev.clientY - grabPointY;

        if (positionX < 0) {
            positionX = 0;
        }

        if (positionY < 0) {
            positionY = 0;
        }

        noteToDrag.style.left = positionX + 'px';
        noteToDrag.style.top = positionY + 'px';
    };

    function onDragStop() {
        grabPointX = null;
        grabPointY = null;
        noteToDrag = null;
    };

    function removeAllNotes() {
        if (confirm("Are you sure? All notes will be lost!")) {

            var notesToRemove = document.getElementsByClassName('note');

            while (notesToRemove[0]) {
                notesToRemove[0].parentNode.removeChild(notesToRemove[0]);
            }
        }

    };

    window.onbeforeunload = function () {
        var allNotes = document.getElementsByClassName("note");

        for (var i = 0; i < allNotes.length; i++) {
            var noteToSave = allNotes[i];
            var noteToSaveConfiguration = {
                id: noteToSave.id,
                title: noteToSave.getElementsByClassName("title")[0].value,
                content: noteToSave.getElementsByClassName("note_content")[0].value,
                posX: noteToSave.style.left,
                posY: noteToSave.style.top
            }
            localStorage.setItem(noteToSave.id, JSON.stringify(noteToSaveConfiguration));
        }
    };

    window.onload = function (ev) {
        var ev = ev || window.event;

        for (var i = 0; i < localStorage.length; i++) {

            var noteConfStringified = localStorage.getItem(localStorage.key(i));
            var noteToLoadConf = JSON.parse(noteConfStringified);
            addNote(ev, noteToLoadConf);
        }
        localStorage.clear();
    };


    addNoteButton.addEventListener('click', addNote, false);
    removeAllNotesButton.addEventListener('click', removeAllNotes, false);
    document.addEventListener('mousemove', onDrag, false);
    document.addEventListener('mouseup', onDragStop, false);

})();
