package ticketson.service;

import ticketson.model.ActivitySettleModel;
import ticketson.model.ManagerStatisticsModel;
import ticketson.model.VenueModel;
import ticketson.model.VenueModifyModel;

import java.util.List;

/**
 * Created by shea on 2018/2/5.
 */
public interface ManagerService {
    public void login(String account,String psw);
    /**
     * 获得待审批的场馆列表
     * @param page 第几页
     * @param perPage 每页几项
     * @return 待审批的场馆列表
     */
    public List<VenueModel> getVenuesToCheck(int page, int perPage);

    public int countVenuesToCheck();

    public List<VenueModifyModel> getVenueModifyToCheck(int page, int perPage);

    public int countVenueModifyToCheck();

    /**
     * 审核场馆
     * @param vid 场馆ID
     * @param isPassed 审核是否通过
     * @return
     */
    public void checkVenue(String vid,boolean isPassed);

    public void checkVenueModify(String vid,boolean isPassed);

    /**
     * 获得待结算的活动列表
     * @param page 第几页
     * @param perPage 每页几项
     * @return 待审批的场馆列表
     */
    public List<ActivitySettleModel> getActivitiesToSettle(int page, int perPage);

    public int countActivititesToSettle();

    /**
     * 结算所有活动
     * @param total
     * @param bankPsw
     */
    public void settleAllActivity(Double total,String bankPsw);

    /**
     * 结算单个活动
     * @param aid
     * @param total
     * @param bankPsw
     */
    public void settleSingleActivity(Long aid,Double total,String bankPsw);

    /**
     * 得到近五个月的统计数据
     * @return
     */
    public ManagerStatisticsModel getStatistics();
}
