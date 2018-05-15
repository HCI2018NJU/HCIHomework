package ticketson.entity;

import javax.persistence.*;

/**
 * Created by shea on 2018/2/2.
 */
@Entity
@Table(name = "`ticket`")
public class Ticket {
    @Id
    @Column(name = "`tid`")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tid;


    @OneToOne(cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "`sid`")
    private Seat seat;

    /**
     * 是否检票
     */
    @Column(name = "`isChecked`",columnDefinition = "tinyint(1) default 0")
    private boolean isChecked;

    /**
     * 是否被超时取消
     */
    @Column(name = "`isCanceled`")
    private boolean isCanceled;

    /**
     * 是否退订
     */
    @Column(name = "`isUnSubscribed`",columnDefinition = "tinyint(1) default 0")
    private boolean isUnSubscribed;

    @ManyToOne(cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "`oid`")
    private Order order;

    public Long getTid() {
        return tid;
    }

    public void setTid(Long tid) {
        this.tid = tid;
    }

    public Seat getSeat() {
        return seat;
    }

    public void setSeat(Seat seat) {
        this.seat = seat;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public boolean getIsChecked() {
        return isChecked;
    }

    public void setIsChecked(boolean isChecked) {
        this.isChecked = isChecked;
    }

    public boolean getIsUnSubscribed() {
        return isUnSubscribed;
    }

    public void setIsUnSubscribed(boolean isUnSubscribed) {
        this.isUnSubscribed = isUnSubscribed;
    }

    public boolean getIsCanceled() {
        return isCanceled;
    }

    public void setIsCanceled(boolean isCanceled) {
        this.isCanceled = isCanceled;
    }
}
