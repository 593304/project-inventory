package hu.adam.project_inventory.controller;

import hu.adam.project_inventory.App;
import hu.adam.project_inventory.data.Project;
import hu.adam.project_inventory.data.dao.ClientDao;
import hu.adam.project_inventory.data.dao.ProjectDao;
import hu.adam.project_inventory.form.ClientForm;
import hu.adam.project_inventory.form.EditClientForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/clients")
public class ClientController {

    @Autowired
    private ClientDao clientDao;
    @Autowired
    private ProjectDao projectDao;

    @PostMapping("")
    public String save(@ModelAttribute ClientForm clientForm) {

        store(clientForm);

        return "redirect:/";
    }

    @PostMapping("/edit")
    public String edit(@ModelAttribute EditClientForm editClientForm) {

        store(editClientForm);

        return "redirect:/";
    }

    @PostMapping("/delete/{id}")
    public String delete(@PathVariable("id") long id) {

        for(Project project : projectDao.findAllByClient(clientDao.findOne(id))) {
            project.setClient(null);
            projectDao.save(project);
        }

        clientDao.delete(id);

        App.writeToFile();

        return "redirect:/";
    }

    private void store(ClientForm clientForm) {

        clientDao.save(clientForm.getClient());

        App.writeToFile();
    }
}
