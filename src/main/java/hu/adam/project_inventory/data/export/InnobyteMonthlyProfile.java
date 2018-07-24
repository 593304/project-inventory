package hu.adam.project_inventory.data.export;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({"day", "start", "end", "duration"})
public class InnobyteMonthlyProfile {

    @JsonProperty("Nap")
    private String day;
    @JsonProperty("Érkezés (óra, perc)")
    private String start;
    @JsonProperty("Távozás (óra, perc)")
    private String end;
    @JsonProperty("Ledolgozott munkaidő (óra)")
    private String duration;

    public InnobyteMonthlyProfile() {
    }

    public InnobyteMonthlyProfile(String day) {
        this.day = day;
    }

    public InnobyteMonthlyProfile(String day, String start, String end, String duration) {
        this.day = day;
        this.start = start;
        this.end = end;
        this.duration = duration;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    @Override
    public String toString() {
        return "InnobyteMonthlyProfile{" +
                "day='" + day + '\'' +
                ", start='" + start + '\'' +
                ", end='" + end + '\'' +
                ", duration='" + duration + '\'' +
                '}';
    }
}
