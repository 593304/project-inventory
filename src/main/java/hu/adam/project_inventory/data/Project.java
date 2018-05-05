package hu.adam.project_inventory.data;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    private ProjectStatus status;
    private ProjectPriority priority;

    @OneToMany(mappedBy = "project")
    private List<Note> notes;
    @OneToMany(mappedBy = "project")
    private List<WorkTime> workTimes;

    public Project() {
        notes = new ArrayList<>();
        workTimes = new ArrayList<>();
    }

    public Project(String name, Client client, ProjectStatus status, ProjectPriority priority) {
        this.name = name;
        this.client = client;
        this.status = status;
        this.priority = priority;
    }

    public Project(String name, String code, Client client, ProjectStatus status, ProjectPriority priority) {
        this.name = name;
        this.code = code;
        this.client = client;
        this.status = status;
        this.priority = priority;
    }

    public Project(long id, String name, String code, Client client, ProjectStatus status, ProjectPriority priority) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.client = client;
        this.status = status;
        this.priority = priority;
    }

    public Project(String name, String code, Client client, ProjectStatus status, ProjectPriority priority, List<Note> notes, List<WorkTime> workTimes) {
        this.name = name;
        this.code = code;
        this.client = client;
        this.status = status;
        this.priority = priority;
        this.notes = notes;
        this.workTimes = workTimes;
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

    public List<WorkTime> getWorkTimes() {
        return workTimes;
    }

    public void setWorkTimes(List<WorkTime> workTimes) {
        this.workTimes = workTimes;
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", client='" + client.toString() + '\'' +
                ", status=" + status +
                ", priority=" + priority +
                ", notes=" + notes +
                ", workTimes=" + workTimes +
                '}';
    }
}