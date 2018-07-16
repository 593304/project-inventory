package hu.adam.project_inventory.controller;

import hu.adam.project_inventory.data.Contact;
import hu.adam.project_inventory.data.Profile;
import hu.adam.project_inventory.data.dao.ContactDao;
import hu.adam.project_inventory.data.dao.ProfileDao;
import hu.adam.project_inventory.form.EditProfileForm;
import hu.adam.project_inventory.form.ProfileForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

@Controller
@RequestMapping("/profiles")
public class ProfileController {

    @Autowired
    private ContactDao contactDao;
    @Autowired
    private ProfileDao profileDao;

    @PostMapping("")
    public String save(@ModelAttribute ProfileForm profileForm) {

        store(profileForm);

        return "redirect:/";
    }

    @PostMapping("/edit")
    public String save(@ModelAttribute EditProfileForm editProfileForm) {

        store(editProfileForm);

        return "redirect:/";
    }

    @PostMapping("/delete/{id}")
    public String delete(@PathVariable("id") long id) {

        profileDao.deleteById(id);

        return "redirect:/";
    }

    private void store(ProfileForm profileForm) {
        Optional<Contact> contact = contactDao.findById(profileForm.getContact());
        Profile profile;

        if(contact.isPresent())
            profile = profileForm.getProfile(contact.get());
        else
            profile = profileForm.getProfile(null);

        profileDao.save(profile);
    }
}
