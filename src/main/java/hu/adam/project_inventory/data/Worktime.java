package hu.adam.project_inventory.data;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "work_time")
public class Worktime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "work_time_id")
    private long id;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime start;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime end;
    private String description;
    private boolean exported;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Transient
    @JsonIgnore
    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    @Transient
    @JsonIgnore
    private static final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

    public Worktime() {
    }

    public Worktime(LocalDate startDate, LocalTime startTime, LocalDate endDate, LocalTime endTime, String description, Project project) {
        this.start = LocalDateTime.of(startDate, startTime);
        this.end = LocalDateTime.of(endDate, endTime);
        this.description = description;
        this.project = project;
        this.exported = false;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public LocalDateTime getStart() {
        return start;
    }

    @JsonIgnore
    public String getStartDateAsString() {
        return start.format(dateFormatter);
    }

    @JsonIgnore
    public String getStartTimeAsString() {
        return start.format(timeFormatter);
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public LocalDateTime getEnd() {
        return end;
    }

    @JsonIgnore
    public String getEndDateAsString() {
        return end.format(dateFormatter);
    }

    @JsonIgnore
    public String getEndTimeAsString() {
        return end.format(timeFormatter);
    }

    public void setEnd(LocalDateTime end) {
        this.end = end;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isExported() {
        return exported;
    }

    public void setExported(boolean exported) {
        this.exported = exported;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @Override
    public String toString() {
        return "Worktime{" +
                "id=" + id +
                ", start=" + start +
                ", end=" + end +
                ", exported=" + exported +
                ", project=" + project.getName() +
                '}';
    }
}
