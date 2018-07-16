package hu.adam.project_inventory.data;

import javax.persistence.*;

@Entity
@Table(name = "profile")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    @OneToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id")
    private Contact contact;
    @Column(name = "overwrite_project_info")
    private boolean overwriteProjectInfo;
    @Column(name = "project_name")
    private String projectName;
    @Column(name = "project_code")
    private String projectCode;

    public Profile() {
    }

    public Profile(String name, Contact contact, boolean overwriteProjectInfo, String projectName, String projectCode) {
        this.name = name;
        this.contact = contact;
        this.overwriteProjectInfo = overwriteProjectInfo;
        this.projectName = projectName;
        this.projectCode = projectCode;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
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

    @Override
    public String toString() {
        return "Profile{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", contact=" + contact +
                ", overwriteProjectInfo=" + overwriteProjectInfo +
                ", projectName='" + projectName + '\'' +
                ", projectCode='" + projectCode + '\'' +
                '}';
    }
}
