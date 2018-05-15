package ticketson.entity;

import javax.persistence.*;
import java.util.List;

/**
 * Created by shea on 2018/2/2.
 */
@Entity
@Table(name = "`venue`")
public class Venue {
    /**
     * 七位注册码
     */
    @Id
    @Column(name = "`vid`")
    private String vid;

    @Column(name = "`name`")
    private String name;

    @Column(name = "`psw`")
    private String psw;

    @Column(name = "`checked`",columnDefinition = "tinyint(1) default 0")
    private boolean checked;

    @Column(name = "`checkPassed`",columnDefinition = "tinyint(1) default 0")
    private boolean checkPassed;

    @Column(name = "`provinceCode`")
    private int provinceCode;

    @Column(name = "`cityCode`")
    private int cityCode;

    @Column(name = "`districtCode`")
    private int districtCode;

    @Column(name = "`location`")
    private String location;

    @Column(name = "`totalSeats`")
    private Integer totalSeats;

    /**
     * 场馆的账户余额
     */
    @Column(name = "`balance`")
    private double balance;

    @Column(name = "`registerTime`")
    private Long registerTime;

    /**
     * FetchType默认为lazy，就是查这条记录的时候不把list一起查出来，getlist的时候才会查list
     */
    @OneToMany(mappedBy = "venue",cascade = {CascadeType.PERSIST})
    private List<Activity> activities;

    public String getVid() {
        return vid;
    }

    public void setVid(String vid) {
        this.vid = vid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPsw() {
        return psw;
    }

    public void setPsw(String psw) {
        this.psw = psw;
    }

    public boolean getChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    public boolean getCheckPassed() {
        return checkPassed;
    }

    public void setCheckPassed(boolean checkPassed) {
        this.checkPassed = checkPassed;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public void setActivities(List<Activity> activities) {
        this.activities = activities;
    }

    public int getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(int provinceCode) {
        this.provinceCode = provinceCode;
    }

    public int getCityCode() {
        return cityCode;
    }

    public void setCityCode(int cityCode) {
        this.cityCode = cityCode;
    }

    public int getDistrictCode() {
        return districtCode;
    }

    public void setDistrictCode(int districtCode) {
        this.districtCode = districtCode;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public Long getRegisterTime() {
        return registerTime;
    }

    public void setRegisterTime(Long registerTime) {
        this.registerTime = registerTime;
    }
}
