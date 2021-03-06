package hu.adam.project_inventory.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import hu.adam.project_inventory.data.enums.ProjectPriority;
import hu.adam.project_inventory.data.enums.ProjectStatus;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    @Column(unique = true)
    private String code;
    @Column(name = "project_manager")
    private String projectManager;
    @Column(name = "service_manager")
    private String serviceManager;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    private ProjectStatus status;
    private ProjectPriority priority;

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Note> notes;
    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Worktime> worktimes;

    public Project() {
        notes = new ArrayList<>();
        worktimes = new ArrayList<>();
    }

    public Project(String name, String code, String projectManager, String serviceManager, Client client, ProjectStatus status, ProjectPriority priority) {
        this.name = name;
        this.code = code;
        this.projectManager = projectManager;
        this.serviceManager = serviceManager;
        this.client = client;
        this.status = status;
        this.priority = priority;
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getProjectManager() {
        return projectManager;
    }

    public void setProjectManager(String projectManager) {
        this.projectManager = projectManager;
    }

    public String getServiceManager() {
        return serviceManager;
    }

    public void setServiceManager(String serviceManager) {
        this.serviceManager = serviceManager;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public ProjectPriority getPriority() {
        return priority;
    }

    public void setPriority(ProjectPriority priority) {
        this.priority = priority;
    }

    public List<Note> getNotes() {
        return notes;
    }

    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }

    public List<Worktime> getWorktimes() {
        return worktimes;
    }

    public void setWorktimes(List<Worktime> worktimes) {
        this.worktimes = worktimes;
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", projectManager='" + projectManager + '\'' +
                ", serviceManager='" + serviceManager + '\'' +
                ", client=" + client +
                ", status=" + status +
                ", priority=" + priority +
                ", notes=" + notes +
                ", worktimes=" + worktimes +
                '}';
    }
}