package com.pharmacy.enity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created by Administrator on 2020/3/20 0020.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class medicine {
    private int id;
    private String medicine;
    private int price;
    private String type;
    private String effect;
    private int number;
}
