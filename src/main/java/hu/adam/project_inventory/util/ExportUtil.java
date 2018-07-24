package hu.adam.project_inventory.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import hu.adam.project_inventory.data.Contact;
import hu.adam.project_inventory.data.Worktime;
import hu.adam.project_inventory.data.export.InnobyteMonthlyProfile;
import hu.adam.project_inventory.data.export.InnobyteProfile;
import hu.adam.project_inventory.data.export.TSystemsProfile;
import net.fortuna.ical4j.model.*;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.Date;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.component.VTimeZone;
import net.fortuna.ical4j.model.parameter.Cn;
import net.fortuna.ical4j.model.parameter.Role;
import net.fortuna.ical4j.model.property.Attendee;
import net.fortuna.ical4j.model.property.CalScale;
import net.fortuna.ical4j.model.property.ProdId;
import net.fortuna.ical4j.model.property.Uid;
import net.fortuna.ical4j.util.RandomUidGenerator;

import java.net.URI;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class ExportUtil {

    private static final Map<String, DateTimeFormatter> formatters;
    static {
        formatters = new HashMap<>();
        formatters.put("date", DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        formatters.put("time", DateTimeFormatter.ofPattern("HH:mm:ss"));
        formatters.put("timeMonthly", DateTimeFormatter.ofPattern("H, m"));
    }

    private static final long workMinutes = 480L;

    public static String getIcsString(List<Worktime> worktimes, Contact contact) {
        VTimeZone tz = TimeZoneRegistryFactory
                .getInstance()
                .createRegistry()
                .getTimeZone("Europe/Budapest")
                .getVTimeZone();

        Attendee attendee;
        if(contact.getMail().isEmpty())
            attendee = new Attendee(URI.create("mailto:"));
        else
            attendee = new Attendee(URI.create("mailto:" + contact.getMail()));
        attendee.getParameters().add(Role.REQ_PARTICIPANT);
        StringBuilder cn = new StringBuilder();
        if(!contact.getLastName().isEmpty())
            cn.append(contact.getLastName());
        if(!contact.getFirstName().isEmpty())
            cn.append(" ").append(contact.getFirstName());
        attendee.getParameters().add(new Cn(cn.toString()));

        Calendar icsCalendar = new Calendar();
        icsCalendar.getProperties().add(new ProdId("-//Events Calendar//iCal4j 1.0//EN"));
        icsCalendar.getProperties().add(CalScale.GREGORIAN);

        for(Worktime worktime : worktimes) {
            if(worktime.getProject() != null) {
                Uid uid = new RandomUidGenerator().generateUid();

                DateTime start = new DateTime(Date.from(worktime.getStart().atZone(ZoneId.systemDefault()).toInstant()));
                DateTime end = new DateTime(Date.from(worktime.getEnd().atZone(ZoneId.systemDefault()).toInstant()));

                VEvent meeting;
                if (!worktime.getDescription().isEmpty())
                    meeting = new VEvent(start, end, worktime.getDescription());
                else
                    meeting = new VEvent(start, end, "");

                meeting.getProperties().add(uid);
                meeting.getProperties().add(tz.getTimeZoneId());
                meeting.getProperties().add(attendee);

                icsCalendar.getComponents().add(meeting);
            }
        }

        return icsCalendar.toString();
    }

    public static String getInnobyteString(List<Worktime> worktimes, Contact contact) {
        CsvMapper mapper = new CsvMapper();
        mapper.registerModule(new Jdk8Module());

        CsvSchema schema = mapper.schemaFor(InnobyteProfile.class).withHeader();

        StringBuilder innobyteExport = new StringBuilder();
        boolean firstRun = true;

        for (Worktime worktime : worktimes) {
            if(worktime.getProject() != null) {
                InnobyteProfile innobyte = new InnobyteProfile(
                        contact.getLastName() + " " + contact.getFirstName(),
                        contact.getMail(),
                        null,
                        worktime.getProject().getName(),
                        worktime.getProject().getCode(),
                        null,
                        worktime.getDescription(),
                        null,
                        formatters.get("date").format(worktime.getStart()),
                        formatters.get("time").format(worktime.getStart()),
                        formatters.get("date").format(worktime.getEnd()),
                        formatters.get("time").format(worktime.getEnd()),
                        durationToString(Duration.between(worktime.getStart(), worktime.getEnd())),
                        null,
                        null
                );

                try {
                    String csvLine = mapper.writer(schema).writeValueAsString(innobyte);
                    innobyteExport.append(csvLine);

                    if (firstRun) {
                        schema = schema.withoutHeader();
                        firstRun = false;
                    }
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }
        }

        return innobyteExport.toString();
    }

    public static String getInnobyteMonthlyString(List<Worktime> worktimes) {
        CsvMapper mapper = new CsvMapper();
        mapper.registerModule(new Jdk8Module());

        CsvSchema schema = mapper.schemaFor(InnobyteMonthlyProfile.class).withHeader();

        StringBuilder innobyteMonthlyExport = new StringBuilder();
        boolean firstRun = true;
        int lastDayOfMonth = worktimes.get(0).getStart().toLocalDate().lengthOfMonth();
        LocalTime time = null;

        Set<Integer> workDates = new HashSet<>();
        for (Worktime worktime : worktimes) {
            if(worktime.getProject() != null) {
                workDates.add(worktime.getStart().getDayOfMonth());

                if(time == null)
                    time = LocalTime.of(9, 0,0);
            }
        }

        for (int i = 1; i < lastDayOfMonth + 1; i++) {
            LocalDate day = worktimes.get(0).getStart().toLocalDate().withDayOfMonth(i);
            InnobyteMonthlyProfile innobyte;

            if(day.getDayOfWeek() == DayOfWeek.SATURDAY || day.getDayOfWeek() == DayOfWeek.SUNDAY || !workDates.contains(i))
                innobyte = new InnobyteMonthlyProfile(Integer.toString(i));
            else {
                LocalDateTime start = LocalDateTime.of(day, time);
                LocalDateTime end = LocalDateTime.of(day, time.plusMinutes((workMinutes)));

                innobyte = new InnobyteMonthlyProfile(
                        Integer.toString(i),
                        formatters.get("timeMonthly").format(start),
                        formatters.get("timeMonthly").format(end),
                        Double.toString((double)workMinutes / 60)
                );
            }

            try {
                String csvLine = mapper.writer(schema).writeValueAsString(innobyte);
                innobyteMonthlyExport.append(csvLine);

                if (firstRun) {
                    schema = schema.withoutHeader();
                    firstRun = false;
                }
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }

        return innobyteMonthlyExport.toString();
    }

    public static String getTSystemsString(List<Worktime> worktimes, Contact contact) {
        CsvMapper mapper = new CsvMapper();
        mapper.registerModule(new Jdk8Module());

        CsvSchema schema = mapper.schemaFor(TSystemsProfile.class).withHeader();

        StringBuilder tSystemsExport = new StringBuilder();
        boolean firstRun = true;

        for (Worktime worktime : worktimes) {
            if(worktime.getProject() != null) {
                TSystemsProfile tsm = new TSystemsProfile(
                        contact.getLastName() + " " + contact.getFirstName(),
                        worktime.getProject().getName(),
                        worktime.getProject().getCode(),
                        worktime.getProject().getProjectManager(),
                        worktime.getProject().getServiceManager(),
                        worktime.getDescription(),
                        formatters.get("date").format(worktime.getStart()),
                        formatters.get("time").format(worktime.getStart()),
                        formatters.get("date").format(worktime.getEnd()),
                        formatters.get("time").format(worktime.getEnd()),
                        durationToString(Duration.between(worktime.getStart(), worktime.getEnd()))
                );

                try {
                    String csvLine = mapper.writer(schema).writeValueAsString(tsm);
                    tSystemsExport.append(csvLine);

                    if (firstRun) {
                        schema = schema.withoutHeader();
                        firstRun = false;
                    }
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }
        }

        return tSystemsExport.toString();
    }

    private static String durationToString(Duration duration) {
        StringBuilder result = new StringBuilder();

        long hours = duration.toHours();
        long minutes = duration.minusHours(hours).toMinutes();
        long seconds = duration.minusHours(hours).minusMinutes(minutes).getSeconds();

        result.append(String.format("%02d", hours)).append(":").append(String.format("%02d", minutes)).append(":").append(String.format("%02d", seconds));

        return result.toString();
    }
}
