package hu.adam.project_inventory.form;

import hu.adam.project_inventory.data.Contact;
import hu.adam.project_inventory.data.Profile;

public class EditProfileForm extends ProfileForm {

    private long id;

    public EditProfileForm() {
    }

    public EditProfileForm(String name, long contact, boolean overwriteProjectInfo, String projectName, String projectCode, long id) {
        super(name, contact, overwriteProjectInfo, projectName, projectCode);
        this.id = id;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Override
    public Profile getProfile(Contact contact) {
        Profile profile = super.getProfile(contact);
        profile.setId(id);

        return profile;
    }
}
