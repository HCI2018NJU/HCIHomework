package ticketson.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by shea on 2018/2/3.
 */
@Entity
@Table(name = "`venue_modify`")
public class VenueModify {
    /**
     * 七位注册码
     */
    @Id
    @Column(name = "`vmid`")
    private String vmid;

    @Column(name = "`name`")
    private String name;

    @Column(name = "`checked`",columnDefinition = "tinyint(1) default 0")
    private boolean checked;

    @Column(name = "`checkPassed`",columnDefinition = "tinyint(1) default 0")
    private boolean checkPassed;

    @Column(name = "`provinceCode`")
    private Integer provinceCode;

    @Column(name = "`cityCode`")
    private Integer cityCode;

    @Column(name = "`districtCode`")
    private Integer districtCode;

    @Column(name = "`location`")
    private String location;

    @Column(name = "`modifyTime`")
    private long modifyTime;

    public String getVmid() {
        return vmid;
    }

    public void setVmid(String vmid) {
        this.vmid = vmid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean getChecked(){return checked;}

    public void setChecked(boolean checked){this.checked = checked;}

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

    public Integer getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(Integer provinceCode) {
        this.provinceCode = provinceCode;
    }

    public Integer getCityCode() {
        return cityCode;
    }

    public void setCityCode(Integer cityCode) {
        this.cityCode = cityCode;
    }

    public Integer getDistrictCode() {
        return districtCode;
    }

    public void setDistrictCode(Integer districtCode) {
        this.districtCode = districtCode;
    }

    public long getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(long modifyTime) {
        this.modifyTime = modifyTime;
    }
}
