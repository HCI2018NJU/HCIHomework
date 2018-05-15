package ticketson.entity;

import javax.persistence.*;
import java.util.List;

/**
 * Created by shea on 2018/2/2.
 */
@Entity
@Table(name = "`member`")
public class Member {
    @Id
    @Column(name = "`mid`")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mid;

    @Column(name = "`email`")
    private String email;

    @Column(name = "`psw`")
    private String psw;

    @Column(name = "`registerTime`")
    private Long registerTime;

    @Column(name = "`nickname`")
    private String nickname;

    @Column(name = "`token`")
    private String token;

//    @Column(name = "`activated`")
    @Column(name = "`activated`",columnDefinition = "tinyint(1) default 0")
    private boolean activated;

//    @Column(name = "`cityCode`")
    @Column(name = "`provinceCode`")
    private int provinceCode;

    @Column(name = "`cityCode`")
    private int cityCode;

    @Column(name = "`districtCode`")
    private int districtCode;

    /**
     * 是否注销
     */
    @Column(name = "`isCanceled`",columnDefinition = "tinyint(1) default 0")
    private boolean isCanceled;

    @Column(name = "`level`")
    private int level = 1;

    /**
     * 积分
     */
    @Column(name = "`credit`")
    private int credit;

    /**
     * 总消费
     */
    @Column(name = "`consumption`")
    private double consumption;



    @OneToMany(mappedBy = "member",cascade = {CascadeType.PERSIST})
    private List<Order> orders;

    @OneToMany(mappedBy = "member",cascade = {CascadeType.PERSIST})
    private List<Coupon> coupons;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPsw() {
        return psw;
    }

    public void setPsw(String psw) {
        this.psw = psw;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getMid() {
        return mid;
    }

    public void setMid(Long mid) {
        this.mid = mid;
    }

    public boolean getIsCanceled() {
        return isCanceled;
    }

    public void setIsCanceled(boolean isCanceled) {
        this.isCanceled = isCanceled;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getCredit() {
        return credit;
    }

    public void setCredit(int credit) {
        this.credit = credit;
    }

    public double getConsumption() {
        return consumption;
    }

    public void setConsumption(double consumption) {
        this.consumption = consumption;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public int getCityCode() {
        return cityCode;
    }

    public void setCityCode(int cityCode) {
        this.cityCode = cityCode;
    }

    public boolean getActivated() {
        return activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public int getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(int provinceCode) {
        this.provinceCode = provinceCode;
    }

    public int getDistrictCode() {
        return districtCode;
    }

    public void setDistrictCode(int districtCode) {
        this.districtCode = districtCode;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public List<Coupon> getCoupons() {
        return coupons;
    }

    public void setCoupons(List<Coupon> coupons) {
        this.coupons = coupons;
    }

    public Long getRegisterTime() {
        return registerTime;
    }

    public void setRegisterTime(Long registerTime) {
        this.registerTime = registerTime;
    }
}
