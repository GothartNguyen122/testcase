import java.util.List;
import java.util.stream.Collectors;

public class FilterBuilder {
    /**
     * Build filter string cho kiểu String, ví dụ: skills in ('Java' 'React')
     */
    public static String buildInFilter(String field, List<String> values) {
        if (values == null || values.isEmpty())
            return "";
        String joined = values.stream()
                .map(val -> "'" + val + "'")
                .collect(Collectors.joining(" "));
        return field + " in (" + joined + ")";
    }

    /**
     * Build filter string cho kiểu số, ví dụ: skills.id in (26 30)
     */
    public static String buildInFilterInt(String field, List<Integer> values) {
        if (values == null || values.isEmpty())
            return "";
        String joined = values.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(" "));
        return field + " in (" + joined + ")";
    }
}