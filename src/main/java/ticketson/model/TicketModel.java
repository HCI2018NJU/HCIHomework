package ticketson.model;

import ticketson.entity.Seat;
import ticketson.entity.Ticket;

/**
 * Created by shea on 2018/3/14.
 */
public class TicketModel {
    public long tid;
    /**
     * 座位状态：销售中，已售出，已预订
     */
    public String state;
    
    public Long sid;

    public int layoutSid;

    public int row;

    public int column;

    public String floor;

    /**
     * 看台  grandstand
     */
    public String gs;

    public int level;

    public float price;

    public TicketModel() {
    }

    public TicketModel(Ticket ticket){
        this.tid = ticket.getTid();
        Seat seat = ticket.getSeat();
        if(seat!=null){
            setSeatInfo(seat);
            setState(ticket.getIsUnSubscribed(),seat.getIsAvailable(),ticket.getIsChecked());
        }
    }

    public void setSeatInfo(Seat seat){
        this.sid = seat.getSid();
        this.layoutSid = seat.getLayoutSid();
        this.row = seat.getRow();
        this.column = seat.getColumn();
        this.floor = seat.getFloor();
        this.gs = seat.getGs();
        this.level = seat.getLevel();
        this.price = seat.getPrice();
    }

    public void setState(boolean isUnsubscribed,boolean isAvailable,boolean isChecked){
        if(!isUnsubscribed&&isChecked){
            state = "已检票";
        }else if(!isUnsubscribed&&!isChecked){
            state = "已预订";
        }else if(isUnsubscribed && isAvailable){
            state = "销售中";
        }else if(isUnsubscribed&&!isAvailable){
            state = "已售出";
        }

    }

    @Override
    public String toString() {
        return "TicketModel{" +
                "tid=" + tid +
                ", state='" + state + '\'' +
                ", sid=" + sid +
                ", layoutSid=" + layoutSid +
                ", row=" + row +
                ", column=" + column +
                ", floor='" + floor + '\'' +
                ", gs='" + gs + '\'' +
                ", level=" + level +
                ", price=" + price +
                '}';
    }
}
