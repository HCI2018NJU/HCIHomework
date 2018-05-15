package ticketson.service.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ticketson.dao.*;
import ticketson.entity.*;
import ticketson.exception.InvalidRequestException;
import ticketson.model.ActivitySettleModel;
import ticketson.model.ManagerStatisticsModel;
import ticketson.model.VenueModel;
import ticketson.model.VenueModifyModel;
import ticketson.service.ManagerService;
import ticketson.util.ManagerHelper;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by shea on 2018/2/6.
 */
@Service
public class ManagerServiceImpl implements ManagerService {
    @Autowired
    ActivityRepository activityRepository;
    @Autowired
    VenueRepository venueRepository;
    @Autowired
    VenueModifyRepository venueModifyRepository;
    @Autowired
    ManagerRepository managerRepository;
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    MemberRepository memberRepository;

    @Override
    public void login(String account, String psw) {
        Manager manager = managerRepository.findOne(account);
        if(manager==null||!manager.getPsw().equals(psw)){
            throw new InvalidRequestException("账号或密码错误");
        }
    }

    /**
     * 获得待审批的场馆列表
     *
     * @param page    第几页
     * @param perPage 每页几项
     * @return 待审批的场馆列表
     */
    @Override
    public List<VenueModel> getVenuesToCheck(int page, int perPage) {
        Pageable pageable = new PageRequest(page,perPage,Sort.Direction.ASC,"registerTime");
        Page<Venue> venuePage = venueRepository.findByChecked(false,pageable);
        List<Venue> venues = venuePage.getContent();
        List<VenueModel> venueModels = new ArrayList<>();
        for(Venue venue:venues){
            VenueModel venueModel = new VenueModel(venue);
            venueModels.add(venueModel);
        }
        return venueModels;
    }

    @Override
    public int countVenuesToCheck() {
        return venueRepository.countByChecked(false);
    }

    @Override
    public List<VenueModifyModel> getVenueModifyToCheck(int page, int perPage) {
        Pageable pageable = new PageRequest(page,perPage,Sort.Direction.ASC,"modifyTime");
        Page<VenueModify> venuePage = venueModifyRepository.findByChecked(false,pageable);
        List<VenueModify> venueModifies = venuePage.getContent();
        List<VenueModifyModel> venueModifyModels = new ArrayList<>();
        for(VenueModify venueModify:venueModifies){
            VenueModifyModel venueModifyModel = new VenueModifyModel(venueModify);
            venueModifyModels.add(venueModifyModel);
        }
        return venueModifyModels;
    }

    @Override
    public int countVenueModifyToCheck() {
        return venueModifyRepository.countByChecked(false);
    }

    /**
     * 审核场馆
     *
     * @param vid      场馆ID
     * @param isPassed 审核是否通过
     * @return
     */
    @Override
    public void checkVenue(String vid, boolean isPassed) {
        Venue venue = venueRepository.findOne(vid);
        if(venue.getChecked()){
            throw new InvalidRequestException("此场馆已被审核过，无需再次审核");
        }
        venue.setChecked(true);
        venue.setCheckPassed(isPassed);
        venueRepository.save(venue);
    }

    @Override
    public void checkVenueModify(String vid, boolean isPassed) {
        System.out.println("审核修改");
        VenueModify venueModify = venueModifyRepository.findOne(vid);
        if(venueModify==null){
            throw new InvalidRequestException("找不到该场馆");
        }else if(venueModify.getChecked()) {
            throw new InvalidRequestException("此场馆修改已被审核过，无需再次审核");
        }
        venueModify.setChecked(true);
        venueModify.setCheckPassed(isPassed);
        venueModifyRepository.save(venueModify);
        if(isPassed){
            Venue venue = venueRepository.findOne(vid);
            if(venue==null){
                throw new InvalidRequestException("找不到该场馆");
            }
            venue.setProvinceCode(venueModify.getProvinceCode());
            venue.setCityCode(venueModify.getCityCode());
            venue.setDistrictCode(venueModify.getDistrictCode());
            venue.setLocation(venueModify.getLocation());
            venue.setName(venueModify.getName());
            venueRepository.save(venue);
        }
    }

    /**
     * 获得待结算的活动列表
     *
     * @param page    第几页
     * @param perPage 每页几项
     * @return 待审批的场馆列表
     */
    @Override
    public List<ActivitySettleModel> getActivitiesToSettle(int page, int perPage) {
        Pageable pageable = new PageRequest(page,perPage, Sort.Direction.ASC,"end");
        //找到已经结束售票的并且未结算的活动列表
        Page<Activity> activityPage = activityRepository.findByTurnoverSettledAndEndSellLessThan(false,System.currentTimeMillis(),pageable);
        List<Activity> activities = activityPage.getContent();
        List<ActivitySettleModel> activitySettleModels = new ArrayList<>();
        for(Activity activity:activities){
            ActivitySettleModel activitySettleModel = new ActivitySettleModel(activity);
            activitySettleModels.add(activitySettleModel);
        }
        return activitySettleModels;
    }

    @Override
    public int countActivititesToSettle() {
        return activityRepository.countByTurnoverSettled(false);
    }

    /**
     * 结算所有活动
     *
     * @param total
     * @param bankPsw
     */
    @Override
    public void settleAllActivity(Double total, String bankPsw) {
        Manager manager = managerRepository.findOne(ManagerHelper.mmid);
        if(!manager.getBankPsw().equals(bankPsw)){
            throw new InvalidRequestException("密码错误");
        }
        List<Activity> activities = activityRepository.findByTurnoverSettled(false);
        double actualTotal = 0;
        for(Activity activity:activities){
            actualTotal += activity.getTurnover()*(1-ManagerHelper.dividend) ;
        }
        if(actualTotal!=total){
            throw new InvalidRequestException("结算总金额错误");
        }
        if(manager.getBalance()<total){
            throw new InvalidRequestException("余额不足");
        }
        manager.setBalance(manager.getBalance()-total);
        managerRepository.save(manager);
        for(Activity activity:activities){
            activity.setTurnoverSettled(true);
        }

        activityRepository.save(activities);
    }


    /**
     * 结算单个活动
     *
     * @param aid
     * @param total
     * @param bankPsw
     */
    @Override
    public void settleSingleActivity(Long aid, Double total, String bankPsw) {
        Manager manager = managerRepository.findOne(ManagerHelper.mmid);
        if(!manager.getBankPsw().equals(bankPsw)){
            throw new InvalidRequestException("密码错误");
        }
        Activity activity = activityRepository.findOne(aid);
        if(activity==null){
            throw new InvalidRequestException("不能找到该活动");
        }
        if( activity.getTurnover()*(1-ManagerHelper.dividend) !=total){
            throw new InvalidRequestException("结算总金额错误");
        }
        if(manager.getBalance()<total){
            throw new InvalidRequestException("余额不足");
        }
        manager.setBalance(manager.getBalance()-total);
        activity.setTurnoverSettled(true);
        activityRepository.save(activity);
    }

    /**
     * 得到近五个月的统计数据
     *
     * @return
     */
    @Override
    public ManagerStatisticsModel getStatistics() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yy年M月");
        //此时
        Calendar end = Calendar.getInstance();
        //五个月之前
        Calendar begin = Calendar.getInstance();
        begin.set(end.get(Calendar.YEAR),end.get(Calendar.MONTH)-4,1);
        //得到近五个月注册的用户
        List<Member> members = memberRepository.findByRegisterTimeGreaterThanEqualAndRegisterTimeLessThanEqual(begin.getTimeInMillis(),end.getTimeInMillis());
        //得到近五个月注册的场馆
        int checkPassedNum = venueRepository.countByCheckedAndCheckPassedAndRegisterTimeGreaterThanEqualAndRegisterTimeLessThanEqual(true,true,begin.getTimeInMillis(),end.getTimeInMillis());
        int checkFailNum = venueRepository.countByCheckedAndCheckPassedAndRegisterTimeGreaterThanEqualAndRegisterTimeLessThanEqual(true,false,begin.getTimeInMillis(),end.getTimeInMillis());
        //得到近五个月支付成功并且未退订的订单
        List<Order> subscribeOrders = orderRepository.findByIsUnSubscribedAndPaySuccessAndOrderDateGreaterThanEqualAndOrderDateLessThanEqual(false,true,begin.getTimeInMillis(),end.getTimeInMillis());
        //得到近五个月支付成功并且已退订的订单
        List<Order> unsubscribeOrders = orderRepository.findByIsUnSubscribedAndPaySuccessAndOrderDateGreaterThanEqualAndOrderDateLessThanEqual(true,true,begin.getTimeInMillis(),end.getTimeInMillis());
        Map<String,Double> trendSubscribe = new TreeMap<>();
        Map<String,Double> trendUnsubscribe = new TreeMap<>();
        //初始化收入走势的map
        Calendar j = begin;
        while (j.getTimeInMillis()<=end.getTimeInMillis()){
            trendSubscribe.put(simpleDateFormat.format(j.getTime()),0.0);
            trendUnsubscribe.put(simpleDateFormat.format(j.getTime()),0.0);
            j.set(j.get(Calendar.YEAR),j.get(Calendar.MONTH)+1,1);
        }
        for(Order order:subscribeOrders){
            //设置该月的订单收入金额
            Calendar orderDate = Calendar.getInstance();
            orderDate.setTimeInMillis(order.getOrderDate());
            String orderDateKey = simpleDateFormat.format(orderDate.getTime());
            trendSubscribe.replace(orderDateKey,(double)order.getPayPrice()*ManagerHelper.dividend+trendSubscribe.get(orderDateKey));
        }
        for(Order order:unsubscribeOrders){
            //设置该月的订单收入金额
            Calendar orderDate = Calendar.getInstance();
            orderDate.setTimeInMillis(order.getOrderDate());
            String orderDateKey = simpleDateFormat.format(orderDate.getTime());
            trendUnsubscribe.replace(orderDateKey,(double)order.getUnSubscribeFees()+trendUnsubscribe.get(orderDateKey));
        }
        Map<String,Integer> venueRegister = new TreeMap<>();
        venueRegister.put("审核通过",checkPassedNum);
        venueRegister.put("审核不通过",checkFailNum);
        Map<String,Integer> memberLevel = new TreeMap<>();
        System.out.println(members.size()+"====================");
        for(Member member:members){
            String key = member.getLevel()+"级";
            if(memberLevel.containsKey(key)){
                memberLevel.replace(key,memberLevel.get(key)+1);
            }else {
                memberLevel.put(key,1);
            }
        }

        return new ManagerStatisticsModel(trendSubscribe,trendUnsubscribe,memberLevel,venueRegister);
    }
}
