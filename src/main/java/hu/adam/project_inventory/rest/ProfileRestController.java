package hu.adam.project_inventory.rest;

import hu.adam.project_inventory.data.Profile;
import hu.adam.project_inventory.data.dao.ProfileDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/profiles")
public class ProfileRestController {

    @Autowired
    private ProfileDao profileDao;

    @GetMapping("/list")
    public List<Profile> list() {
        return profileDao.findAll();
    }
}
