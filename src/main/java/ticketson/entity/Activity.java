package ticketson.entity;

import javax.persistence.*;
import java.util.List;

/**
 * Created by shea on 2018/2/2.
 * 场馆制定的活动计划
 */
@Entity
@Table(name = "`activity`")
public class Activity {

    @Id
    @Column(name = "`aid`")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long aid;

    @Column(name = "`name`")
    private String name;

    @Column(name = "`type`")
    private String type;

    @Column(name = "`description`")
    private String description;

    /**
     * 海报图片
     */
    @Column(name = "`url`")
    private String url;

    @Column(name = "`lowestPrice`")
    private float lowestPrice;

    /**
     * 例如 _1200_800_400
     */
    @Column(name = "`prices`")
    private String prices;

    /**
     * 营业额是否已经结算
     */
    @Column(name = "`turnoverSettled`", columnDefinition = "tinyint(1) default 0")
    private boolean turnoverSettled;

    /**
     * 线上营业额
     */
    @Column(name = "`turnover`")
    private double turnover;

    /**
     * 线下营业额
     */
    @Column(name = "`offlineTurnover`")
    private double offlineTurnover;



    @ManyToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE,CascadeType.REFRESH})
    @JoinColumn(name = "`vid`")
    private Venue venue;

    /**
     * 记录这次活动计划的最后一场的开场时间，自此售票结束
     */
    @Column(name = "`endSell`")
    private long endSell;

    /**
     * 第一场开始时间
     */
    @Column(name="`begin`")
    private long begin;

    /**
     * 最后一场结束时间
     */
    @Column(name="`end`")
    private long end;

    @OneToMany(mappedBy = "activity",cascade = {CascadeType.PERSIST,CascadeType.MERGE,CascadeType.REFRESH})
    private List<Period> periods;

    public Long getAid() {
        return aid;
    }

    public void setAid(Long aid) {
        this.aid = aid;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean getTurnoverSettled() {
        return turnoverSettled;
    }

    public void setTurnoverSettled(boolean turnoverSettled) {
        this.turnoverSettled = turnoverSettled;
    }

    public Venue getVenue() {
        return venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }

    public long getEndSell() {
        return endSell;
    }

    public void setEndSell(long endSell) {
        this.endSell = endSell;
    }

    public List<Period> getPeriods() {
        return periods;
    }

    public void setPeriods(List<Period> periods) {
        this.periods = periods;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public float getLowestPrice() {
        return lowestPrice;
    }

    public String getPrices() {
        return prices;
    }

    public void setPrices(String prices) {
        this.prices = prices;
    }

    public void setLowestPrice(float lowestPrice) {
        this.lowestPrice = lowestPrice;
    }

    public long getBegin() {
        return begin;
    }

    public void setBegin(long begin) {
        this.begin = begin;
    }

    public double getTurnover() {
        return turnover;
    }

    public void setTurnover(double turnover) {
        this.turnover = turnover;
    }

    public long getEnd() {
        return end;
    }

    public void setEnd(long end) {
        this.end = end;
    }

    public double getOfflineTurnover() {
        return offlineTurnover;
    }

    public void setOfflineTurnover(double offlineTurnover) {
        this.offlineTurnover = offlineTurnover;
    }
}
