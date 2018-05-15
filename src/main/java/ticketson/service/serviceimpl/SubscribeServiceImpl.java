package ticketson.service.serviceimpl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import ticketson.dao.*;
import ticketson.entity.*;
import ticketson.exception.InvalidRequestException;
import ticketson.exception.ResourceNotFoundException;
import ticketson.model.UnsubscribeModel;
import ticketson.service.SubscribeService;
import ticketson.util.CreditHelper;
import ticketson.util.DateHelper;
import ticketson.util.ManagerHelper;
import ticketson.util.UnSubscribeHelper;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by shea on 2018/3/13.
 */
@Service
public class SubscribeServiceImpl implements SubscribeService {
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    MemberRepository memberRepository;
    @Autowired
    PeriodRepository periodRepository;
    @Autowired
    SeatRepository seatRepository;
    @Autowired
    TicketRepository ticketRepository;
    @Autowired
    CouponRepository couponRepository;
    @Autowired
    BankRepository bankRepository;
    @Autowired
    ManagerRepository managerRepository;
    @Autowired
    ActivityRepository activityRepository;
    @Autowired
    VenueRepository venueRepository;

    private static final Logger logger = LoggerFactory.getLogger("SubscribeServiceImpl");

    /**
     * 将该order类型改为已退订
     *
     * @param oid 订单编号
     * @return
     */
    @Override
    public UnsubscribeModel unsubscribe(long oid) {
        Order order = orderRepository.findOne(oid);
        if(order==null){
            throw new InvalidRequestException("无法找到此订单");
        }
        //将order设为已退订
        order.setIsUnSubscribed(true);
        //将order中的ticket设为已退订
        List<Ticket> tickets = order.getTickets();
        List<Seat> seats = new ArrayList<>();
        for (Ticket ticket:tickets){
            ticket.setIsUnSubscribed(true);
            Seat seat = ticket.getSeat();
            seat.setIsAvailable(true);
            seats.add(seat);
        }
        ticketRepository.save(tickets);
        seatRepository.save(seats);
        UnsubscribeModel unsubscribeModel = unSubscribeByOrder(order);
        return unsubscribeModel;
    }


    /**
     * 用户立即购买，下订单
     *
     * @return
     */
    @Override
    public long immediatePurchase(long mid,long pid,Integer totalAmount,Integer level,String prices,float totalPrice) {
        Order order = createOrder(pid,totalAmount,prices,totalPrice);
        order.setLevel(level);
        order.setIsOfflinePurchase(false);
        order.setIsImmediatePurchase(true);
        Member member = memberRepository.findOne(mid);
        order.setMember(member);
        order = orderRepository.saveAndFlush(order);
        return order.getOid();
    }

    /**
     * 用户选座购买，下订单
     *
     * @return
     */
    @Override
    public long seatPurchase(List layoutSids,Long mid,Long pid,Integer totalAmount,String prices,float totalPrice) {
        Order order = createSeatPurchaseOrder(layoutSids,pid,totalAmount,prices,totalPrice);
        order.setIsOfflinePurchase(false);
        Member member = memberRepository.findOne(mid);
        order.setMember(member);
        order = orderRepository.saveAndFlush(order);
        return order.getOid();
    }

    private Order createSeatPurchaseOrder(List layoutSids,Long pid,Integer totalAmount,String prices,float totalPrice){
        //先检查界面计算的信息是否对应
        if(layoutSids.size()!=totalAmount){
            throw new InvalidRequestException("票数出错");
        }
        double prePrice = 0;
        List<Seat> seats = new ArrayList<>();
        for(int i=0;i<layoutSids.size();i++){
            Seat seat = seatRepository.findByPeriod_PidAndLayoutSid(pid,Integer.parseInt(layoutSids.get(i).toString()));
            prePrice+=seat.getPrice();
            seats.add(seat);
        }
        if(prePrice!=totalPrice){
            throw new InvalidRequestException("价格出错");
        }
        //锁座位
        boolean orderSeatsResult = orderSeat(seats);
        if(!orderSeatsResult){
            throw new InvalidRequestException("晚了一步，部分座位已被抢走");
        }
        //然后处理选座购买的逻辑，生成订单
        Order order = createOrder(pid,totalAmount,prices,totalPrice);
        order.setIsImmediatePurchase(false);
        //创建票据
        List<Ticket> tickets = new ArrayList<>();
        for(Seat seat:seats){
            Ticket ticket = new Ticket();
            ticket.setSeat(seat);
            ticket.setOrder(order);

            tickets.add(ticket);
        }
        ticketRepository.save(tickets);
        order.setTickets(tickets);
        return order;
    }

    private Order createOrder(long pid,Integer totalAmount,String prices,float totalPrice){
        Order order = new Order();
        order.setTotalAmount(totalAmount);
        order.setPrices(prices);
        order.setTotalPrice(totalPrice);
        order.setOrderDate(System.currentTimeMillis());
        Period period = periodRepository.findOne(pid);
        order.setPeriod(period);
        order.setType(period.getActivity().getType());
        return order;
    }

    /**
     * 线下购买，只要把相应的座位设为不可售，把钱化给场馆，在activity表中记录线下营业额，并生成订单
     * @param layoutSids
     * @param pid
     */
    @Override
    public float offlinePurchase(List layoutSids,String email, Long pid,Integer totalAmount,String prices,float totalPrice) {
        Order order = createSeatPurchaseOrder(layoutSids,pid,totalAmount,prices,totalPrice);
        order.setIsOfflinePurchase(true);
        float payPrice = totalPrice;
        if(email!=null){
            Member member = memberRepository.findByEmail(email);
            if(member!=null){
                order.setMember(member);
                float discount = CreditHelper.judgeDiscount(member.getLevel());
                order.setDiscount(discount);
                payPrice = totalPrice*discount;
            }
        }
        order.setPayPrice(payPrice);
        order.setPaySuccess(true);
        orderRepository.save(order);
        //在activity表中记录线下营业额
        Activity activity = periodRepository.findOne(pid).getActivity();
        activity.setOfflineTurnover(activity.getOfflineTurnover()+payPrice);
        activityRepository.save(activity);
        //把钱划给场馆
        Venue venue = activity.getVenue();
        venue.setBalance(venue.getBalance()+payPrice);
        venueRepository.save(venue);
        return payPrice;
    }



    /**
     * 支付订单
     *
     * @param oid
     * @param cid
     * @param payPrice
     * @param bankType
     * @param bid
     * @param bankPsw
     */
    @Override
    public void pay(long mid, long oid, Long cid, float payPrice, String bankType, long bid, String bankPsw, String couponName,float discount) {
        Order order = orderRepository.findOne(oid);
        judgeIscanceled(order);
        long now = System.currentTimeMillis();
        //支付
        Bank bank = bankRepository.findOne(bid);
        //判断支付账号和密码是否正确
        if(bank==null||!bank.getPsw().equals(bankPsw)||!bank.getType().equals(bankType)){
            throw new InvalidRequestException("请检查账号和密码是否正确");
//            return ResultHelper.fillResultString(ResultHelper.WRONG_ACCOUNT,"",null);
        }else if(bank.getBalance()<payPrice){
            throw new InvalidRequestException("余额不足");
//            return ResultHelper.fillResultString(ResultHelper.POOR_BANLANCE,"余额不足",null);
        }else {
            Member member = memberRepository.findOne(mid);
            //从用户账号扣除金额
            bank.setBalance(bank.getBalance()-payPrice);
            bankRepository.save(bank);
            order.setBid(bid);
            order.setCouponName(couponName);
            order.setDiscount(discount);
            order.setPayPrice(payPrice);
            order.setPaySuccess(true);
            orderRepository.save(order);
            //将钱划进经理账号
            Manager manager = managerRepository.findOne(ManagerHelper.mmid);
            double balance = manager.getBalance()+payPrice;
            manager.setBalance(balance);
            managerRepository.save(manager);
            //更新活动的营业额
            Activity activity = order.getPeriod().getActivity();
            double turnover = activity.getTurnover();
            turnover = turnover + payPrice;
            activity.setTurnover(turnover);
            activityRepository.save(activity);

            //将优惠券设为已使用
            if(cid!=null){
                Coupon coupon = couponRepository.findOne(cid);
                coupon.setConsumeTime(now);
                coupon.setOrder(order);
                coupon = couponRepository.saveAndFlush(coupon);
                order.setCoupon(coupon);
            }

            //为用户添加积分
            int credit = member.getCredit()+ CreditHelper.addCredit(payPrice);
            member.setCredit(credit);
            member.setLevel(CreditHelper.judgeLevel(credit));
            memberRepository.save(member);
        }


    }

    /**
     * 在ticket表中找寻此tid的记录，设为已检票。
     *
     * @param tid 活动对应的座位号
     * @return 检票成功与否
     */
    @Override
    public void checkIn(long tid) {
        Ticket ticket = ticketRepository.findOne(tid);
        if(ticket==null){
            throw new ResourceNotFoundException("该号码不存在");
        }else if(ticket.getIsUnSubscribed()){
            throw new ResourceNotFoundException("该订单已被退订");
        }else if(ticket.getIsCanceled()){
            throw new ResourceNotFoundException("该订单已被取消");
        }else if(ticket.getIsChecked()){
            throw new InvalidRequestException("不要重复检票");
        }
        ticket.setIsChecked(true);
        ticketRepository.save(ticket);
    }

    /**
     * 获得指定场次和等级的剩余票数
     *
     * @param pid
     * @param level
     * @return
     */
    @Override
    public int getSeatsLeftCount(long pid, int level) {
        return seatRepository.countByPeriod_PidAndLevel(pid,level);
    }

    /**
     * 在seat数据表中找寻此vid和layout_sid的记录，判断是否可售，并返回
     *
     * @param pid        场馆ID
     * @param layoutSid 座位的物理ID
     * @return 是否可售
     */
    @Override
    public boolean isAvailable(long pid, int layoutSid) {
        Seat seat = seatRepository.findByPeriod_PidAndLayoutSid(pid,layoutSid);
        return seat.getIsAvailable();
    }

    public void judgeIscanceled(Order order) {
        if(order==null){
            throw new InvalidRequestException("此订单不存在");
        }
        if(order.getPaySuccess()){
            throw new InvalidRequestException("订单已支付");
        }
        //判断有没有超过15分钟
        long now = System.currentTimeMillis();
        if(now-order.getOrderDate()>1000*60*3){
            //如果订单没有取消，则取消订单
            if(!order.getIsCanceled()){
                cancelOrder(order);
            }
            throw new ResourceNotFoundException("支付超时，订单已自动取消");
        }
    }

    @Scheduled(cron = "0 * * * * ?")
    @Transactional
    @Modifying
    public void cancelOrders(){
        long time = System.currentTimeMillis()-1000*60*3;
        List<Order> orders = orderRepository.findByIsUnSubscribedAndPaySuccessAndIsCanceledAndOrderDateLessThan(false,false,false,time);
        for(Order order:orders){
            cancelOrder(order);
        }
    }

    @Scheduled(cron="0 * * * * ?")
    public void allocateTickets(){
        logger.info(DateHelper.format(System.currentTimeMillis()));
        long allocateDate = System.currentTimeMillis()+1000*60*60*24*20;
        System.out.println(DateHelper.format(allocateDate));
//        System.out.println(DateHelper.format(1521770400000l));
        //找到已经预订（没有退订）并且立即购买并且支付成功并且尚未配票的并且距离开始时间<=20天的订单进行配票
        List<Order> orders = orderRepository.findByIsUnSubscribedAndIsImmediatePurchaseAndPaySuccessAndIsAllocatedAndPeriod_BeginLessThanEqual(false,true,true,false,allocateDate);
        System.out.println(orders.size());
        for(Order order:orders){
            List<Seat> seats = seatRepository.findByPeriod_PidAndLevelAndIsAvailable(order.getPeriod().getPid(),order.getLevel(),true);
            //如果座位不够，则退订
            if(seats.size()<order.getTotalAmount()){
                logger.info("座位不够");
                order.setIsUnSubscribed(true);
                order.setIsAllocated(true);
                order.setAllocateSucceeded(false);
                unSubscribeByOrder(order);
            }else {
                List<Seat> lockedSeats = seats.subList(0,order.getTotalAmount());
                boolean result = orderSeat(lockedSeats);
                if(!result){
                    logger.info("被抢");
                    order.setIsUnSubscribed(true);
                    order.setIsAllocated(true);
                    order.setAllocateSucceeded(false);
                    unSubscribeByOrder(order);
                }else {
                    logger.info("分配了");
                    order.setIsAllocated(true);
                    order.setAllocateSucceeded(true);
                    orderRepository.save(order);
                    for(Seat seat:lockedSeats){
                        Ticket ticket = new Ticket();
                        ticket.setSeat(seat);
                        ticket.setOrder(order);
                        ticket.setTid(-1l);
                        ticketRepository.save(ticket);
                    }
                }
            }
        }
    }

    //退订订单
    private UnsubscribeModel unSubscribeByOrder(Order order){
        double payPrice = order.getPayPrice();
        double unSubscribeFees = 0.0;
        //如果是立即购买并且尚未配票
        if(order.getIsImmediatePurchase()&&!order.getIsAllocated()){
            //则不需要手续费
            unSubscribeFees = 0.0;
        }else {
            unSubscribeFees = UnSubscribeHelper.computeUnsubscribeFees(order.getOrderDate(),order.getPeriod().getBegin(),payPrice);
        }
        double returnMoney = payPrice-unSubscribeFees;
        System.out.println(returnMoney);
        System.out.println(unSubscribeFees);
        Bank bank = bankRepository.findOne(order.getBid());
        bank.setBalance(bank.getBalance()+returnMoney);
        bankRepository.save(bank);
        //设置订单中的手续费
        order.setUnSubscribeFees(unSubscribeFees);
        //更新活动的营业额
        Activity activity = order.getPeriod().getActivity();
        double turnover = activity.getTurnover()-payPrice;
        activity.setTurnover(turnover);
        activityRepository.save(activity);
        //从经理账号划出钱
        Manager manager = managerRepository.getOne(ManagerHelper.mmid);
        double balance = manager.getBalance() - returnMoney;
        manager.setBalance(balance);
        managerRepository.save(manager);
        orderRepository.save(order);
        return new UnsubscribeModel(returnMoney,unSubscribeFees);
    }



    /**
     * 将指定座位设为不可售
     *
     * @param seats
     * @return
     */
    private synchronized boolean orderSeat(List<Seat> seats) {
        for(int i=0;i<seats.size();i++){
            Seat seat = seats.get(i);
            if(seat.getIsAvailable()){
                seat.setIsAvailable(false);
            }else {
                //如果当前座位不可售，则释放之前的座位，并返回false
                for(int j=0;j<i;j++){
                    Seat seat1 = seats.get(j);
                    seat1.setIsAvailable(true);
                }
                return false;
            }
        }
        seatRepository.save(seats);
        return true;
    }


    /**
     * 取消超时支付的订单
     * @param order
     */
    private void cancelOrder(Order order){
        order.setIsCanceled(true);
        order.setPaySuccess(false);
        //如果是选座购买，则要把其中的座位设为可售.票设为已取消
        List<Ticket> tickets = order.getTickets();
        List<Seat> seats = new ArrayList<>();
        System.out.println(tickets.size()+"超时取消");
        for(Ticket ticket:tickets){
            ticket.setIsCanceled(true);
            Seat seat = ticket.getSeat();
            System.out.println(seat.getLayoutSid()+" "+seat.getRow()+"排"+seat.getColumn()+"座"+seat.getIsAvailable());
            seat.setIsAvailable(true);
            seats.add(seat);
        }
        seatRepository.save(seats);
        ticketRepository.save(tickets);
        orderRepository.save(order);
    }
}
