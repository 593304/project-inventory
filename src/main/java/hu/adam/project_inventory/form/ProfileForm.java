package hu.adam.project_inventory.form;

import hu.adam.project_inventory.data.Contact;
import hu.adam.project_inventory.data.Profile;

public class ProfileForm {

    private String name;
    private long contact;
    private boolean overwriteProjectInfo;
    private String projectName;
    private String projectCode;

    public ProfileForm() {
    }

    public ProfileForm(String name, long contact, boolean overwriteProjectInfo, String projectName, String projectCode) {
        this.name = name;
        this.contact = contact;
        this.overwriteProjectInfo = overwriteProjectInfo;
        this.projectName = projectName;
        this.projectCode = projectCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getContact() {
        return contact;
    }

    public void setContact(long contact) {
        this.contact = contact;
    }

    public boolean isOverwriteProjectInfo() {
        return overwriteProjectInfo;
    }

    public void setOverwriteProjectInfo(boolean overwriteProjectInfo) {
        this.overwriteProjectInfo = overwriteProjectInfo;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public Profile getProfile(Contact contact) {
        return new Profile(name, contact, overwriteProjectInfo, projectName, projectCode);
    }
}
