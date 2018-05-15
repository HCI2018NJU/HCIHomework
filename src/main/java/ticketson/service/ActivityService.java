package ticketson.service;

import org.springframework.web.multipart.MultipartFile;
import ticketson.model.*;

import java.util.List;

/**
 * Created by shea on 2018/2/5.
 */
public interface ActivityService {

    /**
     * 找到文件a_aid_lid，没有就创建,并将layout写入文件
     * @param aid 活动ID
     * @param lid 本次活动的layoutID
     * @param layout 平面图
     * @return 写入成功与否
     */
    public void writeActivityLayout(long aid,int lid,String layout);

    /**
     * //找到a_aid_[0-9]的文件，读取内容，写进一个字符串数组
     * @param aid 场馆ID
     * @return
     */
    public List<String> getLayouts(long aid);


    /**
     * 场馆提交活动基本信息
     * @param vid 场馆注册码
     * @param name 活动名称
     * @param periods 活动的时间段
     * @param type 活动类型
     * @param description 活动描述
     * @return
     */
    public SpecificActivityModel insertActivity(String vid,String name,String type,String description,String[] periods, String url, String prices);

    /**
     * 获得活动详情
     * @param aid
     * @return
     */
    public SpecificActivityModel getActivity(long aid);

    /**
     * 向activity表、period表、seat表插入数据
     * @param aid 活动ID
     * @param seatModels 座位信息（位置等级价格等），每一个活动计划虽然有多个时间段，但是每个活动只有一组平面图，但是会存储多组座位信息。
     * 每次初始化活动平面图的时候，根据座位ID查询相关组的座位信息，判断是否可售
     * @return 返回预计收入和不包含手续费和aid，之间用_链接
     */
    public void insertActivitySeats(long aid, List<SeatModel> seatModels);

    public void setLowestPrice(long aid,float lowestPrice);

    public String postPhoto(String vid, MultipartFile file);

    /**
     * 在activity数据表中找寻符合数目的记录列表,获得正在卖票的活动
     * @param page 第几页
     * @param perPage 每页几个活动
     * @return 正在卖票的活动
     */
    public List<SimpleActivityModel> getActivities(int page, int perPage);

    public int getActivitiesTotalNum();

    /**
     根据场馆ID得到活动
     * @param vid
     * @param type -1表示已经结束，0表示进行，1表示尚未开始
     * @param page
     * @param pageNum
     * @return
     */
    public List<ActivityModel> getActivitiesByVid(String vid, int type, int page, int pageNum);

    /**
     * 根据场馆ID得到活动数目
     * @param vid
     * @param type -1表示已经结束，0表示进行，1表示尚未开始
     * @return
     */
    public int getActivitiesTotalNumByVid(String vid,int type);

    public int getStatisticsTotalNum(String vid);

    public List<ActivityStatisticsModel> getStatistics(String vid, int page, int perPage);

}
