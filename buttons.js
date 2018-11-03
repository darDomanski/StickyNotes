(function () {
    'use strict'

    var addNoteButton = document.getElementById('add_note_button');
    var grabPointX;
    var grabPointY;
    var noteToDrag;
    var offsetX = 0;
    var offsetY = 0;

    function addNote(event) {
        event = event || window.event;

        var noteDiv = document.createElement('div');
        noteDiv.setAttribute('class', 'note');
        noteDiv.setAttribute('id', 'id_' + Date.now());

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
        // titleTextArea.innerHTML = title || '';
        var noteContentTextArea = createNoteContentTxtArea();
        // noteContentTextArea.innerHTML = content || '';

        barDiv.appendChild(deleteButton);
        noteDiv.appendChild(barDiv);
        noteDiv.appendChild(titleTextArea);
        noteDiv.appendChild(noteContentTextArea);

        var randomPosition = 'translateX(' + Math.random() * 400 + 'px) translateY(' + Math.random() * 400 + 'px)';
        noteDiv.style.transform = randomPosition;
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
    }

    function createTitleTxtArea() {
        var titleTextArea = document.createElement('textarea');
        titleTextArea.setAttribute('class', 'title');
        titleTextArea.setAttribute('cols', '28');
        titleTextArea.setAttribute('rows', '1');
        titleTextArea.setAttribute('maxlength', '28');
        titleTextArea.setAttribute('placeholder', 'Title');

        return titleTextArea;
    }

    function createNoteContentTxtArea() {
        var contentTextArea = document.createElement('textarea');
        contentTextArea.setAttribute('class', 'note_content');
        contentTextArea.setAttribute('cols', '28');
        contentTextArea.setAttribute('rows', '20');
        contentTextArea.setAttribute('maxlength', '560');
        contentTextArea.setAttribute('placeholder', 'Save your idea...');

        return contentTextArea;
    }

    function onDragStart(ev) {
        if (ev.target.className.indexOf('bar') === -1) {
            return;
        }

        noteToDrag = this;

        grabPointX = ev.clientX - offsetX;
        grabPointY = ev.clientY - offsetY;
    }

    function onDrag(ev) {
        if (!noteToDrag) {
            return;
        }

        var positionX = ev.clientX - grabPointX;
        var positionY = ev.clientY - grabPointY;
        offsetX = positionX;
        offsetY = positionY;

        noteToDrag.style.transform = 'translateX(' + positionX + 'px) translateY(' + positionY + 'px)';
    }

    function onDragStop() {
        grabPointX = null;
        grabPointY = null;
        noteToDrag = null;
    }

    addNoteButton.addEventListener('click', addNote, false);
    document.addEventListener('mousemove', onDrag, false);
    document.addEventListener('mouseup', onDragStop, false);

    window.onload = function () {
        console.log(localStorage);
        var parser = new DOMParser();

        for (var i = 0; i < localStorage.length; i++) {
            // var noteData = localStorage.getItem(localStorage.key(i));
            // var noteDataToLoad = JSON.parse(noteData);
            // // var id = noteDataToLoad['id'];
            // var title = noteDataToLoad.title;
            var noteString = localStorage[i];
            var parsedNote = parser.parseFromString(noteString, 'text/xml');
            console.log(noteString);

            // document.body.appendChild(parsedNote);

            // var content = noteDataToLoad.content;
            // console.log(content);
            // var position = noteDataToLoad.position;
            // console.log(position);
            // var noteToLoad = localStorage[i];

            // // addNote(event, title, content, position);
            // document.appendChild(noteToLoad);
        }

        localStorage.clear();
    };

    window.onbeforeunload = function () {

        var allNotes = document.getElementsByClassName('note');

        for (var i = 0; i < allNotes.length; i++) {
            var noteToSave = allNotes[i].outerHTML;
            // var noteChildren = noteToSave.childNodes;
            // var noteTitle, noteContent;

            // for (var j = 0; j < noteChildren.length; j++) {
            //     if (noteChildren[i].className === 'title') {
            //         noteTitle = noteChildren[i].innerHTML;
            //     } else if (noteChildren[i].className === 'note_content') {
            //         noteContent = noteChildren[i].innerHTML;
            //     }
            // }

            // console.log(noteTitle);
            // console.log(noteContent);

            // var noteDataToSave = {
            //     // // 'id': noteToSave.getAttribute('id'),
            //     title: noteToSave.getElementsByClassName('title')[0].innerHTML,
            //     content: noteToSave.getElementsByClassName('note_content')[0].innerHTML,
            //     // title: noteTitle,
            //     // content: noteContent,
            //     position: noteToSave.style.transform
            // }

            localStorage.setItem(allNotes[i].id, JSON.stringify(noteToSave));
        }
    };
})();
