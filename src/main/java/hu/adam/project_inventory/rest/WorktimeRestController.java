package hu.adam.project_inventory.rest;

import hu.adam.project_inventory.data.Profile;
import hu.adam.project_inventory.data.Project;
import hu.adam.project_inventory.data.Worktime;
import hu.adam.project_inventory.data.dao.ProfileDao;
import hu.adam.project_inventory.data.dao.ProjectDao;
import hu.adam.project_inventory.data.dao.WorktimeDao;
import hu.adam.project_inventory.form.WorktimeExportForm;
import hu.adam.project_inventory.util.ExportUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/worktimes")
public class WorktimeRestController {

    private static final Map<String, MediaType> contentTypes;
    private static final Map<String, String> contentDispositions;

    static {
        contentTypes = new HashMap<>();
        contentTypes.put("ics", MediaType.parseMediaType("text/calendar; charset=UTF-8"));
        contentTypes.put("inno", MediaType.parseMediaType("text/csv; charset=UTF-8"));
        contentTypes.put("innoMonthly", MediaType.parseMediaType("text/csv; charset=UTF-8"));
        contentTypes.put("tsm", MediaType.parseMediaType("text/csv; charset=UTF-8"));

        contentDispositions = new HashMap<>();
        contentDispositions.put("ics", "attachment; filename=\"ics-export-%s.ics\"");
        contentDispositions.put("inno", "attachment; filename=\"inno-export-%s.csv\"");
        contentDispositions.put("innoMonthly", "attachment; filename=\"inno-monthly-export-%s.csv\"");
        contentDispositions.put("tsm", "attachment; filename=\"tsm-export-%s.csv\"");
    }

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy_MM_dd-HH_mm_ss");

    @Autowired
    private ProjectDao projectDao;
    @Autowired
    private WorktimeDao worktimeDao;
    @Autowired
    private ProfileDao profileDao;

    private List<Worktime> lastWorktimes;
    private Profile lastProfile;

    @GetMapping("/list/{project_id}")
    public List<Worktime> list(@PathVariable("project_id") long projectId) {
        Optional<Project> project = projectDao.findById(projectId);

        if(project.isPresent())
            return worktimeDao.findAllByProjectOrderByStartDesc(project.get());
        else
            return new ArrayList<>();
    }

    @PostMapping("/export/init")
    public ResponseEntity<String> icsExport(@RequestBody WorktimeExportForm worktimeExportForm) {
        Optional<Profile> profile = profileDao.findById(worktimeExportForm.getProfile());

        if(!profile.isPresent())
            return new ResponseEntity<>("Profile not found!", HttpStatus.INTERNAL_SERVER_ERROR);

        if(profile.get().getContact() == null)
            return new ResponseEntity<>("Contact not found in profile!", HttpStatus.INTERNAL_SERVER_ERROR);

        if(!worktimeExportForm.isToday() && !worktimeExportForm.isThisWeek() && !worktimeExportForm.isThisMonth() && !worktimeExportForm.isCustomRange())
            return new ResponseEntity<>("Date range not selected!", HttpStatus.INTERNAL_SERVER_ERROR);

        List<Worktime> worktimes = getWorktimes(worktimeExportForm);

        if(worktimes.isEmpty())
            return new ResponseEntity<>("No worktimes found!", HttpStatus.INTERNAL_SERVER_ERROR);

        lastWorktimes = worktimes;
        lastProfile = profile.get();

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/export/ics/download")
    @ResponseBody
    private ResponseEntity<String> icsDownload() {
        String ics = ExportUtil.getIcsString(lastWorktimes, lastProfile.getContact());

        lastWorktimes = null;
        lastProfile = null;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", contentTypes.get("ics").toString());
        headers.set("Content-Disposition", String.format(contentDispositions.get("ics"), formatter.format(LocalDateTime.now())));

        return new ResponseEntity<>(ics, headers, HttpStatus.OK);
    }

    @GetMapping("/export/innobyte/download")
    @ResponseBody
    private ResponseEntity<String> innobyteDownload() {
        String csv = ExportUtil.getInnobyteString(lastWorktimes, lastProfile.getContact());

        lastWorktimes = null;
        lastProfile = null;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", contentTypes.get("inno").toString());
        headers.set("Content-Disposition", String.format(contentDispositions.get("inno"), formatter.format(LocalDateTime.now())));

        return new ResponseEntity<>(csv, headers, HttpStatus.OK);
    }

    @GetMapping("/export/innobyte-monthly/download")
    @ResponseBody
    private ResponseEntity<String> innobyteMonthlyDownload() {
        String csv = ExportUtil.getInnobyteMonthlyString(lastWorktimes);

        lastWorktimes = null;
        lastProfile = null;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", contentTypes.get("innoMonthly").toString());
        headers.set("Content-Disposition", String.format(contentDispositions.get("innoMonthly"), formatter.format(LocalDateTime.now())));

        return new ResponseEntity<>(csv, headers, HttpStatus.OK);
    }

    @GetMapping("/export/tsystems/download")
    @ResponseBody
    private ResponseEntity<String> tSystemsDownload() {
        String csv = ExportUtil.getTSystemsString(lastWorktimes, lastProfile.getContact());

        lastWorktimes = null;
        lastProfile = null;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", contentTypes.get("tsm").toString());
        headers.set("Content-Disposition", String.format(contentDispositions.get("tsm"), formatter.format(LocalDateTime.now())));

        return new ResponseEntity<>(csv, headers, HttpStatus.OK);
    }

    private List<Worktime> getWorktimes(WorktimeExportForm worktimeExportForm) {
        LocalDateTime start = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
        LocalDateTime end = LocalDateTime.now();

        if(worktimeExportForm.isThisWeek())
            start = LocalDateTime.of(LocalDate.now().with(DayOfWeek.MONDAY), LocalTime.MIDNIGHT);

        if(worktimeExportForm.isThisMonth())
            start = LocalDateTime.of(LocalDate.now().withDayOfMonth(1), LocalTime.MIDNIGHT);

        if(worktimeExportForm.isCustomRange()) {
            start = LocalDateTime.of(worktimeExportForm.getStartDate(), worktimeExportForm.getStartTime());
            end = LocalDateTime.of(worktimeExportForm.getEndDate(), worktimeExportForm.getEndTime());
        }

        return worktimeDao.findAllByStartGreaterThanEqualAndEndLessThanEqual(start, end);
    }
}
