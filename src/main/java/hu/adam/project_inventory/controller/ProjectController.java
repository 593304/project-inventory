package hu.adam.project_inventory.controller;

import hu.adam.project_inventory.data.Client;
import hu.adam.project_inventory.data.Note;
import hu.adam.project_inventory.data.Project;
import hu.adam.project_inventory.data.dao.ClientDao;
import hu.adam.project_inventory.data.dao.NoteDao;
import hu.adam.project_inventory.data.dao.ProjectDao;
import hu.adam.project_inventory.form.EditProjectForm;
import hu.adam.project_inventory.form.ProjectForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

@Controller
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ClientDao clientDao;
    @Autowired
    private ProjectDao projectDao;
    @Autowired
    private NoteDao noteDao;

    @PostMapping("")
    public String save(@ModelAttribute ProjectForm projectForm) {

        store(projectForm);

        return "redirect:/";
    }

    @PostMapping("/edit")
    public String edit(@ModelAttribute EditProjectForm editProjectForm) {

        store(editProjectForm);

        return "redirect:/";
    }

    @PostMapping("/delete/{id}")
    public String delete(@PathVariable("id") long id) {

        if(projectDao.findById(id).isPresent()) {
            for (Note note : noteDao.findAllByProject(projectDao.findById(id).get())) {
                note.setProject(null);
                noteDao.save(note);
            }

            projectDao.deleteById(id);
        }

        return "redirect:/";
    }

    private void store(ProjectForm projectForm) {
        Optional<Client> client = clientDao.findById(projectForm.getClient());
        Project project;

        if(client.isPresent())
            project = projectForm.getProject(client.get());
        else
            project = projectForm.getProject(null);

        if(projectForm.getCode().trim().isEmpty())
            project.setCode(null);

        projectDao.save(project);
    }
}
