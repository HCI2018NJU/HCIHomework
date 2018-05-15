package ticketson.entity;

/**
 * Created by shea on 2018/2/24.
 */

import javax.persistence.*;

/**
 * 优惠券
 */
@Entity
@Table(name = "`coupon`")
public class Coupon {
    @Id
    @Column(name = "`cid`")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long cid;
    /**
     * 优惠券类型序号
     */
    @Column(name = "`type`")
    private int type;
    /**
     * 优惠券名称
     */
    @Column(name = "`name`")
    private String name;
    /**
     * 优惠金额
     */
    @Column(name = "`minus`")
    private float minus;
    /**
     * 消费时间
     */
    @Column(name = "`consumeTime`")
    private Long consumeTime;

    /**
     * 适用范围，订单金额满足的最小值
     */
    @Column(name = "`min`")
    private float min;

    @Column(name = "`minCredit`")
    private int minCredit;

    /**
     * 有效的开始日期
     */
    @Column(name = "`validDateBegin`")
    private long validDateBegin;

    /**
     * 有效的结束日期
     */
    @Column(name = "`validDateEnd`")
    private long validDateEnd;

    //一个优惠券只可以用于一个订单，一个订单可以使用多个优惠券。
    //当订单为null的时候表示未使用，配票失败返回优惠券
    @OneToOne(cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "`oid`")
    private Order order;

    @ManyToOne(cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "`mid`" )
    private Member member;

    public long getCid() {
        return cid;
    }

    public void setCid(long cid) {
        this.cid = cid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public float getMinus() {
        return minus;
    }

    public void setMinus(float minus) {
        this.minus = minus;
    }

    public Long getConsumeTime() {
        return consumeTime;
    }

    public void setConsumeTime(long consumeTime) {
        this.consumeTime = consumeTime;
    }

    public float getMin() {
        return min;
    }

    public void setMin(float min) {
        this.min = min;
    }

    public long getValidDateBegin() {
        return validDateBegin;
    }

    public void setValidDateBegin(long validDateBegin) {
        this.validDateBegin = validDateBegin;
    }

    public long getValidDateEnd() {
        return validDateEnd;
    }

    public void setValidDateEnd(long validDateEnd) {
        this.validDateEnd = validDateEnd;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public void setConsumeTime(Long consumeTime) {
        this.consumeTime = consumeTime;
    }

    public int getMinCredit() {
        return minCredit;
    }

    public void setMinCredit(int minCredit) {
        this.minCredit = minCredit;
    }

}
