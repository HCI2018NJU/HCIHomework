package ticketson.entity;

import javax.persistence.*;

/**
 * Created by shea on 2018/2/2.
 * 记录每个活动下椅子信息
 */
@Entity
@Table(name = "`seat`")
public class Seat {
    @Id
    @Column(name = "`sid`")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sid;

    @Column(name = "`layout_sid`")
    private int layoutSid;

    @Column(name = "`row`")
    private int row;

    @Column(name = "`column`")
    private int column;

    @Column(name = "`floor`")
    private String floor;

    /**
     * 看台  grandstand
     */
    @Column(name = "`gs`")
    private String gs;

    /**
     * 是否可售
     */
    @Column(name = "`isAvailable`")
    private boolean isAvailable;

    @Column(name = "`level`")
    private int level;

    @Column(name = "`price`")
    private float price;

    @ManyToOne(cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "`pid`")
    private Period period;

    public Long getSid() {
        return sid;
    }

    public void setSid(Long sid) {
        this.sid = sid;
    }

    public int getLayoutSid() {
        return layoutSid;
    }

    public void setLayoutSid(int layoutSid) {
        this.layoutSid = layoutSid;
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public int getColumn() {
        return column;
    }

    public void setColumn(int column) {
        this.column = column;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public String getGs() {
        return gs;
    }

    public void setGs(String gs) {
        this.gs = gs;
    }

    public boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public Period getPeriod() {
        return period;
    }

    public void setPeriod(Period period) {
        this.period = period;
    }

    @Override
    public String toString() {
        return "Seat{" +
                "sid=" + sid +
                ", layoutSid=" + layoutSid +
                ", row=" + row +
                ", column=" + column +
                ", floor='" + floor + '\'' +
                ", gs='" + gs + '\'' +
                ", isAvailable=" + isAvailable +
                ", level=" + level +
                ", price=" + price +
                '}';
    }
}
