package hu.fnttzf.project_inventory.rest;

import hu.fnttzf.project_inventory.App;
import hu.fnttzf.project_inventory.data.Client;
import hu.fnttzf.project_inventory.data.dao.ClientDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/clients")
public class ClientRestController {

    @Autowired
    private ClientDao clientDao;

    @GetMapping("/list")
    public List<Client> list() {
        return clientDao.findAllByIdIsNot(App.getDummyClient().getId());
    }
}
