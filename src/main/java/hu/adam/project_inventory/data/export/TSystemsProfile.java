package hu.adam.project_inventory.data.export;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@JsonPropertyOrder({"user", "project", "projectCode", "projectManager", "serviceManager", "description", "startDate", "startTime", "endDate", "endTime", "duration"})
public class TSystemsProfile {

    @JsonProperty("User")
    private String user;
    @JsonProperty("Project")
    private String project;
    @JsonProperty("Project code")
    private String projectCode;
    @JsonProperty("Project manager")
    private String projectManager;
    @JsonProperty("Service manager ")
    private String serviceManager;
    @JsonProperty("Description")
    private String description;
    @JsonProperty("Start date")
    private String startDate;
    @JsonProperty("Start time")
    private String startTime;
    @JsonProperty("End date")
    private String endDate;
    @JsonProperty("End time")
    private String endTime;
    @JsonProperty("Duration")
    private String duration;

    public TSystemsProfile(String user, String project, String projectCode, String projectManager, String serviceManager, String description, String startDate, String startTime, String endDate, String endTime, String duration) {
        this.user = user;
        this.project = project;
        this.projectCode = projectCode;
        this.projectManager = projectManager;
        this.serviceManager = serviceManager;
        this.description = description;
        this.startDate = startDate;
        this.startTime = startTime;
        this.endDate = endDate;
        this.endTime = endTime;
        this.duration = duration;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    @Override
    public String toString() {
        return "TSystemsProfile{" +
                "user='" + user + '\'' +
                ", project='" + project + '\'' +
                ", projectCode='" + projectCode + '\'' +
                ", projectManager='" + projectManager + '\'' +
                ", serviceManager='" + serviceManager + '\'' +
                ", description='" + description + '\'' +
                ", startDate='" + startDate + '\'' +
                ", startTime='" + startTime + '\'' +
                ", endDate='" + endDate + '\'' +
                ", endTime='" + endTime + '\'' +
                ", duration='" + duration + '\'' +
                '}';
    }
}
