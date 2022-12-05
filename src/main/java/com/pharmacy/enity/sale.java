package com.pharmacy.enity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class sale {
    private int id;
    private String medicine;
    private String type;
    private int number;
    private int sale;
}
