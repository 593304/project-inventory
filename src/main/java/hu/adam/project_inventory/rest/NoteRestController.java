package hu.adam.project_inventory.rest;

import hu.adam.project_inventory.App;
import hu.adam.project_inventory.data.Note;
import hu.adam.project_inventory.data.dao.NoteDao;
import hu.adam.project_inventory.data.dao.ProjectDao;
import hu.adam.project_inventory.form.CommentForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return noteDao.findAllByProject(projectDao.findOne(project_id));
    }

    @GetMapping("/comment/get/{note_id}")
    public List<String> listComments(@PathVariable("note_id") long note_id) {
        return noteDao.findOne(note_id).getComments();
    }

    @PostMapping("/comment/add")
    public ResponseEntity<String> addComment(@RequestBody CommentForm commentForm) {
        Note note = noteDao.findOne(commentForm.getNoteId());

        List<String> comments = note.getComments();
        comments.add(commentForm.getComment());

        note.setComments(comments);
        noteDao.save(note);

        App.writeToFile();

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/comment/delete")
    public ResponseEntity<String> deleteComment(@RequestBody CommentForm commentForm) {
        Note note = noteDao.findOne(commentForm.getNoteId());

        List<String> comments = note.getComments();
        comments.remove(commentForm.getComment());

        note.setComments(comments);
        noteDao.save(note);

        App.writeToFile();

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
