package hu.adam.project_inventory.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import hu.adam.project_inventory.data.Contact;
import hu.adam.project_inventory.data.Worktime;
import hu.adam.project_inventory.data.export.InnobyteProfile;
import hu.adam.project_inventory.data.export.TSystemsProfile;
import net.fortuna.ical4j.model.*;
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
import java.time.Duration;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class ExportUtil {

    private static DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");

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
                        dateFormatter.format(worktime.getStart()),
                        timeFormatter.format(worktime.getStart()),
                        dateFormatter.format(worktime.getEnd()),
                        timeFormatter.format(worktime.getEnd()),
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
                        dateFormatter.format(worktime.getStart()),
                        timeFormatter.format(worktime.getStart()),
                        dateFormatter.format(worktime.getEnd()),
                        timeFormatter.format(worktime.getEnd()),
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
