package hu.fnttzf.project_inventory.controller;

import hu.fnttzf.project_inventory.App;
import hu.fnttzf.project_inventory.data.Client;
import hu.fnttzf.project_inventory.data.Project;
import hu.fnttzf.project_inventory.data.dao.ClientDao;
import hu.fnttzf.project_inventory.data.dao.ProjectDao;
import hu.fnttzf.project_inventory.form.EditProjectForm;
import hu.fnttzf.project_inventory.form.NewClientForm;
import hu.fnttzf.project_inventory.form.NewProjectForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ClientDao clientDao;
    @Autowired
    private ProjectDao projectDao;

    @PostMapping("")
    public String save(@ModelAttribute NewProjectForm newProjectForm) {

        store(newProjectForm);

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

        writeToFile();

        return "redirect:/";
    }

    private void store(NewProjectForm projectForm) {
        Project project = projectForm.getProject(clientDao.findOne(projectForm.getClient()));

        if(projectForm.getCode().isEmpty())
            project.setCode(null);

        projectDao.save(project);

        writeToFile();
    }

    private void writeToFile() {
        try {
            App.writeToFile(clientDao, projectDao);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
