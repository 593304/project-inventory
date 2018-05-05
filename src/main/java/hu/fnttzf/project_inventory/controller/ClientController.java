package hu.fnttzf.project_inventory.controller;

import hu.fnttzf.project_inventory.App;
import hu.fnttzf.project_inventory.data.Client;
import hu.fnttzf.project_inventory.data.Project;
import hu.fnttzf.project_inventory.data.dao.ClientDao;
import hu.fnttzf.project_inventory.data.dao.ProjectDao;
import hu.fnttzf.project_inventory.form.EditClientForm;
import hu.fnttzf.project_inventory.form.NewClientForm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
@RequestMapping("/clients")
public class ClientController {

    @Autowired
    private ClientDao clientDao;
    @Autowired
    private ProjectDao projectDao;

    @PostMapping("")
    public String save(@ModelAttribute NewClientForm newClientForm) {

        store(newClientForm);

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
            project.setClient(App.getDummyClient());
            projectDao.save(project);
        }

        clientDao.delete(id);

        writeToFile();

        return "redirect:/";
    }

    private void store(NewClientForm clientForm) {

        clientDao.save(clientForm.getClient());

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
