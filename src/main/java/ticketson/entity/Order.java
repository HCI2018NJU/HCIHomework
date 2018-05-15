package ticketson.entity;

import javax.persistence.*;
import java.util.List;

/**
 * Created by shea on 2018/2/2.
 */
@Entity
@Table(name = "`order`")
public class Order {
    @Id
    @Column(name = "`oid`")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long oid;

    /**
     * 是否取消。用户支付订单的时候判断是否超过离下单时间超过了15分钟。系统每天晚上12点判断订单是否离下单时间超过了15分钟。
     * 如超过，置为取消
     */
    @Column(name = "`isCanceled`")
    private boolean isCanceled;

    /**
     * 支付账号，退订时将金额原路返回
     */
    @Column(name = "`bid`")
    private Long bid;

    /**
     * 用户退订或系统配票失败而退订。如果用户退订，则扣除部分手续费。如果系统退订，则全额退款，并且退还优惠券（且将优惠券有效期延后）
     * 到底是用户退订还是系统退订根据isImmediatePurchase和allocateSucceeded来判断，当这两者都为true的时候是系统配票失败而退订
     */
    @Column(name = "`isUnSubscribed`",columnDefinition = "tinyint(1) default 0")
    private boolean isUnSubscribed;

    @Column(name = "`paySuccess`")
    private boolean paySuccess;

    /**
     * 用户退订后扣除的手续费
     */
    @Column(name = "`unSubscribeFees`")
    private double unSubscribeFees;

    /**
     * 订单生成时间，可以用来判断是否支付过期
     */
    @Column(name = "`orderDate`")
    private long orderDate;

    /**
     * 总票数
     */
    @Column(name = "`totalAmount`")
    private int totalAmount;

    /**
     * 总价(原价)
     */
    @Column(name = "`totalPrice`")
    private float totalPrice;

    /**
     * 实付价，折扣之后的价格
     */
    @Column(name = "`payPrice`")
    private float payPrice;

    /**
     * 会员折扣。会员折扣可以和优惠券一起使用。先折扣后减。但不可以同时使用多张优惠券
     */
    @Column(name = "`discount`")
    private float discount;

    @Column(name = "`isOfflinePurchase`")
    private boolean isOfflinePurchase;

    /**
     * 选座购买或直接购买,默认为选座购买,isImmediatePurchase为false
     */
    @Column(name = "`isImmediatePurchase`",columnDefinition = "tinyint(1) default 0")
    private boolean isImmediatePurchase;

    /**
     * 直接购买的时候是否已经被分配座位
     */
    @Column(name = "`isAllocated`",columnDefinition = "tinyint(1) default 0")
    private boolean isAllocated;

    /**
     * 直接购买的时候是否已经被成功分配座位
     */
    @Column(name = "`allocateSucceeded`",columnDefinition = "tinyint(1) default 0")
    private boolean allocateSucceeded;

    /**
     * 订单中所有可能的票价
     */
    @Column(name = "`prices`")
    private String prices;

    /**
     * 当直接购买的时候，选择等级
     */
    @Column(name = "`level`")
    private int level;

    @Column(name = "`type`")
    private String type;

    /**
     * 购买者使用的优惠券名称
     */
    @Column(name="`couponName`")
    private String couponName;


    @ManyToOne(cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "`mid`")
    private Member member;

    @ManyToOne(cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "`pid`")
    private Period period;

    @OneToMany(mappedBy = "order",cascade = {CascadeType.PERSIST})
    private List<Ticket> tickets;

    @OneToOne(mappedBy = "order",cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "`cid`")
    private Coupon coupon;

    public Long getOid() {
        return oid;
    }

    public void setOid(Long oid) {
        this.oid = oid;
    }

    public Long getBid() {
        return bid;
    }

    public void setBid(Long bid) {
        this.bid = bid;
    }

    public boolean getIsUnSubscribed() {
        return isUnSubscribed;
    }

    public void setIsUnSubscribed(boolean isUnSubscribed) {
        this.isUnSubscribed = isUnSubscribed;
    }

    public long getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(long orderDate) {
        this.orderDate = orderDate;
    }

    public int getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(int totalAmount) {
        this.totalAmount = totalAmount;
    }

    public float getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(float totalPrice) {
        this.totalPrice = totalPrice;
    }

    public boolean getIsImmediatePurchase() {
        return isImmediatePurchase;
    }

    public void setIsImmediatePurchase(boolean immediatePurchase) {
        this.isImmediatePurchase = immediatePurchase;
    }

    public boolean getIsAllocated() {
        return isAllocated;
    }

    public void setIsAllocated(boolean isAllocated) {
        this.isAllocated = isAllocated;
    }

    public boolean getAllocateSucceeded() {
        return allocateSucceeded;
    }

    public void setAllocateSucceeded(boolean allocateSucceeded) {
        this.allocateSucceeded = allocateSucceeded;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public Period getPeriod() {
        return period;
    }

    public void setPeriod(Period period) {
        this.period = period;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }

    public boolean getIsCanceled() {
        return isCanceled;
    }

    public void setIsCanceled(boolean isCanceled) {
        this.isCanceled = isCanceled;
    }

    public double getUnSubscribeFees() {
        return unSubscribeFees;
    }

    public void setUnSubscribeFees(double unSubscribeFees) {
        this.unSubscribeFees = unSubscribeFees;
    }

    public float getPayPrice() {
        return payPrice;
    }

    public void setPayPrice(float payPrice) {
        this.payPrice = payPrice;
    }

    public float getDiscount() {
        return discount;
    }

    public void setDiscount(float discount) {
        this.discount = discount;
    }

    public Coupon getCoupon() {
        return coupon;
    }

    public void setCoupon(Coupon coupon) {
        this.coupon = coupon;
    }

    public String getPrices() {
        return prices;
    }

    public void setPrices(String prices) {
        this.prices = prices;
    }

    public String getCouponName() {
        return couponName;
    }

    public void setCouponName(String couponName) {
        this.couponName = couponName;
    }

    public boolean getPaySuccess(){
        return paySuccess;
    }

    public void setPaySuccess(boolean paySuccess){
        this.paySuccess = paySuccess;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setIsOfflinePurchase(boolean isOfflinePurchase){
        this.isOfflinePurchase = isOfflinePurchase;
    }

    public boolean getIsOfflinePurchase(){
        return isOfflinePurchase;
    }

}
