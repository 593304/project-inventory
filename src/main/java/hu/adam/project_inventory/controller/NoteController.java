package hu.adam.project_inventory.controller;

import hu.adam.project_inventory.data.Note;
import hu.adam.project_inventory.data.Project;
import hu.adam.project_inventory.data.dao.NoteDao;
import hu.adam.project_inventory.data.dao.ProjectDao;
import hu.adam.project_inventory.form.EditNoteForm;
import hu.adam.project_inventory.form.NoteForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

@Controller
@RequestMapping("/notes")
public class NoteController {

    @Autowired
    private ProjectDao projectDao;
    @Autowired
    private NoteDao noteDao;

    @PostMapping("")
    public String save(@ModelAttribute NoteForm noteForm) {

        store(noteForm);

        return "redirect:/";
    }

    @PostMapping("/edit")
    public String edit(@ModelAttribute EditNoteForm editNoteForm) {

        store(editNoteForm);

        return "redirect:/";
    }

    @PostMapping("/delete/{id}")
    public String delete(@PathVariable("id") long id) {

        noteDao.deleteById(id);

        return "redirect:/";
    }

    private void store(NoteForm noteForm) {
        Optional<Project> project = projectDao.findById(noteForm.getProject());
        Note note;

        if(project.isPresent())
            note = noteForm.getNote(project.get());
        else
            note = noteForm.getNote(null);

        noteDao.save(note);
    }
}
