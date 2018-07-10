package hu.adam.project_inventory.controller;

import hu.adam.project_inventory.data.Contact;
import hu.adam.project_inventory.data.Project;
import hu.adam.project_inventory.data.dao.ClientDao;
import hu.adam.project_inventory.data.dao.ContactDao;
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
    @Autowired
    private ContactDao contactDao;

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

        if(clientDao.findById(id).isPresent()) {
            for (Project project : projectDao.findAllByClient(clientDao.findById(id).get())) {
                project.setClient(null);
                projectDao.save(project);
            }

            for (Contact contact : contactDao.findAllByClient(clientDao.findById(id).get())) {
                contact.setClient(null);
                contactDao.save(contact);
            }

            clientDao.deleteById(id);
        }

        return "redirect:/";
    }

    private void store(ClientForm clientForm) {

        clientDao.save(clientForm.getClient());
    }
}
