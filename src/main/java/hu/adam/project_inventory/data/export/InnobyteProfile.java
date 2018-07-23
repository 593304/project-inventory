package hu.adam.project_inventory.data.export;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"user", "email", "client", "project", "projectGroup", "task", "description", "billable", "startDate", "startTime", "endDate", "endTime", "duration", "tags", "amount"})
public class InnobyteProfile {

    @JsonProperty("User")
    private String user;
    @JsonProperty("Email")
    private String email;
    @JsonProperty("Client")
    private String client;
    @JsonProperty("Project")
    private String project;
    @JsonProperty("ProjectGroup")
    private String projectGroup;
    @JsonProperty("Task")
    private String task;
    @JsonProperty("Description")
    private String description;
    @JsonProperty("Billable")
    private String billable;
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
    @JsonProperty("Tags")
    private String tags;
    @JsonProperty("Amount ()")
    private String amount;

    public InnobyteProfile(String user, String email, String client, String project, String projectGroup, String task, String description, String billable, String startDate, String startTime, String endDate, String endTime, String duration, String tags, String amount) {
        this.user = user;
        this.email = email;
        this.client = client;
        this.project = project;
        this.projectGroup = projectGroup;
        this.task = task;
        this.description = description;
        this.billable = billable;
        this.startDate = startDate;
        this.startTime = startTime;
        this.endDate = endDate;
        this.endTime = endTime;
        this.duration = duration;
        this.tags = tags;
        this.amount = amount;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getClient() {
        return client;
    }

    public void setClient(String client) {
        this.client = client;
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }

    public String getProjectGroup() {
        return projectGroup;
    }

    public void setProjectGroup(String projectGroup) {
        this.projectGroup = projectGroup;
    }

    public String getTask() {
        return task;
    }

    public void setTask(String task) {
        this.task = task;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBillable() {
        return billable;
    }

    public void setBillable(String billable) {
        this.billable = billable;
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

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    @Override
    public String toString() {
        return "InnobyteProfile{" +
                "user='" + user + '\'' +
                ", email='" + email + '\'' +
                ", client='" + client + '\'' +
                ", project='" + project + '\'' +
                ", projectGroup='" + projectGroup + '\'' +
                ", task='" + task + '\'' +
                ", description='" + description + '\'' +
                ", billable='" + billable + '\'' +
                ", startDate=" + startDate +
                ", startTime=" + startTime +
                ", endDate=" + endDate +
                ", endTime=" + endTime +
                ", duration=" + duration +
                ", tags='" + tags + '\'' +
                ", amount='" + amount + '\'' +
                '}';
    }
}
