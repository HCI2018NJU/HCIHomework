package ticketson.model;

/**
 * Created by shea on 2018/3/16.
 */
public class SeatModel {
    public long sid;

    public int layout_sid;
    /**
     * 是否可售
     */
    public boolean isAvailable;

    public int level;

    public float price;

    public int row;

    public int column;

    public String floor;

    /**
     * 看台  grandstand
     */
    public String gs;

    public SeatModel() {
    }

}
