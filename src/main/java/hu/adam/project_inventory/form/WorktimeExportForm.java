package hu.adam.project_inventory.form;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalTime;

public class WorktimeExportForm {

    private boolean today;
    private boolean thisWeek;
    private boolean thisMonth;
    private boolean customRange;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @DateTimeFormat(pattern = "HH:mm")
    private LocalTime startTime;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    @DateTimeFormat(pattern = "HH:mm")
    private LocalTime endTime;
    private long profile;

    public WorktimeExportForm() {
    }

    public WorktimeExportForm(boolean today, boolean thisWeek, boolean thisMonth, boolean customRange, LocalDate startDate, LocalTime startTime, LocalDate endDate, LocalTime endTime, long profile) {
        this.today = today;
        this.thisWeek = thisWeek;
        this.thisMonth = thisMonth;
        this.customRange = customRange;
        this.startDate = startDate;
        this.startTime = startTime;
        this.endDate = endDate;
        this.endTime = endTime;
        this.profile = profile;
    }

    public boolean isToday() {
        return today;
    }

    public void setToday(boolean today) {
        this.today = today;
    }

    public boolean isThisWeek() {
        return thisWeek;
    }

    public void setThisWeek(boolean thisWeek) {
        this.thisWeek = thisWeek;
    }

    public boolean isThisMonth() {
        return thisMonth;
    }

    public void setThisMonth(boolean thisMonth) {
        this.thisMonth = thisMonth;
    }

    public boolean isCustomRange() {
        return customRange;
    }

    public void setCustomRange(boolean customRange) {
        this.customRange = customRange;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public long getProfile() {
        return profile;
    }

    public void setProfile(long profile) {
        this.profile = profile;
    }
}
