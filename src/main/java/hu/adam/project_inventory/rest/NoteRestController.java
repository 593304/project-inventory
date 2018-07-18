package hu.adam.project_inventory.rest;

import hu.adam.project_inventory.data.Note;
import hu.adam.project_inventory.data.dao.NoteDao;
import hu.adam.project_inventory.data.dao.ProjectDao;
import hu.adam.project_inventory.form.CommentForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/notes")
public class NoteRestController {

    @Autowired
    private ProjectDao projectDao;
    @Autowired
    private NoteDao noteDao;

    @GetMapping("/list/{project_id}")
    public List<Note> list(@PathVariable("project_id") long projectId) {

        if(projectDao.findById(projectId).isPresent())
            return noteDao.findAllByProject(projectDao.findById(projectId).get());
        else
            return new ArrayList<>();
    }

    @GetMapping("/comment/get/{note_id}")
    public List<String> listComments(@PathVariable("note_id") long noteId) {

        if(noteDao.findById(noteId).isPresent())
            return noteDao.findById(noteId).get().getComments();
        else
            return new ArrayList<>();
    }

    @PostMapping("/comment/add")
    public ResponseEntity<String> addComment(@RequestBody CommentForm commentForm) {

        if(!noteDao.findById(commentForm.getNoteId()).isPresent())
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        Note note = noteDao.findById(commentForm.getNoteId()).get();

        List<String> comments = note.getComments();
        comments.add(commentForm.getComment());

        note.setComments(comments);
        noteDao.save(note);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/comment/delete")
    public ResponseEntity<String> deleteComment(@RequestBody CommentForm commentForm) {

        if(!noteDao.findById(commentForm.getNoteId()).isPresent())
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        Note note = noteDao.findById(commentForm.getNoteId()).get();

        List<String> comments = note.getComments();
        comments.remove(commentForm.getComment());

        note.setComments(comments);
        noteDao.save(note);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
