package vn.hoidanit.jobhunter.domain.response;

import java.time.Instant;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import vn.hoidanit.jobhunter.util.constant.GenderEnum;
import vn.hoidanit.jobhunter.util.constant.LevelEnum;

@Getter
@Setter
public class ResCreateUserDTO {
    private long id;
    private String name;
    private String email;
    private GenderEnum gender;
    private String address;
    private String phone;
    private int age;
    private Instant createdAt;
    private CompanyUser company;
    private double salary;
    private LevelEnum level;
    private List<String> skills;

    @Getter
    @Setter
    public static class CompanyUser {
        private long id;
        private String name;
    }
}
