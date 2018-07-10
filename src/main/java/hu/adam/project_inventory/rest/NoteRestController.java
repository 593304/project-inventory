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
    public List<Note> list(@PathVariable("project_id") long project_id) {

        if(projectDao.findById(project_id).isPresent())
            return noteDao.findAllByProject(projectDao.findById(project_id).get());
        else
            return new ArrayList<>();
    }

    @GetMapping("/comment/get/{note_id}")
    public List<String> listComments(@PathVariable("note_id") long note_id) {

        if(noteDao.findById(note_id).isPresent())
            return noteDao.findById(note_id).get().getComments();
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
