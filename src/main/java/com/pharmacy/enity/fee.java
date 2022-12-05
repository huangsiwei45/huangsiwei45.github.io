package com.pharmacy.enity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class fee {
    private int id;
    private String medicine;
    private String type;
    private Integer number;
    private int price;
    private String user;
    private Date date;
}
