package hu.adam.project_inventory.controller;

import hu.adam.project_inventory.data.dao.ContactDao;
import hu.adam.project_inventory.data.enums.ProjectPriority;
import hu.adam.project_inventory.data.enums.ProjectStatus;
import hu.adam.project_inventory.data.dao.ClientDao;
import hu.adam.project_inventory.data.dao.ProjectDao;
import hu.adam.project_inventory.form.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@Controller
@RequestMapping("/")
public class HomeController {

    @Autowired
    private ClientDao clientDao;
    @Autowired
    private ProjectDao projectDao;
    @Autowired
    private ContactDao contactDao;

    @GetMapping("")
    public String home(Map<String, Object> model) {

        model.put("clientForm", new ClientForm());
        model.put("editClientForm", new EditClientForm());
        model.put("projectForm", new ProjectForm());
        model.put("editProjectForm", new EditProjectForm());
        model.put("contactForm", new ContactForm());
        model.put("editContactForm", new EditContactForm());

        model.put("clients", clientDao.findAllBy());
        model.put("projects", projectDao.findAllBy());
        model.put("contacts", contactDao.findAllBy());

        model.put("statuses", ProjectStatus.values());
        model.put("priorities", ProjectPriority.values());

        return "index";
    }
}
