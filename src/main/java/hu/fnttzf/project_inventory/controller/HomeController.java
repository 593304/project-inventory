package hu.fnttzf.project_inventory.controller;

import hu.fnttzf.project_inventory.App;
import hu.fnttzf.project_inventory.data.ProjectPriority;
import hu.fnttzf.project_inventory.data.ProjectStatus;
import hu.fnttzf.project_inventory.data.dao.ClientDao;
import hu.fnttzf.project_inventory.data.dao.ProjectDao;
import hu.fnttzf.project_inventory.form.EditClientForm;
import hu.fnttzf.project_inventory.form.EditProjectForm;
import hu.fnttzf.project_inventory.form.NewClientForm;
import hu.fnttzf.project_inventory.form.NewProjectForm;
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

        model.put("newClientForm", new NewClientForm());
        model.put("editClientForm", new EditClientForm());
        model.put("newProjectForm", new NewProjectForm());
        model.put("editProjectForm", new EditProjectForm());

        model.put("dummyClient", App.getDummyClient());
        model.put("clients", clientDao.findAllByIdIsNot(App.getDummyClient().getId()));
        model.put("projects", projectDao.findAllBy());

        model.put("statuses", ProjectStatus.values());
        model.put("priorities", ProjectPriority.values());

        return "index";
    }
}
