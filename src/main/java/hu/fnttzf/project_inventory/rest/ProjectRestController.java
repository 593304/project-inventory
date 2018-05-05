package hu.fnttzf.project_inventory.rest;

import hu.fnttzf.project_inventory.data.Project;
import hu.fnttzf.project_inventory.data.dao.ClientDao;
import hu.fnttzf.project_inventory.data.dao.ProjectDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectRestController {

    @Autowired
    private ProjectDao projectDao;
    @Autowired
    private ClientDao clientDao;

    @GetMapping("/list/{client_id}")
    public List<Project> list(@PathVariable("client_id") long client_id) {
        return projectDao.findAllByClient(clientDao.findOne(client_id));
    }
}
