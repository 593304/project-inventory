package hu.adam.project_inventory.controller;

import hu.adam.project_inventory.data.ProjectPriority;
import hu.adam.project_inventory.data.ProjectStatus;
import hu.adam.project_inventory.data.dao.ClientDao;
import hu.adam.project_inventory.data.dao.ProjectDao;
import hu.adam.project_inventory.form.ClientForm;
import hu.adam.project_inventory.form.EditClientForm;
import hu.adam.project_inventory.form.EditProjectForm;
import hu.adam.project_inventory.form.ProjectForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@Controller
@RequestMapping("/")
public class HomeController {

    @Autowired
    private ProjectDao projectDao;
    @Autowired
    private ClientDao clientDao;

    @GetMapping("")
    public String home(Map<String, Object> model) {

        model.put("clientForm", new ClientForm());
        model.put("editClientForm", new EditClientForm());
        model.put("projectForm", new ProjectForm());
        model.put("editProjectForm", new EditProjectForm());

        model.put("clients", clientDao.findAllBy());
        model.put("projects", projectDao.findAllBy());

        model.put("statuses", ProjectStatus.values());
        model.put("priorities", ProjectPriority.values());

        return "index";
    }
}
