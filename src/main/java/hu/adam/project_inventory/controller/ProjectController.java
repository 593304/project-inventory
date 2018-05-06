package hu.adam.project_inventory.controller;

import hu.adam.project_inventory.App;
import hu.adam.project_inventory.data.Project;
import hu.adam.project_inventory.data.dao.ClientDao;
import hu.adam.project_inventory.data.dao.ProjectDao;
import hu.adam.project_inventory.form.EditProjectForm;
import hu.adam.project_inventory.form.ProjectForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ClientDao clientDao;
    @Autowired
    private ProjectDao projectDao;

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

        projectDao.delete(id);

        App.writeToFile();

        return "redirect:/";
    }

    private void store(ProjectForm projectForm) {
        Project project = projectForm.getProject(clientDao.findOne(projectForm.getClient()));

        if(projectForm.getCode().trim().isEmpty())
            project.setCode(null);

        projectDao.save(project);

        App.writeToFile();
    }
}
