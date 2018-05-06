package hu.adam.project_inventory.util;

public class VCardUtil {

    private static final String begin = "BEGIN:VCARD\r\nVERSION:4.0\r\n";
    private static final String name = "N:%s;%s;;%s;\r\n";
    private static final String formattedName = "FN:%s %s\r\n";
    private static final String organization = "ORG:%s\r\n";
    private static final String eMail = "EMAIL:%s\r\n";
    private static final String cellPhone = "TEL;TYPE=cell:%s\r\n";
    private static final String end = "END:VCARD\r\n";

    public static String getVCardString(String title, String firstName, String lastName, String companyName, String mail, String phone) {
        String n = String.format(VCardUtil.name, lastName, firstName, title);
        String fn = String.format(VCardUtil.formattedName, firstName, lastName);
        String org = companyName != null ? String.format(VCardUtil.organization, companyName) : "";
        String m = mail != null ? String.format(VCardUtil.eMail, mail) : "";
        String c = phone != null ? String.format(VCardUtil.cellPhone, phone) : "";

        return begin + n + fn + org + m + c + end;
    }
}
